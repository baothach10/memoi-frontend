"use client";

import { useState, useRef, forwardRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { VideoControls } from "@/components/ui/atoms/VideoControl";
import { LinkItem } from "@/components/ui/atoms/LinkItem";
import useViewportInfo from "@/hooks/useViewportInfo";

type LinkObject = {
  url: string;
  title: string;
};

type FirstParameter = LinkObject[] | string;

type SecondParameter = {
  url: string;
  title: string;
};

type MediaContent = {
  type: "image" | "video";
  src: string;
};

type HeroSectionProps = {
  media: MediaContent;
  tabletMedia?: MediaContent;
  mobileMedia?: MediaContent;
  firstParameter?: FirstParameter;
  secondParameter?: SecondParameter;
  children?: React.ReactNode;
  desktopImageClassName?: string;
  tabletImageClassName?: string;
  mobileImageClassName?: string;
  videoPosterVertical?: string;
  videoPosterHorizontal?: string;
  videoVerticalSrc?: string;
  videoHorizontalSrc?: string;
};

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      media,
      mobileMedia,
      tabletMedia,
      firstParameter,
      secondParameter,
      children,
      desktopImageClassName,
      tabletImageClassName,
      mobileImageClassName,
      videoVerticalSrc,
      videoHorizontalSrc,
      videoPosterVertical,
      videoPosterHorizontal,
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const { mounted, isPortrait, breakpoint } = useViewportInfo();

    const horizontalVideoRef = useRef<HTMLVideoElement>(null);
    const verticalVideoRef = useRef<HTMLVideoElement>(null);
    const savedPositionRef = useRef<number>(0);

    // Collect asset srcs for the current active video and images
    const horizontalSrc = videoHorizontalSrc ?? media.src;
    const verticalSrc = videoVerticalSrc ?? media.src;

    const activeVideoSrc = isPortrait ? verticalSrc : horizontalSrc;
    const activePoster = isPortrait ? videoPosterVertical : videoPosterHorizontal;
    const activeVideoSrcValue = activeVideoSrc;

    const desktopImageSrc = media.type === "image" ? media.src : undefined;
    const tabletImageSrc = tabletMedia?.type === "image" ? tabletMedia.src : desktopImageSrc;
    const mobileImageSrc = mobileMedia?.type === "image" ? mobileMedia.src : tabletImageSrc;
    const activeImageSrc =
      breakpoint === "mobile"
        ? mobileImageSrc
        : breakpoint === "tablet"
          ? tabletImageSrc
          : desktopImageSrc;

    const activeImageClassName =
      breakpoint === "mobile"
        ? mobileImageClassName ?? "object-center"
        : breakpoint === "tablet"
          ? tabletImageClassName ?? "object-center"
          : desktopImageClassName ?? "object-center";

    const activeMediaType = (() => {
      if (breakpoint === "mobile") return (mobileMedia ?? tabletMedia ?? media).type;
      if (breakpoint === "tablet") return (tabletMedia ?? media).type;
      return media.type;
    })();

    const showVideo = activeMediaType === "video";

    const saveCurrentPosition = useCallback(() => {
      const activeVideo = isPortrait ? verticalVideoRef.current : horizontalVideoRef.current;
      if (activeVideo) {
        savedPositionRef.current = activeVideo.currentTime;
      }
    }, [isPortrait]);

    useEffect(() => {
      if (!mounted) return;

      const activeVideo = isPortrait ? verticalVideoRef.current : horizontalVideoRef.current;
      const inactiveVideo = isPortrait ? horizontalVideoRef.current : verticalVideoRef.current;
      if (!activeVideo) return;

      if (!showVideo) {
        activeVideo.pause();
        inactiveVideo?.pause();
        return;
      }

      const restorePosition = (video: HTMLVideoElement) => {
        if (savedPositionRef.current <= 0) return;
        const setTime = () => {
          video.currentTime = Math.min(savedPositionRef.current, video.duration || Infinity);
        };
        if (video.readyState >= 1) {
          setTime();
        } else {
          const onLoaded = () => {
            setTime();
            video.removeEventListener("loadedmetadata", onLoaded);
          };
          video.addEventListener("loadedmetadata", onLoaded);
        }
      };

      restorePosition(activeVideo);
      inactiveVideo?.pause();

      if (isPlaying) {
        if (activeVideo.readyState >= 2) {
          activeVideo.play().catch(() => undefined);
        } else {
          const onCanPlay = () => {
            activeVideo.play().catch(() => undefined);
            activeVideo.removeEventListener("canplay", onCanPlay);
          };
          activeVideo.addEventListener("canplay", onCanPlay);
          return () => activeVideo.removeEventListener("canplay", onCanPlay);
        }
      } else {
        activeVideo.pause();
      }
    }, [mounted, isPortrait, isPlaying, showVideo]);

    useEffect(() => {
      const portraitMql = window.matchMedia("(orientation: portrait)");
      const handleChange = () => saveCurrentPosition();
      portraitMql.addEventListener("change", handleChange);
      return () => portraitMql.removeEventListener("change", handleChange);
    }, [saveCurrentPosition]);

    const togglePlayPause = useCallback(() => {
      const activeVideo = isPortrait ? verticalVideoRef.current : horizontalVideoRef.current;
      if (!activeVideo) return;
      if (isPlaying) {
        activeVideo.pause();
      } else {
        activeVideo.play();
      }
      setIsPlaying((prev) => !prev);
    }, [isPlaying, isPortrait]);

    return (
      <section ref={ref} className="h-svh w-full relative overflow-hidden">
        {/* Videos — render only the active orientation video to avoid duplicate hidden loads */}
        {showVideo && (
          <video
            ref={isPortrait ? verticalVideoRef : horizontalVideoRef}
            src={activeVideoSrcValue}
            poster={activePoster}

            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {activeImageSrc && !showVideo && (
          <Image
            src={activeImageSrc}
            fill
            alt="Hero background"
            className={`absolute inset-0 w-full h-full object-cover ${activeImageClassName}`}
          />
        )}

        {mounted && (
          <>
            {showVideo && (
              <VideoControls isPlaying={isPlaying} onToggle={togglePlayPause} />
            )}

            {children}

            {firstParameter && secondParameter && (
              <div className="absolute bottom-10 left-0 right-0 z-10 px-8 max-mobile:bottom-8">
                <div className="mx-auto text-center space-y-3">
                  <div className="text-white text-[1rem] leading-[1.2] max-mobile:text-sm">
                    {Array.isArray(firstParameter) ? (
                      <div className="flex flex-wrap justify-center gap-4 leading-[1.2]">
                        {firstParameter.map((link, index) => (
                          <LinkItem
                            key={index}
                            url={link.url}
                            title={link.title}
                            style="uppercase relative inline-flex cursor-pointer leading-[18px] text-white after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-white/40"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-white">{firstParameter}</p>
                    )}
                  </div>
                  <div className="text-white text-[1rem] max-mobile:text-sm">
                    <LinkItem
                      url={secondParameter.url}
                      title={secondParameter.title}
                      style="capitalize relative inline-flex leading-[18px] cursor-pointer text-white after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-white/40"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";
export default HeroSection;