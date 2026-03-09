"use client";

import { useState } from "react";
import { Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SaveButtonProps {
  type: string;
  inputData: unknown;
  resultData: unknown;
  disabled?: boolean;
}

export function SaveButton({
  type,
  inputData,
  resultData,
  disabled,
}: SaveButtonProps) {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleOpenDialog(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      const res = await fetch("/api/simulation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          client_name: clientName || undefined,
          input_data: inputData,
          result_data: resultData,
        }),
      });

      if (res.status === 401) {
        toast.error("Connectez-vous pour sauvegarder vos simulations.");
        setOpen(false);
        return;
      }

      if (res.status === 402) {
        toast.error(
          "Limite de simulations gratuites atteinte. Passez au plan Pro pour continuer."
        );
        setOpen(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }

      setSaved(true);
      toast.success("Simulation sauvegardée.");
      setOpen(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Erreur lors de la sauvegarde. Vérifiez votre connexion.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleOpenDialog}
        disabled={disabled || saved}
      >
        {saved ? (
          <>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            Sauvegardé
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </>
        )}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sauvegarder la simulation</DialogTitle>
            <DialogDescription>
              Donnez un nom de client pour retrouver facilement cette simulation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="client-name">Nom du client (optionnel)</Label>
            <Input
              id="client-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: SCI Dupont, M. Martin..."
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
