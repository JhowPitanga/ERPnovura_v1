import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StorageManagementDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingStorage?: { id: string; name: string; active: boolean };
  onSaved?: () => void;
}

export function StorageManagementDrawer({
  open,
  onOpenChange,
  existingStorage,
  onSaved,
}: StorageManagementDrawerProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingStorage) {
      setName(existingStorage.name || "");
      setActive(existingStorage.active ?? true);
    } else {
      setName("");
      setActive(true);
    }
  }, [existingStorage, open]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Nome obrigatório", description: "Informe o nome do armazém.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (existingStorage?.id) {
        const { error } = await supabase
          .from("storage")
          .update({ name, active })
          .eq("id", existingStorage.id);
        if (error) throw error;
        toast({ title: "Armazém atualizado", description: "As alterações foram salvas." });
      } else {
        const { error } = await supabase
          .from("storage")
          .insert([{ name, active }]);
        if (error) throw error;
        toast({ title: "Armazém criado", description: "Novo armazém cadastrado com sucesso." });
      }
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar armazém";
      toast({ title: "Erro", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{existingStorage ? "Editar Armazém" : "Novo Armazém"}</DrawerTitle>
        </DrawerHeader>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storage-name">Nome do Armazém</Label>
            <Input id="storage-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Armazém Principal" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Ativo</p>
              <p className="text-xs text-muted-foreground">Disponível para seleção nos filtros e operações</p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{existingStorage ? "Salvar alterações" : "+ Criar Armazém"}</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}