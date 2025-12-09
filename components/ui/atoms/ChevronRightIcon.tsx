import { IconProps } from "@/types"

function ChevronRightIcon({ color = 'black', width = 20, height = 20 }: IconProps) {
    return (
        <svg width={width} height={height} viewBox={`0 0 20 20`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 5L12.5 10L7.5 15" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        </svg>


    )
}

export default ChevronRightIcon