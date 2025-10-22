export interface Course {
  id: number;
  name: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy?: number;
}

export interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
}