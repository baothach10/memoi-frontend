"use client";

export default function PaymentMethods() {
    return (
        <div>
            <h2 className="uppercase text-[16px] leading-[120%] mb-4">PAYMENT METHODS</h2>
            <div className="text-sm text-black/75">
                <p>MEMOÍ accepts the following secure payment options:</p>
                <ul className="mt-3 list-disc list-inside text-sm">
                    <li>Visa, MasterCard, American Express</li>
                    <li>PayPal</li>
                    <li>Apple Pay</li>
                    <li>Bank Transfer</li>
                    <li>PayNow, PayLah!</li>
                </ul>
                <p className="mt-4 text-sm">All prices displayed on our website are in Singapore Dollars (SGD) and inclusive of GST.</p>
            </div>
        </div>
    );
}
