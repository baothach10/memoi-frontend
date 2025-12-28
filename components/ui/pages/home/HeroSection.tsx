"use client";

import { useState, useRef, forwardRef } from "react";
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
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    return (
      <section
        ref={ref}
        className="h-screen w-full snap-start relative overflow-hidden"
      >
        {/* Desktop Media */}
        {media.type === "image" ? (
          <Image
            src={media.src}
            alt="Hero background"
            fill
            loading="eager"
            sizes="(min-width: 1025px) 100vw, 0px"
            className="object-cover object-center laptop:block hidden"
            priority
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={media.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center laptop:block hidden"
            />
            <VideoControls isPlaying={isPlaying} onToggle={togglePlayPause} />
          </>
        )}

        {/* Tablet Media */}
        {tabletMedia &&
          (tabletMedia.type === "image" ? (
            <Image
              src={tabletMedia.src}
              alt="Hero background"
              fill
              loading="eager"
              sizes="(min-width: 768px) and (max-width: 1024px) 100vw, 0px"
              className="object-cover object-center smaller-tablet:max-tablet:block hidden"
              priority
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={tabletMedia.src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center smaller-tablet:max-tablet:block hidden"
              />
              <VideoControls isPlaying={isPlaying} onToggle={togglePlayPause} />
            </>
          ))}

        {/* Mobile Media */}
        {mobileMedia &&
          (mobileMedia.type === "image" ? (
            <Image
              src={mobileMedia.src}
              alt="Hero background"
              fill
              loading="eager"
              sizes="(max-width: 767px) 100vw, 0px"
              className="object-cover object-center max-mobile:block hidden"
              priority
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={mobileMedia.src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center max-mobile:block hidden"
              />
              <VideoControls isPlaying={isPlaying} onToggle={togglePlayPause} />
            </>
          ))}

        {children}

        {firstParameter && secondParameter && (
          <div className="absolute bottom-10 left-0 right-0 z-10 px-8 max-mobile:bottom-5">
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
                        style={`uppercase laptop:underline decoration-white/40`}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-white">{firstParameter}</p>
                )}
              </div>

              {/* Second Parameter - Link */}
              <div className="text-white text-[1rem] leading-[1.2] max-mobile:text-sm">
                <LinkItem
                  url={secondParameter.url}
                  title={secondParameter.title}
                  style="capitalize underline decoration-white/40"
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
