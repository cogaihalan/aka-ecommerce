"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAppStore } from "@/stores/app-store";
import { AppContextType } from "@/types/app-context";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const store = useAppStore();

  // Initialize app data on mount
  useEffect(() => {
    if (!store.isInitialized && !store.isLoading) {
      store.initializeApp();
    }
  }, [store.isInitialized, store.isLoading, store.initializeApp]);

  const contextValue: AppContextType = {
    // Categories
    categories: store.categories,

    // Loading states
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    error: store.error,

    // Actions
    refreshCategories: store.refreshCategories,
    initializeApp: store.initializeApp,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Convenience hooks for specific data
export function useCategories() {
  const { categories } = useApp();
  return { categories };
}

export function useAppLoading() {
  const { isLoading, isInitialized, error } = useApp();
  return { isLoading, isInitialized, error };
}
