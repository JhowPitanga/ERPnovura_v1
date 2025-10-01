import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type ChatChannel = {
  id: string;
  type: 'dm' | 'team';
  name?: string | null;
  category?: string | null;
  created_by: string;
};

export type ChatMember = {
  user_id: string;
  role: 'owner' | 'member';
};

export type ChatMessage = {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export function useChatChannels() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChannels = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_channel_members')
        .select(`
          channel_id,
          chat_channels:channel_id (
            id,
            type,
            name,
            category,
            created_by
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const mapped: ChatChannel[] = (data || [])
        .map((row: any) => row.chat_channels)
        .filter(Boolean);

      setChannels(mapped);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message || 'Falha ao carregar canais', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
    if (!user) return;

    const channel = supabase
      .channel('realtime-chat-channels')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_channels' }, fetchChannels)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_channel_members' }, fetchChannels)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const directChannels = useMemo(() => channels.filter(c => c.type === 'dm'), [channels]);
  const teamChannels = useMemo(() => channels.filter(c => c.type === 'team'), [channels]);

  const createTeam = async (name: string, category: string, memberIds: string[]) => {
    if (!user) return { error: 'Usuário não autenticado' };
    try {
      const { data: channel, error: chError } = await supabase
        .from('chat_channels')
        .insert({ type: 'team', name, category, account_id: user.id, created_by: user.id })
        .select('*')
        .single();
      if (chError) throw chError;

      const membersPayload = [
        { channel_id: channel.id, user_id: user.id, role: 'owner' },
        ...memberIds.filter(id => id !== user.id).map(id => ({ channel_id: channel.id, user_id: id, role: 'member' }))
      ];

      const { error: mError } = await supabase
        .from('chat_channel_members')
        .insert(membersPayload);
      if (mError) throw mError;

      toast({ title: 'Equipe criada', description: 'Canal de equipe criado com sucesso.' });
      await fetchChannels();
      return { data: channel };
    } catch (err: any) {
      const msg = err?.message || 'Falha ao criar equipe';
      const details = err?.details || '';
      const code = err?.code || err?.status || '';
      const isNotFound = `${msg} ${details} ${code}`.toLowerCase().includes('404') || `${details}`.toLowerCase().includes('not found');
      toast({
        title: isNotFound ? 'Recurso ausente (404) na criação de grupo' : 'Erro ao criar equipe',
        description: isNotFound
          ? 'Verifique se as tabelas chat_channels e chat_channel_members existem no Supabase e se a URL/KEY estão corretas.'
          : msg,
        variant: 'destructive'
      });
      return { error: msg };
    }
  };

  const startDirectMessage = async (otherUserId: string) => {
    if (!user) return { error: 'Usuário não autenticado' };
    try {
      const { data: candidateChannels } = await supabase
        .from('chat_channels')
        .select('id')
        .eq('type', 'dm');

      let foundId: string | null = null;
      if (candidateChannels) {
        for (const ch of candidateChannels) {
          const { data: members } = await supabase
            .from('chat_channel_members')
            .select('user_id')
            .eq('channel_id', ch.id);
          const memberIds = (members || []).map((m: any) => m.user_id);
          if (memberIds.length === 2 && memberIds.includes(user.id) && memberIds.includes(otherUserId)) {
            foundId = ch.id; break;
          }
        }
      }

      if (!foundId) {
        const { data: newChannel, error: chErr } = await supabase
          .from('chat_channels')
          .insert({ type: 'dm', account_id: user.id, created_by: user.id })
          .select('*')
          .single();
        if (chErr) throw chErr;

        const { error: memErr } = await supabase
          .from('chat_channel_members')
          .insert([
            { channel_id: newChannel.id, user_id: user.id, role: 'owner' },
            { channel_id: newChannel.id, user_id: otherUserId, role: 'member' },
          ]);
        if (memErr) throw memErr;
      }

      await fetchChannels();
      return { ok: true };
    } catch (err: any) {
      toast({ title: 'Erro ao iniciar DM', description: err.message, variant: 'destructive' });
      return { error: err.message };
    }
  };

  return { loading, channels, directChannels, teamChannels, fetchChannels, createTeam, startDirectMessage };
}

export function useChannelMessages(channelId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    if (!channelId) return;
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message || 'Falha ao carregar mensagens', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchMessages();
    if (!channelId) return;
    const channel = supabase
      .channel(`realtime-chat-messages-${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `channel_id=eq.${channelId}` }, fetchMessages)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [channelId]);

  const sendMessage = async (content: string) => {
    if (!user || !channelId || !content.trim()) return;
    try {
      setSending(true);
      const { error } = await supabase
        .from('chat_messages')
        .insert({ channel_id: channelId, sender_id: user.id, content });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: 'Erro ao enviar mensagem', description: err.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return { messages, sendMessage, sending };
}

export async function fetchAccountMembers(currentUserId: string) {
  // Para DMs, permitir enviar para qualquer membro da plataforma (tabela `users`).
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .neq('id', currentUserId);
  if (error) throw error;
  // Como não há perfil extendido aqui, retornamos apenas IDs.
  return (data || []).map((u: any) => ({ id: u.id }));
}