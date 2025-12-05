import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type BenefitItemProps = {
    image: string
    imageAlt?: string
    title: string
    description: string
    /** optional link; if starts with '/' uses NextLink, otherwise opens in new tab */
    href?: string
    className?: string
}

export default function BenefitItem({
    image,
    imageAlt = '',
    title,
    description,
    href,
    className = ''
}: BenefitItemProps) {
    const content = (
        <div className={`relative flex items-center px-6 py-3 ${className}`}>
            
            <div className="relative self-start w-12">
                <Image src={image} alt={imageAlt} width={48} height={48} className="w-full h-full" />
            </div>

            {/* Title and description in the middle */}
            <div className="flex flex-col gap-2 text-black ml-3 ">
                <h4 className="text-[16px] font-bold ">{title}</h4>
                <p className="text-[14px] text-sm ">{description}</p>
            </div>

            {/* Arrow on the right */}
            <Image src={'/icons/chevron-right-icon.svg'} alt={'Right Arrow Icon'} width={5} height={10} className="relative w-4 h-4" />

        </div >
    )

    if (!href) return <div className="rounded-lg">{content}</div>

    const isInternal = href.startsWith('/')
    const wrapperClass = 'block p-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200'

    return isInternal ? (
        <Link href={href} className={wrapperClass}>
            {content}
        </Link>
    ) : (
        <Link href={href} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
            {content}
        </Link>
    )
}