import Image from 'next/image'
import Link from 'next/link'
import InstagramIcon from '../../atoms/InstagramIcon'

type Props = {
    src: string
    href?: string
    alt?: string
    className?: string
}

export default function GridHyperImageItem({
    src,
    href = 'https://www.instagram.com/',
    alt = 'Instagram image',
    className = '',
}: Props) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open on Instagram"
            className={`block cursor-pointer ${className}`}
        >
            {/* ✅ Pure CSS aspect-ratio — zero JS, zero re-renders on resize
          Matches your original breakpoints:
          - default (mobile):  5/7  → aspect-[5/7]
          - >767px (tablet):   5/6  → sm:aspect-[5/6]
          - ≥1000px:           5/7  → (use a custom breakpoint or approx with lg)
          - ≥1440px (desktop): 3/4  → 2xl:aspect-[3/4]
          Adjust breakpoint tokens to match your tailwind.config exactly.    */}
            <div className="relative w-full group aspect-5/7 smaller-tablet:aspect-5/6 min-[1000px]:aspect-5/7 min-[1440px]:aspect-3/4">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    unoptimized
                    sizes="(min-width: 1440px) 25vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                />

                {/* Hover overlay — CSS-only, no isMobile hook needed.
            laptop: prefix shows it only on non-touch/desktop viewports. */}
                <div className="absolute inset-0 items-center justify-center bg-black/0 hover:bg-black/40 transition-all hidden laptop:flex">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <InstagramIcon color="white" width={48} height={48} />
                    </div>
                </div>
            </div>
        </Link>
    )
}