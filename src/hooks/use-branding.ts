"use client";

import { useState, useEffect, useCallback } from "react";

export interface BrandingConfig {
  cabinetName: string;
  logoDataUrl: string | null;
  accentColor: string;
}

const STORAGE_KEY = "fiscalai-branding";

const DEFAULT_BRANDING: BrandingConfig = {
  cabinetName: "",
  logoDataUrl: null,
  accentColor: "#2563eb",
};

export function useBranding() {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBranding({ ...DEFAULT_BRANDING, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const saveBranding = useCallback((config: BrandingConfig) => {
    setBranding(config);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore quota errors
    }
  }, []);

  const updateField = useCallback(
    <K extends keyof BrandingConfig>(field: K, value: BrandingConfig[K]) => {
      setBranding((prev) => {
        const next = { ...prev, [field]: value };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  return { branding, saveBranding, updateField, loaded };
}
