"use client";

import { createContext, useContext, type ReactNode } from "react";

const BkashEnabledContext = createContext(false);

// Must be a component function: a server component can't render a bare
// Context.Provider object imported from a client module (React error #306).
export function BkashEnabledProvider({
  value,
  children,
}: {
  value: boolean;
  children: ReactNode;
}) {
  return (
    <BkashEnabledContext.Provider value={value}>
      {children}
    </BkashEnabledContext.Provider>
  );
}

export const useBkashEnabled = () => useContext(BkashEnabledContext);
