"use client";

import { PrismicContent } from "@/types/prismic";
import { components } from "@/slices";

interface PrismicPageRendererProps {
  content: PrismicContent;
}

interface SliceData {
  slice_type: string;
  variation: string;
  version: string;
  items: any[];
  primary: any;
  id: string;
  slice_label?: string | null;
}


export function PrismicPageRenderer({
  content,
}: PrismicPageRendererProps) {
  // Type assertion to handle the data structure
  const data = content.data as any;

  // Handle case where data might not have slices
  if (!data.slices || !Array.isArray(data.slices)) {
    console.warn("No slices found in content data");
    return <div>No content available</div>;
  }

  return (
    <div className="prismic-page-content">
      {data.slices.map((slice: SliceData, index: number) => {
        // Map slice_type to component name
        const componentName = slice.slice_type;
        
        // Get the corresponding component
        const SliceComponent = components[componentName as keyof typeof components];
        
        if (!SliceComponent) {
          console.warn(`No component found for slice type: ${slice.slice_type}`);
          return (
            <div key={slice.id || index} className="slice-error bg-red-50 border border-red-200 rounded-lg p-4 m-4">
              <p className="text-red-600 font-medium">Unknown slice type: {slice.slice_type}</p>
              <p className="text-red-500 text-sm mt-1">This slice could not be rendered. Please check your slice configuration.</p>
            </div>
          );
        }

        // Create slice props that match the expected structure for Prismic slice components
        const sliceProps = {
          slice: slice as any, // Type assertion to handle different slice types
          index: index,
          slices: data.slices,
          context: {},
        } as any; // Additional type assertion for the entire props object

        try {
          return <SliceComponent key={slice.id || index} {...sliceProps} />;
        } catch (error) {
          console.error(`Error rendering slice ${slice.slice_type}:`, error);
          return (
            <div key={slice.id || index} className="slice-error bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
              <p className="text-yellow-600 font-medium">Error rendering slice: {slice.slice_type}</p>
              <p className="text-yellow-500 text-sm mt-1">There was an error rendering this slice. Please check the slice data.</p>
            </div>
          );
        }
      })}
    </div>
  );
}
