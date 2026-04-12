import Link from "next/link";
import Footer from "@/components/ui/organisms/Footer";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col" data-header-theme="light">
      <main className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[600px] px-6 py-24 text-center max-tablet:py-72 max-mobile:py-56">
          {/* Large 404 visual */}
          <div className="aspect-6/5 relative">
            <Image
              src="/images/not-found.webp"
              alt="404"
              fill
              className="w-full object-contain"
              style={{ userSelect: "none", pointerEvents: "none" }}
            />
          </div>

          {/* Message */}
          <div className="gap-8">
            <div>
              <h1 className="text-2xl tracking-wide font-regular uppercase max-mobile:text-lg">PAGE NOT FOUND</h1>
              <p className="mt-3 text-black text-sm leading-normal max-mobile:text-xs">
                The page you are looking for doesn’t exist or an other error occured.
              </p>
            </div>

            {/* Return button */}
            <div className="mt-8 max-w-[375px] mx-auto">
              <Link href="/">
                <button className="w-full bg-black text-white py-4 leading-none text-sm max-mobile:text-xs cursor-pointer">
                  Take me home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}