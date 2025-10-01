import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Plus, Hash, Users, Settings, Star, StarOff, Trash2, Smile, Paperclip, AtSign, Mic } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChannelMessages, useChatChannels, fetchAccountMembers } from "@/hooks/useChat";
import { CreateTeamModal } from "./CreateTeamModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

export function ChatTab() {
  const { user } = useAuth();
  const { teamChannels, directChannels } = useChatChannels();
  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(undefined);
  const { messages, sendMessage } = useChannelMessages(selectedChannelId);
  const [compose, setCompose] = useState("");
  const [openCreateTeam, setOpenCreateTeam] = useState(false);
  const [openStartDM, setOpenStartDM] = useState(false);
  const [members, setMembers] = useState<{ id: string; email?: string; nome?: string }[]>([]);
  const [dmTarget, setDmTarget] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<'todos'|'nao_lidos'|'favoritos'>('todos');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Não selecionar automaticamente um canal ao abrir o módulo de chat.
  // Mantemos o estado vazio para exibir a imagem e a mensagem inicial.

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(`chat:favorites:${user.id}`);
    setFavorites(raw ? JSON.parse(raw) : []);
  }, [user]);

  const toggleFavorite = (channelId: string) => {
    if (!user) return;
    setFavorites(prev => {
      const next = prev.includes(channelId) ? prev.filter(id => id !== channelId) : [...prev, channelId];
      localStorage.setItem(`chat:favorites:${user.id}`, JSON.stringify(next));
      return next;
    });
  };

  const filteredDM = useMemo(() => {
    let list = directChannels.map(c => ({...c, name: c.name || `DM com ${(c.id || '').slice(0,6)}`}));
    if (filter === 'favoritos') list = list.filter(c => favorites.includes(c.id));
    return list.filter(c => `${c.name || ''}`.toLowerCase().includes(search.toLowerCase()));
  }, [directChannels, search, filter, favorites]);
  const filteredTeams = useMemo(() => {
    let list = teamChannels;
    if (filter === 'favoritos') list = list.filter(c => favorites.includes(c.id));
    return list.filter(c => `${c.name || ''}${c.category || ''}`.toLowerCase().includes(search.toLowerCase()));
  }, [teamChannels, search, filter, favorites]);

  const onSend = async () => {
    if (!compose.trim()) return;
    await sendMessage(compose.trim());
    setCompose("");
  };

  const currentChannel = useMemo(() => {
    return [...directChannels, ...teamChannels].find(c => c.id === selectedChannelId);
  }, [selectedChannelId, directChannels, teamChannels]);

  const loadMembers = async () => {
    if (!user) return;
    const list = await fetchAccountMembers(user.id);
    setMembers(list);
  };

  const deleteCurrentChannel = async () => {
    if (!selectedChannelId) return;
    await supabase.from('chat_channels').delete().eq('id', selectedChannelId);
    setSelectedChannelId(undefined);
    setConfirmDeleteOpen(false);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full bg-white">
      {/* Left sidebar */}
      <div className="col-span-12 lg:col-span-3 rounded-xl bg-white flex flex-col">
        <div className="p-4 flex items-center gap-2 flex-wrap">
          <Input className="flex-1 min-w-0 h-11 text-sm" placeholder="Pesquisar usuários ou grupos" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="nao_lidos">Não lidos</SelectItem>
              <SelectItem value="favoritos">Favoritos</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setOpenCreateTeam(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Novo grupo
          </Button>
        </div>

        {favorites.length > 0 && (
          <div className="p-3 text-xs font-semibold text-gray-500 uppercase">Favoritos</div>
        )}
        {favorites.length > 0 && (
          <div className="overflow-auto max-h-40 px-2 space-y-1">
            {[...directChannels, ...teamChannels].filter(c => favorites.includes(c.id)).map(c => (
              <button key={`fav-${c.id}`} onClick={() => setSelectedChannelId(c.id)} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${selectedChannelId===c.id? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                {c.type === 'team' ? <Hash className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                <span className="text-sm text-gray-800">{c.name || 'Conversa direta'}</span>
                <Star className="w-3 h-3 ml-auto text-yellow-500" />
              </button>
            ))}
          </div>
        )}

        <div className="p-3 text-xs font-semibold text-gray-500 uppercase flex items-center justify-between">
          <span>Mensagens diretas</span>
          <Button variant="link" className="text-xs" onClick={() => { setOpenStartDM(true); loadMembers(); }}>NOVA DM</Button>
        </div>
        <div className="overflow-auto max-h-56 px-2 space-y-1">
          {filteredDM.map((c) => (
            <button key={c.id} onClick={() => setSelectedChannelId(c.id)} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${selectedChannelId===c.id? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
              <Users className="w-3 h-3" />
              <span className="text-sm text-gray-800 flex-1">{c.name || 'Conversa direta'}</span>
              <Badge variant="outline" className="text-[10px]">DM</Badge>
              <button className="p-1" onClick={(e) => { e.stopPropagation(); toggleFavorite(c.id); }}>
                {favorites.includes(c.id) ? <Star className="w-3 h-3 text-yellow-500" /> : <StarOff className="w-3 h-3 text-gray-400" />}
              </button>
            </button>
          ))}
          {filteredDM.length === 0 && <div className="text-xs text-gray-500 px-3 pb-2">Nenhuma DM encontrada</div>}
        </div>

        <div className="p-3 text-xs font-semibold text-gray-500 uppercase">Equipes</div>
        <div className="overflow-auto px-2 flex-1 space-y-1">
          {filteredTeams.map((c) => (
            <button key={c.id} onClick={() => setSelectedChannelId(c.id)} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${selectedChannelId===c.id? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
              <Hash className="w-3 h-3" />
              <span className="text-sm text-gray-800">{c.name}</span>
              {c.category && <Badge variant="secondary" className="ml-auto text-[10px]">{c.category}</Badge>}
              <button className="p-1" onClick={(e) => { e.stopPropagation(); toggleFavorite(c.id); }}>
                {favorites.includes(c.id) ? <Star className="w-3 h-3 text-yellow-500" /> : <StarOff className="w-3 h-3 text-gray-400" />}
              </button>
            </button>
          ))}
          {filteredTeams.length === 0 && <div className="text-xs text-gray-500 px-3 pb-2">Nenhuma equipe encontrada</div>}
        </div>
      </div>

      {/* Middle - messages */}
      <div className="col-span-12 lg:col-span-6 flex flex-col">
        {selectedChannelId ? (
          <>
            <div className="p-4 rounded-xl bg-white mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentChannel?.type === 'team' && <Hash className="w-4 h-4" />}
                <span className="font-medium">{currentChannel?.name || 'Conversa'}</span>
                {currentChannel?.type === 'team' && currentChannel?.category && (
                  <Badge variant="outline" className="text-[10px]">{currentChannel.category}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteOpen(true)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
              </div>
            </div>

            <Card className="flex-1 overflow-hidden">
              <CardContent className="h-full flex flex-col">
                <div className="flex-1 overflow-auto space-y-4 py-4">
                  {messages.map((m) => (
                    <div key={m.id} className={`group flex ${m.sender_id===user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm relative ${m.sender_id===user?.id ? 'bg-purple-100 text-purple-900' : 'bg-gray-100 text-gray-800'}`}>
                        <div className="mb-1">{m.content}</div>
                        <div className="text-[10px] text-gray-500">{new Date(m.created_at).toLocaleTimeString()}</div>
                        <div className="absolute -top-6 right-0 hidden group-hover:flex gap-2 bg-white rounded-xl shadow px-2 py-1">
                          {['❤️','😂','😮','😢','👍'].map((r) => (
                            <button key={r} className="text-sm" title="Reagir">{r}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 flex items-center gap-2">
                  <Button variant="ghost" size="icon" title="Emoji" onClick={() => setCompose(prev => prev + ' 😊')}>
                    <Smile className="w-5 h-5" />
                  </Button>
                  <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setCompose(prev => `${prev} [arquivo:${f.name}]`);
                  }} />
                  <Button variant="ghost" size="icon" title="Anexar arquivo" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Mencionar" onClick={() => setCompose(prev => prev + ' @') }>
                    <AtSign className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Áudio">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Input className="flex-1" placeholder="Escreva uma mensagem" value={compose} onChange={(e) => setCompose(e.target.value)} onKeyDown={(e) => { if (e.key==='Enter') onSend(); }} />
                  <Button onClick={onSend} disabled={!selectedChannelId || !compose.trim()}>
                    <Send className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-700/10 p-0">
            <div className="relative w-full h-full min-h-[420px]">
              <img
                src="/images/chat-start.png"
                alt="Início do chat"
                className="absolute inset-0 w-full h-full object-contain"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  if (!el.dataset.fallback) {
                    el.dataset.fallback = '1';
                    el.src = '/images/chat-start.svg';
                  } else {
                    el.style.display = 'none';
                  }
                }}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-700 font-medium bg-white/70 px-3 py-1 rounded-full shadow-sm">Inicie uma nova conversa</div>
            </div>
          </div>
        )}
      </div>

      {selectedChannelId && (
        <div className="col-span-12 lg:col-span-3 rounded-xl bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" />
            <span className="font-medium">Informações</span>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <div>
              <div className="text-xs text-gray-500">Canal</div>
              <div className="font-medium">{currentChannel?.name || '—'}</div>
              {currentChannel?.category && <div className="text-xs">Categoria: {currentChannel.category}</div>}
            </div>
            <div className="text-xs text-gray-500">Permissões</div>
            <div>
              - Acesso restrito a membros
            </div>
          </div>
        </div>
      )}

      <CreateTeamModal open={openCreateTeam} onOpenChange={setOpenCreateTeam} />

      {openStartDM && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setOpenStartDM(false)}>
          <div className="bg-white rounded-xl p-4 w-[320px]" onClick={(e) => e.stopPropagation()}>
            <div className="font-medium mb-2">Iniciar mensagem direta</div>
            <Input placeholder="Pesquisar contatos" className="mb-2" onChange={(e) => setSearch(e.target.value)} />
            <div className="space-y-2 max-h-48 overflow-auto">
              {members.map(m => (
                <button key={m.id} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 ${dmTarget===m.id?'bg-gray-100':''}`} onClick={() => setDmTarget(m.id)}>
                  {m.nome || m.email || m.id}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={() => setOpenStartDM(false)}>Cancelar</Button>
              <Button onClick={async () => { if (dmTarget) { const { startDirectMessage } = useChatChannels(); await startDirectMessage(dmTarget); setOpenStartDM(false); } }}>Iniciar</Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este chat? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCurrentChannel}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}