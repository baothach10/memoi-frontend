import Link from 'next/link'
import ChevronRightIcon from '../../atoms/ChevronRightIcon'
import ShippingIcon from '../../atoms/ShippingIcon'
import PaymentIcon from '../../atoms/PaymentIcon'
import CheckIcon from '../../atoms/CheckIcon'
import useIsMobile from '@/hooks/useIsMobile'

type BenefitItemProps = {
    image: string
    title: string
    description: string
    /** optional link; if starts with '/' uses NextLink, otherwise opens in new tab */
    href?: string
    className?: string
}

export default function BenefitItem({
    image,
    title,
    description,
    href,
    className = ''
}: BenefitItemProps) {
    const isMobile = useIsMobile(768);
    const iconSize = isMobile ? 32 : 48;
    const chevronSize = isMobile ? 14 : 20;
    const content = (
        <div className={`relative flex items-center px-8 py-4 smaller-tablet:max-tablet:px-0 max-mobile:px-0 max-mobile:py-2.5 ${className}`}>

            <div className='flex items-center justify-between'>
                <div className="relative self-start min-w-fit mr-7">
                    {image === 'Shipping Icon' && (
                        <ShippingIcon width={iconSize} height={iconSize} />
                    )}
                    {image === 'Payment Icon' && (
                        <PaymentIcon width={iconSize} height={iconSize} />
                    )}
                    {image === 'Check Icon' && (
                        <CheckIcon width={iconSize} height={iconSize} />
                    )}
                </div>

                {/* Title and description in the middle */}
                <div className="flex flex-col gap-2 text-black">
                    <div className="text-[16px] font-regular max-mobile:text-[14px]">{title}</div>
                    <div className="text-[14px] max-mobile:text-[12px]">{description}</div>
                </div>
            </div>

            {/* Arrow on the right */}
            <div className='pl-8'>
                <div className='relative w-4 h-4'>
                    <ChevronRightIcon width={chevronSize} height={chevronSize} />
                </div>
            </div>


        </div >
    )

    if (!href) return content

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