"use client";

import ExpandableSection from "../../molecules/ExpandableSection";

export default function MemoiCare() {
    return (
        <div className="text-sm space-y-6">
            <div className="space-y-5">
                <h2 className="uppercase text-[16px] leading-[120%] max-mobile:text-sm">MEMOÍ care</h2>
                <div className="text-black space-y-2 leading-normal max-mobile:text-xs">
                    <p>
                        Each MEMOÍ piece is crafted with precision, care, and devotion - designed to accompany you through moments of quiet grace and everyday confidence. To preserve the beauty and longevity of your garment, we invite you to care for it with the same mindfulness with which it was made.
                    </p>
                </div>
            </div>
            <div>
                <ExpandableSection title={"GENERAL CARE"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-5" defaultOpen={true}>
                    <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs">
                        <p>
                            Our garments are made from delicate, premium fabrics such as silk, satin, taffeta, chiffon, and cotton blends. These materials require gentle handling to maintain their natural texture and fluidity.
                        </p>
                        <p>
                            We recommend avoiding prolonged exposure to direct sunlight, moisture, or contact with perfumes and cosmetics that may affect the fabric’s quality over time.
                        </p>
                    </div>
                </ExpandableSection>
                <ExpandableSection title={"WASHING & DRYING"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-5" defaultOpen={true}>
                    <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs">
                        <div className="space-y-2">
                            <p>To ensure lasting softness and color integrity:</p>
                            <ul className="list-['-_'] list-inside  space-y-2">
                                <li>Dry clean is recommended for silk, satin, taffeta, and chiffon.</li>
                                <li>For cotton-blend pieces, use a gentle hand wash in cold water with mild detergent.</li>
                                <li>Avoid wringing or twisting. Gently press excess water with a soft towel.</li>
                                <li>Air dry in shade and avoid tumble drying.</li>
                            </ul>
                        </div>
                    </div>
                </ExpandableSection>
                <ExpandableSection title={"IRONING & STEAMING"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-5" defaultOpen={true}>
                    <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs">

                        <ul className="list-['-_'] list-inside  space-y-2">
                            <li>Use a steamer for a natural, crease-free finish.</li>
                            <li>If ironing is necessary, use the lowest heat setting and place a cloth between the iron and the fabric.</li>
                            <li>Do not apply direct heat to delicate surfaces or embroidery details.</li>

                        </ul>

                    </div>
                </ExpandableSection>
                <ExpandableSection title={"STORAGE & HANDLING"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-5" defaultOpen={true}>
                    <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs">

                        <ul className="list-['-_'] list-inside space-y-2">
                            <li>Store garments in a cool, dry place away from sunlight.</li>
                            <li>Hang dresses and tops on padded hangers to maintain their silhouette.</li>
                            <li>For silk and taffeta pieces, use breathable garment bags to prevent moisture buildup.</li>

                        </ul>

                    </div>
                </ExpandableSection>
                <div className="border-t pt-8 space-y-8 border-t-black/10 max-mobile:pt-5 max-mobile:space-y-5">
                    <h2 className=" text-[16px] font-regular max-mobile:text-sm">A Note from MEMOÍ</h2>
                    <div className="text-black leading-normal space-y-2 max-mobile:text-xs">
                        <p>We believe that every piece carries a story - of craftsmanship, elegance, and individuality. By caring for your MEMOÍ garment with intention, you preserve not only its form, but also the quiet luxury it was created to embody.</p>
                        <p>For further garment care guidance, please contact our MEMOÍ Care Team at support@memoiofficial.com.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
