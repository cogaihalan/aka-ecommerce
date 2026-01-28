"use client";

import React, { createContext, useContext, useEffect, ReactNode, useRef } from "react";
import { useAppStore } from "@/stores/app-store";
import { AppContextType } from "@/types/app-context";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const store = useAppStore();
  const initRef = useRef(false);

  // Defer app initialization to avoid blocking TBT
  useEffect(() => {
    if (initRef.current || store.isInitialized || store.isLoading) return;
    initRef.current = true;

    let idleCallbackId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    // Use requestIdleCallback to defer non-critical data fetching
    if ('requestIdleCallback' in window) {
      idleCallbackId = (window as any).requestIdleCallback(
        () => store.initializeApp(),
        { timeout: 2000 } // Start within 2 seconds max
      );
    } else {
      // Fallback: defer to next tick to not block initial render
      timeoutId = setTimeout(() => store.initializeApp(), 500);
    }

    return () => {
      if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
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
  const { categories, refreshCategories } = useApp();

  // Refresh categories when this hook is used
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  return { categories };
}

export function useAppLoading() {
  const { isLoading, isInitialized, error } = useApp();
  return { isLoading, isInitialized, error };
}
