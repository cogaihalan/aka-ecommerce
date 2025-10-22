"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoPlayerProps } from "@/types/extensions/course";

export function VideoPlayer({
  src,
  title,
  poster,
  autoPlay = false,
  controls = true,
  onEnded,
  onTimeUpdate,
  onDurationChange,
  className,
  ...props
}: VideoPlayerProps & React.VideoHTMLAttributes<HTMLVideoElement>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.volume = value[0];
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  }, []);

  const handleMute = useCallback(() => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleFullscreen = useCallback(() => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  const handleRestart = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
  }, []);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
      onDurationChange?.(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("ended", handleEnded);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("ended", handleEnded);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [onTimeUpdate, onDurationChange, onEnded]);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [autoPlay]);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      console.log("Video loading started");
    };

    const handleCanPlay = () => {
      console.log("Video can play");
    };

    const handleError = (e: any) => {
      console.error("Video error:", e);
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [src]);

  return (
    <div
      className={cn(
        "relative group h-full bg-black rounded-lg overflow-hidden",
        className
      )}
      onClick={handlePlayPause}

      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={handlePlayPause}
        preload="metadata"
        crossOrigin="anonymous"
        playsInline
        {...props}
      />

      {controls && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
            "flex flex-col justify-end",
            "transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Progress Bar */}
          <div className="px-4 pb-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/50"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRestart}
                className="text-white hover:bg-white/50"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 text-white text-sm">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMute}
                  className="text-white hover:bg-white/50"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                className="text-white hover:bg-white/50"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
