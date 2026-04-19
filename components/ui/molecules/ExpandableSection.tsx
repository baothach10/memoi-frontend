"use client"

import React, { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import ChevronDownIcon from "@/components/ui/atoms/ChevronDownIcon"
import ChevronUpIcon from "@/components/ui/atoms/ChevronUpIcon"
import useIsMobile from "@/hooks/useIsMobile"

type Props = {
    title: React.ReactNode
    children?: React.ReactNode
    className?: string
    defaultOpen?: boolean
    titleClassName?: string
}

export default function ExpandableSection({ title, children, className = "", defaultOpen = false, titleClassName = "" }: Props) {
    const [open, setOpen] = useState<boolean>(defaultOpen)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const isFirstRender = useRef(true)
    const isMobile = useIsMobile(768);
    const chevronSize = isMobile ? 14 : 20;

    useEffect(() => {
        const el = contentRef.current
        if (!el) return

        if (isFirstRender.current) {
            isFirstRender.current = false
            // On first render, set initial height/opacity without animation
            if (open) {
                gsap.set(el, { height: "auto", opacity: 1 })
            } else {
                gsap.set(el, { height: 0, opacity: 0 })
            }
            return
        }

        // Kill any in-flight tweens
        gsap.killTweensOf(el)

        if (open) {
            // Expand: animate to "auto" and let GSAP handle measurements
            gsap.to(el, {
                height: "auto",
                opacity: 1,
                duration: 0.35,
                ease: "power3.inOut",
                overwrite: true,
            })
        } else {
            // Collapse: animate to 0
            gsap.to(el, {
                height: 0,
                opacity: 0,
                duration: 0.28,
                ease: "power3.inOut",
                overwrite: true,
            })
        }
    }, [open])

    return (
        <div className={` ${className}`}>
            <div className={`flex items-center justify-between cursor-pointer ${titleClassName}`} role="heading" aria-level={3}>
                <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center w-full text-left"
                >
                    <span className="flex-1">{title}</span>
                    <span className="shrink-0">
                        {open ? <ChevronUpIcon width={chevronSize} height={chevronSize} /> : <ChevronDownIcon width={chevronSize} height={chevronSize} />}
                    </span>
                </button>
            </div>

            <div ref={contentRef} aria-hidden={!open} style={{ overflow: "hidden" }}>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}