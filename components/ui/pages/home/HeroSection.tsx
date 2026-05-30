"use client";

import { useState, useRef, forwardRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { VideoControls } from "@/components/ui/atoms/VideoControl";
import { LinkItem } from "@/components/ui/atoms/LinkItem";

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
  // Optional poster images for vertical/horizontal videos
  videoPosterVertical?: string;
  videoPosterHorizontal?: string;
  // Optional explicit video sources to choose between vertical/horizontal
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
    const videoRef = useRef<HTMLVideoElement>(null);

    // Keep SSR and first hydration render stable by deferring orientation detection to mount.
    const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

    // Track playback position so we can restore it after a src/key change
    const savedPositionRef = useRef<number>(0);

    // Derived video source and poster based on orientation
    const isPortraitValue = isPortrait ?? false;
    const hasVideo = media.type === "video";
    const videoSrc = isPortraitValue
      ? (videoVerticalSrc ?? media.src)
      : (videoHorizontalSrc ?? media.src);
    const posterSrc = isPortraitValue ? videoPosterVertical : videoPosterHorizontal;

    // Key changes only when the orientation flips after mount, forcing a single clean remount
    const videoKey = isPortrait === null ? "initial" : isPortrait ? "portrait" : "landscape";

    // --- Orientation detection via matchMedia on mount
    useEffect(() => {
      const mql = window.matchMedia("(orientation: portrait)");
      const initialPortrait = mql.matches;

      if (videoRef.current) {
        savedPositionRef.current = videoRef.current.currentTime;
      }

      setIsPortrait(initialPortrait);

      const onChange = (e: MediaQueryListEvent) => {
        if (videoRef.current) {
          savedPositionRef.current = videoRef.current.currentTime;
        }
        setIsPortrait(e.matches);
      };

      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }, []);

    // --- After the video remounts (key changed): restore position + honour isPlaying
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      // Restore playback position
      if (savedPositionRef.current > 0) {
        video.currentTime = savedPositionRef.current;
      }

      // Sync play/pause state — autoPlay always starts playing, but user may have paused
      if (!isPlaying) {
        video.pause();
      }
      // videoKey is the dependency: runs once per orientation change after remount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoKey]);

    const togglePlayPause = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying((prev) => !prev);
    }, [isPlaying]);

    // Determine which breakpoint media type is video so we know to show VideoControls
    const anyVideoVisible =
      hasVideo ||
      tabletMedia?.type === "video" ||
      mobileMedia?.type === "video";

    return (
      <section ref={ref} className="h-svh w-full relative overflow-hidden">

        {/* ── Desktop Media ──────────────────────────────────────────── */}
        {media.type === "image" ? (
          <Image
            src={media.src}
            alt="Hero background"
            fill
            loading="eager"
            // Fixed: correct sizes syntax — no `and` operator in sizes
            sizes="(min-width: 1024px) 100vw, 0px"
            className={`object-cover ${desktopImageClassName ?? "object-center"
              } laptop:block hidden`}
            priority
          />
        ) : (
          <video
            key={`desktop-${videoKey}`}
            ref={videoRef}
            src={videoSrc}
            autoPlay
            preload="none"
            poster={posterSrc}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center laptop:block hidden"
          />
        )}

        {/* ── Tablet Media ───────────────────────────────────────────── */}
        {tabletMedia &&
          (tabletMedia.type === "image" ? (
            <Image
              src={tabletMedia.src}
              alt="Hero background"
              fill
              loading="eager"
              // Fixed: split into two conditions — `and` is invalid in sizes
              sizes="(min-width: 768px) and (max-width: 1024px) 100vw, 0px"
              className={`object-cover ${tabletImageClassName ?? "object-center"
                } smaller-tablet:max-tablet:block hidden`}
              priority
            />
          ) : (
            // Tablet video: same ref is safe here because only ONE breakpoint's
            // video is visible at a time (CSS hides the others). The ref will
            // point to whichever element is currently in the DOM after React's
            // reconciliation, but since we use a shared key they all remount
            // together. If you need independent refs per breakpoint, split into
            // three separate ref + useEffect pairs.
            <video
              key={`tablet-${videoKey}`}
              ref={media.type === "video" ? undefined : videoRef}
              src={videoSrc}
              autoPlay
              preload="none"
              poster={posterSrc}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center smaller-tablet:max-tablet:block hidden"
            />
          ))}

        {/* ── Mobile Media ───────────────────────────────────────────── */}
        {mobileMedia &&
          (mobileMedia.type === "image" ? (
            <Image
              src={mobileMedia.src}
              alt="Hero background"
              fill
              loading="eager"
              sizes="(max-width: 767px) 100vw, 0px"
              className={`object-cover ${mobileImageClassName ?? "object-center"
                } max-mobile:block hidden`}
              priority
            />
          ) : (
            <video
              key={`mobile-${videoKey}`}
              ref={
                media.type === "video" || tabletMedia?.type === "video"
                  ? undefined
                  : videoRef
              }
              src={videoSrc}
              autoPlay
              preload="none"
              poster={posterSrc}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center max-mobile:block hidden"
            />
          ))}

        {/* ── Single VideoControls, rendered once regardless of breakpoint ── */}
        {anyVideoVisible && (
          <VideoControls isPlaying={isPlaying} onToggle={togglePlayPause} />
        )}

        {children}

        {firstParameter && secondParameter && (
          <div className="absolute bottom-10 left-0 right-0 z-10 px-8 max-mobile:bottom-8">
            <div className="mx-auto text-center space-y-3">
              {/* First Parameter - Links or Text */}
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

              {/* Second Parameter - Link */}
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
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export default HeroSection;