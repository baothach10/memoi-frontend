import { getUserProfile } from "@/app/api/getUserProfile";
import Footer from "@/components/ui/organisms/Footer";
import AccountContent from "@/components/ui/pages/account/AccountContent";

export default async function AccountPage() {
  const userProfile = await getUserProfile();

  return (
    <div className="px-[100px] max-tablet:px-[5%] relative w-full bg-[#fffefa]" data-header-theme="light">
      <AccountContent userProfile={userProfile} />
      <Footer />
    </div>
  );
}
