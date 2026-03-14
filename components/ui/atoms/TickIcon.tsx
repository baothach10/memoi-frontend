import { IconProps } from "@/types"


function TickIcon({ color = 'black', width = 14, height = 14 }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export default TickIcon