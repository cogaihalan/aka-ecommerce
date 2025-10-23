import { useState, useCallback } from 'react';

/**
 * Custom hook to extract video duration from a File object
 * 
 * This hook creates a temporary video element to load the file and extract
 * its duration metadata. It includes timeout handling and error management
 * to prevent hanging and provide user feedback.
 * 
 * @returns Object containing:
 * - getVideoDuration: Function to extract duration from a File
 * - isLoading: Boolean indicating if duration detection is in progress
 * - error: String containing any error message
 */
export function useVideoDuration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVideoDuration = useCallback(async (file: File): Promise<number | null> => {
    if (!file || !file.type.startsWith('video/')) {
      setError('Invalid video file');
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);

      const handleLoadedMetadata = () => {
        const duration = Math.round(video.duration);
        URL.revokeObjectURL(url);
        setIsLoading(false);
        resolve(duration);
      };

      const handleError = () => {
        URL.revokeObjectURL(url);
        setError('Failed to load video metadata');
        setIsLoading(false);
        resolve(null);
      };

      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(url);
        setError('Timeout while loading video metadata');
        setIsLoading(false);
        resolve(null);
      }, 10000); // 10 second timeout

      video.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout);
        handleLoadedMetadata();
      });
      video.addEventListener('error', () => {
        clearTimeout(timeout);
        handleError();
      });
      
      video.src = url;
      video.load();
    });
  }, []);

  return {
    getVideoDuration,
    isLoading,
    error,
  };
}
