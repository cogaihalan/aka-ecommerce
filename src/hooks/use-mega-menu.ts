import { useState, useEffect, useRef } from 'react';
import { optimizedPrismicClient } from '@/lib/prismic';

interface ChildLink {
  child_label?: string;
  child_link?: any;
}

interface MenuItem {
  label?: string;
  link?: any;
  has_mega_menu?: boolean;
  child_links?: ChildLink[];
}

interface MegaMenuData {
  menu_title?: string;
  menu_items?: MenuItem[];
}

// Module-level cache to persist across component remounts
let cachedMegaMenuData: MegaMenuData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useMegaMenu() {
  const [megaMenuData, setMegaMenuData] = useState<MegaMenuData | null>(cachedMegaMenuData);
  const [loading, setLoading] = useState(!cachedMegaMenuData);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchMegaMenu = async (force = false) => {
    // Prevent duplicate fetches
    if (fetchingRef.current) return;
    
    // Use cache if available and fresh
    const now = Date.now();
    if (!force && cachedMegaMenuData && (now - cacheTimestamp) < CACHE_DURATION) {
      setMegaMenuData(cachedMegaMenuData);
      setLoading(false);
      return;
    }

    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      const megaMenuDoc = await optimizedPrismicClient.getSingle('mega_menu');
      if (megaMenuDoc?.data) {
        const data = megaMenuDoc.data as any;
        const menuData: MegaMenuData = {
          menu_title: data.menu_title,
          menu_items: data.menu_items || []
        };
        
        // Update cache
        cachedMegaMenuData = menuData;
        cacheTimestamp = Date.now();
        
        setMegaMenuData(menuData);
      }
      
    } catch (error) {
      console.error('Error fetching mega menu:', error);
      setError('Failed to fetch mega menu data');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    let idleCallbackId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    // Defer fetch to avoid blocking initial render
    if ('requestIdleCallback' in window) {
      idleCallbackId = (window as any).requestIdleCallback(
        () => fetchMegaMenu(),
        { timeout: 1500 }
      );
    } else {
      // Small delay to prioritize LCP
      timeoutId = setTimeout(() => fetchMegaMenu(), 100);
    }

    return () => {
      if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const refetch = async () => {
    await fetchMegaMenu(true);
  };

  return { 
    megaMenuData, 
    loading, 
    error,
    refetch
  };
}
