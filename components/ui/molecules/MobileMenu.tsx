"use client"

import React, { useEffect, useState } from "react"
import HamburgerMenuIcon from "@/components/ui/atoms/HamburgerMenuIcon"
import ExitIcon from "@/components/ui/atoms/ExitIcon"
import ExpandableSection from "@/components/ui/molecules/ExpandableSection"
import Link from "next/link"
import useIsMobile from "@/hooks/useIsMobile"

type Props = {
    className?: string
    open?: boolean
    onToggle?: (open: boolean) => void
}

export default function MobileMenu({ className = "", open: openProp, onToggle }: Props) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = typeof openProp === "boolean"
    const open = isControlled ? (openProp as boolean) : internalOpen
    const isMobile = useIsMobile(768);
    const iconSize = isMobile ? 14 : 18;

    const toggle = () => {
        if (isControlled) {
            onToggle?.(!open)
        } else {
            setInternalOpen((v) => {
                const next = !v
                onToggle?.(next)
                return next
            })
        }
    }

    const closeMenu = () => {
        if (isControlled) onToggle?.(false)
        else setInternalOpen(false)
    }

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        if (open) document.body.classList.add('menu-open')
        else document.body.classList.remove('menu-open')

        return () => {
            document.body.style.overflow = ""
            document.body.classList.remove('menu-open')
        }
    }, [open])

    return (
        <div className={`relative ${className}`}>
            <div className='flex relative items-center gap-6 max-mobile:gap-4'>
                <button
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={toggle}
                    className="z-10 relative items-center justify-center max-mobile:flex hidden"
                >
                    {open ? <ExitIcon width={14} height={14} color="black" /> : <HamburgerMenuIcon width={14} height={14} color="white" />}
                </button>
                <button
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={toggle}
                    className="z-10 relative flex items-center justify-center max-mobile:hidden"
                >
                    {open ? <ExitIcon width={18} height={18} color="black" /> : <HamburgerMenuIcon width={18} height={18} color="white" />}
                </button>

                <div className={`relative w-[${iconSize}px] h-[${iconSize}px]`}>
                    <ExitIcon width={18} height={18} color="transparent" />
                </div>
                <div className={`relative w-[${iconSize}px] h-[${iconSize}px] max-tablet:block hidden`}>
                    <ExitIcon width={18} height={18} color="transparent" />
                </div>

            </div>

            {open && (
                <div className="fixed top-[100px] max-mobile:top-12 max-mobile:pt-10 left-0 w-full h-full bg-white text-black">
                    <nav className="relative h-full w-full overflow-auto">
                        <div className="flex flex-col mx-auto">
                            <ExpandableSection defaultOpen className="py-6 px-10 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4" title={<span className="font-regular text-[16px] uppercase max-mobile:text-sm">Collection</span>}>
                                <ul className="space-y-2">
                                    <li><Link href="/collection" onClick={closeMenu} className=" text-[14px] uppercase max-mobile:text-xs">SS26  BECOMING</Link></li>
                                </ul>
                            </ExpandableSection>

                            <ExpandableSection defaultOpen className="py-6 px-10 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4" title={<span className="font-regular text-[16px] uppercase max-mobile:text-sm">Shop</span>}>
                                <ul className="space-y-2">
                                    <li><Link href="/shop" onClick={closeMenu} className=" text-[14px] max-mobile:text-xs">Dresses</Link></li>
                                    <li><Link href="/shop" onClick={closeMenu} className=" text-[14px] max-mobile:text-xs">Tops</Link></li>
                                    <li><Link href="/shop" onClick={closeMenu} className=" text-[14px] max-mobile:text-xs">Skirts</Link></li>
                                    <li><Link href="/shop" onClick={closeMenu} className=" text-[14px] max-mobile:text-xs">Pants</Link></li>
                                </ul>
                            </ExpandableSection>

                            <ExpandableSection defaultOpen className="py-6 px-10 max-mobile:px-4 max-mobile:py-4" title={<span className="font-regular text-[16px] uppercase max-mobile:text-sm">Explore</span>}>
                                <ul className="space-y-2">
                                    <li><Link href="/explore" onClick={closeMenu} className=" text-[14px] max-mobile:text-xs">About us</Link></li>
                                    <li><Link href="/explore" onClick={closeMenu} className=" text-[14px] max-mobile:text-xs">The MEMOÍ House</Link></li>
                                    <li><Link href="/explore" onClick={closeMenu} className=" text-[14px] max-mobile:text-xs">Our Commitments</Link></li>
                                    <li><Link href="/explore" onClick={closeMenu} className=" text-[14px] max-mobile:text-xs">Contact us</Link></li>
                                </ul>
                            </ExpandableSection>

                        </div>
                        <div className="px-10 flex flex-col gap-4 max-mobile:px-4">
                            <Link href="#" onClick={closeMenu}>
                                <span className="font-regular text-[16px] uppercase max-mobile:text-sm">Shopping cart</span>
                            </Link>
                            <Link href="#" onClick={closeMenu}>
                                <span className="font-regular text-[16px] uppercase max-mobile:text-sm">Account</span>
                            </Link>

                        </div>
                    </nav>
                </div>
            )}
        </div>
    )
}