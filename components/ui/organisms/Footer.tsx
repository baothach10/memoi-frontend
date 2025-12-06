import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#fffefa] text-black">
      <div className="flex flex-col mx-auto gap-20 pt-20">
        <div className="flex flex-col text-center justify-center items-center gap-8">
          <Image src={"/icons/memoi-graphic-logo.svg"} alt="Logo" width={62} height={40} />
          <div className="w-[600px] text-[18px] leading-normal tracking-[0.07rem]">
            MEMOÍ exists for the woman becoming herself. We believe true luxury lies in conscious living and timeless quality. Our pieces are an act of service: accessible elegance designed to honor your choices and support your growth.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 w-2/3 mx-auto text-center">
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-regular mb-2 text-[16px] uppercase">Shop</h4>
            <ul className="space-y-2 text-black/60 text-sm">
              <li>
                <a href="#" className="hover:text-black transition">
                  Dresses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Tops
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Skirts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Pants
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-regular mb-2 text-[16px] uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-black/60 text-sm">
              <li>
                <a href="#" className="hover:text-black transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  The MEMOÍ House
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Our Commitments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-regular mb-2 text-[16px] uppercase">Help</h4>
            <ul className="space-y-2 text-black/60 text-sm">
              <li>
                <a href="#" className="hover:text-black transition">
                  Shipping & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Orders & Payment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  MEMOÍ care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Exchange Request
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-regular mb-2 text-[16px] uppercase">Legal</h4>
            <ul className="space-y-2 text-black/60 text-sm">
              <li>
                <a href="#" className="hover:text-black transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Cookies Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Cookies Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black/10 pt-3 text-black text-sm pb-5">
          <div className="flex justify-between px-25">
            <p>&copy; 2025 MEMOI ™. A brand by NPS Apparel & Trading (UEN 53508613W). All rights reserved.</p>
            <div className="flex gap-5">
              <Image
                src={"/facebook.svg"}
                alt="facebook icon"
                width={16}
                height={16}
              />
              <Image
                src={"/instagram.svg"}
                alt="instagram icon"
                width={16}
                height={16}
              />
              <Image
                src={"/tiktok.svg"}
                alt="tiktok icon"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
