import { IconProps } from "@/types"

function ChevronUpIcon({ color = 'black', width = 20, height = 20 }: IconProps) {
    return (
        <svg width={width} height={height} viewBox={`0 0 20 20`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12.5L10 7.5L15 12.5" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default ChevronUpIcon