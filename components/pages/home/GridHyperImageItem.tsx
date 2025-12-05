import { useEffect, useState } from 'react'
import Image from 'next/image'

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
    className = ''
}: Props) {
    const [ratios, setRatios] = useState<string>('5/6');

    useEffect(() => {
        const updateRatio = () => {
            const height = typeof window !== 'undefined' ? window.innerHeight : 0;
            setRatios(height >= 1440 ? '9/16' : '5/6');
        };
        updateRatio();
        window.addEventListener('resize', updateRatio);
        return () => window.removeEventListener('resize', updateRatio);
    }, []);

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open on Instagram"
            className={`block ${className}`}
        >
            <div
                className="relative w-full group"
                style={{ aspectRatio: ratios }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover rounded-md"
                />

                <div
                    className="absolute w-full h-full flex items-center bg-black/0 hover:bg-black/40 justify-center transition-all rounded-md"
                >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" fill="none" />
                            <path d="M7 12a5 5 0 1 0 10 0 5 5 0 0 0-10 0z" stroke="white" strokeWidth="1.5" fill="none" />
                            <circle cx="17.5" cy="6.5" r="0.8" fill="white" />
                        </svg>
                    </div>
                </div>
            </div>
        </a>
    )
}