"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/formatters";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  placeholder?: string;
}

export function CurrencyInput({
  value,
  onChange,
  id,
  placeholder,
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(
    value > 0 ? value.toString() : ""
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    setDisplayValue(value > 0 ? value.toString() : "");
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseFloat(displayValue.replace(/\s/g, ""));
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(Math.round(parsed));
    } else {
      onChange(0);
    }
  }, [displayValue, onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDisplayValue(raw);
      const parsed = parseFloat(raw.replace(/\s/g, ""));
      if (!isNaN(parsed) && parsed >= 0) {
        onChange(Math.round(parsed));
      }
    },
    [onChange]
  );

  return (
    <div className="relative">
      <Input
        id={id}
        type={focused ? "text" : "text"}
        inputMode="numeric"
        value={focused ? displayValue : value > 0 ? formatNumber(value) : ""}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder ?? "0"}
        className="pr-8"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        €
      </span>
    </div>
  );
}
