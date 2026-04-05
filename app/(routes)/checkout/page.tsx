import { getUserProfile } from "@/app/api/getUserProfile";
import Footer from "@/components/ui/organisms/Footer";
import CheckoutForm from "@/components/ui/organisms/CheckoutForm";

export default async function CheckoutPage() {
    const userProfile = await getUserProfile();

    return (
        <div className="relative w-full bg-[#fffefa]" data-header-theme="light">
            <section className="w-full px-[100px] max-tablet:px-[5%] pt-32 max-tablet:pt-24 max-mobile:pt-24 pb-20 max-mobile:pb-10">
                <CheckoutForm userProfile={userProfile} />
            </section>
            <Footer />
        </div>
    );
}
