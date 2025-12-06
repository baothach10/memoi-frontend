"use client";

import React, { useState, useRef, forwardRef } from "react";
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
  firstParameter?: FirstParameter;
  secondParameter?: SecondParameter;
};

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ media, firstParameter, secondParameter }, ref) => {
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
        {media.type === "image" ? (
          <Image
            src={media.src}
            alt="Hero background"
            fill
            className="object-cover"
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
              className="absolute inset-0 w-full h-full object-cover"
            />
            <VideoControls isPlaying={isPlaying} onToggle={togglePlayPause} />
          </>
        )}

        {firstParameter && secondParameter && (
          <div className="absolute bottom-10 left-0 right-0 z-10 px-8">
            <div className="mx-auto text-center space-y-3">
              {/* First Parameter - Links or Text */}
              <div className="text-white text-[1rem] leading-[1.2] ">
                {Array.isArray(firstParameter) ? (
                  <div className="flex flex-wrap justify-center gap-4 leading-[1.2]">
                    {firstParameter.map((link, index) => (
                      <LinkItem key={index} url={link.url} title={link.title} style="uppercase" />
                    ))}
                  </div>
                ) : (
                  <p className="text-white">{firstParameter}</p>
                )}
              </div>

              {/* Second Parameter - Link */}
              <div className="text-white text-[1rem] leading-[1.2] ">
                <LinkItem
                  url={secondParameter.url}
                  title={secondParameter.title}
                  style="capitalize"
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
