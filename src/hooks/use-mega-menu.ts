import { useState, useEffect } from 'react';
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

export function useMegaMenu() {
  const [megaMenuData, setMegaMenuData] = useState<MegaMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchMegaMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const megaMenuDoc = await optimizedPrismicClient.getSingle('mega_menu');
      if (megaMenuDoc?.data) {
        const data = megaMenuDoc.data as any;
        setMegaMenuData({
          menu_title: data.menu_title,
          menu_items: data.menu_items || []
        });
      }
      
    } catch (error) {
      console.error('Error fetching mega menu:', error);
      setError('Failed to fetch mega menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMegaMenu();
  }, []);

  const refetch = async () => {
    fetchMegaMenu();
  };

  return { 
    megaMenuData, 
    loading, 
    error,
    refetch
  };
}
