"use client";

import { createContext, useContext } from "react";

const BkashEnabledContext = createContext(false);

export const BkashEnabledProvider = BkashEnabledContext.Provider;

export const useBkashEnabled = () => useContext(BkashEnabledContext);
