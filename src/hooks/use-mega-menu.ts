import { useState, useEffect } from 'react';
import { optimizedPrismicClient } from '@/lib/prismic';

interface MenuItem {
  label?: string;
  link?: any;
  has_mega_menu?: boolean;
  layout_type?: "columns" | "featured_products" | "categories" | "mixed";
  columns?: number;
  featured_image?: any;
  description?: any;
  section_title?: string;
  section_links?: string;
  is_featured?: boolean;
  icon?: any;
}

interface MegaMenuData {
  menu_title?: string;
  menu_items?: MenuItem[];
}

export function useMegaMenu() {
  const [megaMenuData, setMegaMenuData] = useState<MegaMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchMegaMenu();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to get from dedicated mega menu document
      try {
        const megaMenuDoc = await optimizedPrismicClient.getSingle('mega_menu');
        if (megaMenuDoc?.data) {
          const data = megaMenuDoc.data as any; // Type assertion for mega menu data
          setMegaMenuData({
            menu_title: data.menu_title,
            menu_items: data.menu_items || []
          });
          return;
        }
      } catch (docError) {
        console.log('No dedicated mega menu document found, trying slice approach');
      }

      // Fallback: try to get mega menu from pages that contain the slice
      try {
        const response = await optimizedPrismicClient.getAllByType('page');
        
        if (response && response.length > 0) {
          const pageWithMegaMenu = response.find((page: any) => 
            page.data.slices?.some((slice: any) => slice.slice_type === 'mega_menu')
          );

          if (pageWithMegaMenu) {
            const megaMenuSlice = pageWithMegaMenu.data.slices.find((slice: any) => 
              slice.slice_type === 'mega_menu'
            );
            
            if (megaMenuSlice) {
              setMegaMenuData({
                menu_title: megaMenuSlice.primary?.menu_title,
                menu_items: megaMenuSlice.items || []
              });
            }
          }
        }
      } catch (sliceError) {
        console.log('No mega menu slice found in pages');
      }
    } catch (err) {
      setError('Failed to fetch mega menu data');
      console.error('Mega menu refetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    megaMenuData, 
    loading, 
    error,
    refetch
  };
}
