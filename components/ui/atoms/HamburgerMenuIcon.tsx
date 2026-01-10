import { IconProps } from "@/types"

function HamburgerMenuIcon({ color = 'black', width = 18, height = 18 }: IconProps) {
    return (
        <svg width={width} height={height} viewBox={`0 0 18 18`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 9H15.75M2.25 4.5H15.75M2.25 13.5H15.75" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default HamburgerMenuIcon