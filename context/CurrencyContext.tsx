"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface CurrencyContextType {
  currency: string | null;
  updateCurrency: (newCurrency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string | null>(null);

  const updateCurrency = useCallback((newCurrency: string) => {
    if (!newCurrency) return;
    
    setCurrencyState((prev) => {
      // If the current global currency is nothing, store from the currency field
      if (prev === null) {
        return newCurrency.toUpperCase();
      }
      // Or else check if the local currency is not similar to the global one, override with the local currency
      if (prev !== newCurrency.toUpperCase()) {
        return newCurrency.toUpperCase();
      }
      return prev.toUpperCase();
    });
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
