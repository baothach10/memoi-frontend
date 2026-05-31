"use client";

import { useState, useRef, forwardRef, useEffect, useCallback } from "react";
import { VideoControls } from "@/components/ui/atoms/VideoControl";
import { LinkItem } from "@/components/ui/atoms/LinkItem";
import useViewportInfo from "@/hooks/useViewportInfo";
import { useAssetPrefetch } from "@/hooks/useAssetPrefetch";

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

    // Collect ALL asset srcs upfront — videos + images
    const horizontalSrc = videoHorizontalSrc ?? media.src;
    const verticalSrc = videoVerticalSrc ?? media.src;

    const allSrcs = [
      ...new Set([
        horizontalSrc,
        verticalSrc,
        // Only include image srcs
        media.type === "image" ? media.src : null,
        tabletMedia?.type === "image" ? tabletMedia.src : null,
        mobileMedia?.type === "image" ? mobileMedia.src : null,
      ].filter(Boolean) as string[]),
    ];

    // ✅ Single prefetch for ALL assets — videos and images alike
    const { urls, ready } = useAssetPrefetch(allSrcs);

    const horizontalVideoSrcValue = urls[horizontalSrc] ?? "";
    const verticalVideoSrcValue = urls[verticalSrc] ?? "";

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
      if (!mounted || !ready) return;

      const horizontalVideo = horizontalVideoRef.current;
      const verticalVideo = verticalVideoRef.current;
      if (!horizontalVideo || !verticalVideo) return;

      const activeVideo = isPortrait ? verticalVideo : horizontalVideo;
      const inactiveVideo = isPortrait ? horizontalVideo : verticalVideo;

      if (!showVideo) {
        horizontalVideo.pause();
        verticalVideo.pause();
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
      inactiveVideo.pause();

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
    }, [mounted, ready, isPortrait, isPlaying, showVideo]);

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

        {ready && (
          <>
            {/* Videos — blob URLs, never re-fetched */}
            <video
              ref={horizontalVideoRef}
              src={horizontalVideoSrcValue}
              preload="auto"
              poster={videoPosterHorizontal}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover portrait:hidden"
            />
            <video
              ref={verticalVideoRef}
              src={verticalVideoSrcValue}
              preload="auto"
              poster={videoPosterVertical}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover hidden portrait:block"
            />

            {/* ✅ Native <img> with blob URLs — no Next.js Image pipeline,
                no re-requests on re-render, CSS handles responsive visibility */}
            {media.type === "image" && urls[media.src] && (
              <img
                src={urls[media.src]}
                alt="Hero background"
                className={`absolute inset-0 w-full h-full object-cover ${desktopImageClassName ?? "object-center"} laptop:block hidden`}
              />
            )}
            {tabletMedia?.type === "image" && urls[tabletMedia.src] && (
              <img
                src={urls[tabletMedia.src]}
                alt="Hero background"
                className={`absolute inset-0 w-full h-full object-cover ${tabletImageClassName ?? "object-center"} smaller-tablet:max-tablet:block hidden`}
              />
            )}
            {mobileMedia?.type === "image" && urls[mobileMedia.src] && (
              <img
                src={urls[mobileMedia.src]}
                alt="Hero background"
                className={`absolute inset-0 w-full h-full object-cover ${mobileImageClassName ?? "object-center"} max-mobile:block hidden`}
              />
            )}
          </>
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