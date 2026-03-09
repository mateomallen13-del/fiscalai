"use client";

import { useRef, useState } from "react";
import { Upload, X, Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useBranding } from "@/hooks/use-branding";
import { toast } from "sonner";

const PRESET_COLORS = [
  "#2563eb",
  "#0891b2",
  "#059669",
  "#7c3aed",
  "#dc2626",
  "#ea580c",
  "#0d9488",
  "#4f46e5",
];

export default function ParametresPage() {
  const { branding, updateField, loaded } = useBranding();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (PNG, JPG, SVG).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("logoDataUrl", reader.result as string);
      toast.success("Logo mis à jour.");
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    updateField("logoDataUrl", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Logo supprimé.");
  }

  function handleSave() {
    setSaved(true);
    toast.success("Paramètres enregistrés.");
    setTimeout(() => setSaved(false), 2000);
  }

  if (!loaded) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Paramètres</h1>
      <p className="mt-1 text-muted-foreground">
        Personnalisez votre cabinet pour les rapports PDF.
      </p>

      <div className="mt-8 max-w-2xl space-y-6">
        {/* Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Logo du cabinet</CardTitle>
            <CardDescription>
              Ce logo apparaîtra en haut de chaque rapport PDF généré.
              Formats acceptés : PNG, JPG, SVG (max 2 Mo).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              {branding.logoDataUrl ? (
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={branding.logoDataUrl}
                      alt="Logo cabinet"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <button
                    onClick={removeLogo}
                    className="absolute -right-2 -top-2 rounded-full border bg-white p-1 shadow-sm hover:bg-red-50"
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
              )}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {branding.logoDataUrl ? "Changer le logo" : "Importer un logo"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cabinet name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nom du cabinet</CardTitle>
            <CardDescription>
              Affiché dans l&apos;en-tête des rapports PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm space-y-2">
              <Label htmlFor="cabinet-name">Nom</Label>
              <Input
                id="cabinet-name"
                value={branding.cabinetName}
                onChange={(e) => updateField("cabinetName", e.target.value)}
                placeholder="Cabinet Dupont & Associés"
              />
            </div>
          </CardContent>
        </Card>

        {/* Accent color */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Couleur d&apos;accent</CardTitle>
            <CardDescription>
              Couleur principale utilisée dans les rapports PDF (en-tête, titres, accents).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateField("accentColor", color)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor:
                        branding.accentColor === color ? "#000" : "transparent",
                    }}
                  >
                    {branding.accentColor === color && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="custom-color" className="text-sm">
                  Personnalisée :
                </Label>
                <input
                  id="custom-color"
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="h-8 w-14 cursor-pointer rounded border"
                />
                <span className="text-sm text-muted-foreground">
                  {branding.accentColor}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aperçu en-tête PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="rounded-lg border bg-white p-6"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <div
                className="flex items-center justify-between border-b-2 pb-4"
                style={{ borderColor: branding.accentColor }}
              >
                <div className="flex items-center gap-4">
                  {branding.logoDataUrl && (
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={branding.logoDataUrl}
                        alt="Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-bold" style={{ color: branding.accentColor }}>
                      {branding.cabinetName || "Nom du cabinet"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rapport de simulation fiscale
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{new Date().toLocaleDateString("fr-FR")}</p>
                  <p>Données fiscales 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            {saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Enregistré
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
