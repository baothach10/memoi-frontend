"use client";

import Footer from "@/components/ui/organisms/Footer";
import RegisterForm from "@/components/ui/organisms/RegisterForm";

function RegisterPage() {
  return (
    <div className="relative w-full h-full bg-[#fffefa]">
      <section
        data-header-theme="light"
        className="w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-24"
      >
        <RegisterForm />
      </section>
      <Footer />
    </div>
  );
}

export default RegisterPage;
