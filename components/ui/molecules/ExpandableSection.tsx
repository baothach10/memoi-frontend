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
}

export default function ExpandableSection({ title, children, className = "", defaultOpen = false }: Props) {
    const [open, setOpen] = useState<boolean>(defaultOpen)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const isMobile = useIsMobile(768);
    const chevronSize = isMobile ? 14 : 20;

    useEffect(() => {
        const el = contentRef.current
        if (!el) return

        // The inner wrapper holds the children and defines the measured height
        const inner = el.firstElementChild as HTMLElement | null
        if (!inner) return

        // Kill any in-flight tweens
        gsap.killTweensOf(el)

        if (open) {
            // Expand: animate from 0 -> measured height, then set height to auto
            const height = inner.scrollHeight
            // start from 0 in case previous state left explicit height
            el.style.height = "0px"
            el.style.opacity = "0"
            gsap.to(el, {
                height,
                opacity: 1,
                duration: 0.35,
                ease: "power3.inOut",
                onComplete: () => {
                    // remove fixed height so content can grow/shrink naturally
                    el.style.height = "auto"
                },
            })
        } else {
            // Collapse: ensure height is explicit then animate to 0
            const height = inner.scrollHeight
            el.style.height = `${height}px`
            gsap.to(el, {
                height: 0,
                opacity: 0,
                duration: 0.28,
                ease: "power3.inOut",
            })
        }
    }, [open])

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between cursor-pointer" role="heading" aria-level={3}>
                <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center w-full text-left"
                >
                    <span className="flex-1">{title}</span>
                    <span className="shrink-0">
                        {open ? <ChevronDownIcon width={chevronSize} height={chevronSize} /> : <ChevronUpIcon width={chevronSize} height={chevronSize} />}
                    </span>
                </button>
            </div>

            <div ref={contentRef} aria-hidden={!open} style={{ overflow: "hidden" }}>
                <div className={`pt-2`}>
                    {children}
                </div>
            </div>
        </div>
    )
}