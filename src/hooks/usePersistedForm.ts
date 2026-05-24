"use client";

import { useEffect, useState } from "react";
import { AuditFormData } from "../types";

const STORAGE_KEY = "spendlens_form_v1";

const DEFAULT_FORM_DATA: AuditFormData = {
  tools: [],
  teamSize: 5,
  useCase: "coding",
};

export function usePersistedForm() {
  const [formData, setFormData] = useState<AuditFormData>(DEFAULT_FORM_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuditFormData;
        setFormData(parsed);
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // Ignore storage errors
    }
  }, [formData, isLoaded]);

  const clearForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(DEFAULT_FORM_DATA);
  };

  return { formData, setFormData, clearForm, isLoaded };
}
