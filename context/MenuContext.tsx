"use client"

import React, { createContext, useContext, useCallback, useState } from "react"

type MenuContextType = {
    open: boolean
    setOpen: (v: boolean) => void
    toggle: () => void
    close: () => void
    openMenu: () => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    const toggle = useCallback(() => setOpen((v) => !v), [])
    const close = useCallback(() => setOpen(false), [])
    const openMenu = useCallback(() => setOpen(true), [])

    return (
        <MenuContext.Provider value={{ open, setOpen, toggle, close, openMenu }}>
            {children}
        </MenuContext.Provider>
    )
}

export function useMenu() {
    return useContext(MenuContext)
}
