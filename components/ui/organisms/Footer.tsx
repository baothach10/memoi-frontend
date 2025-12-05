import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="flex flex-col mx-auto gap-14 pt-14">
        <div className="flex flex-col text-center justify-center items-center gap-6">
          <Image src={"/icons/memoi-graphic-logo.svg"} alt="Logo" width={120} height={40} />
          <div className="w-3/10 text-[18px]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita
            quisquam architecto sed optio voluptatum eum iste laudantium ad
            earum soluta autem tenetur odit, odio quod voluptate omnis dolorum
            repellat laborum. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Ipsum quasi repudiandae, obcaecati esse facere eius odio nam
            dignissimos accusantium a vel sapiente sed deserunt deleniti!
            Dolorum quam nemo quibusdam odit!
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 w-4/5 mx-auto text-center">
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-semibold mb-2 text-[16px] uppercase">Shop</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Dresses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Tops
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Skirts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pants
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-semibold mb-2 text-[16px] uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  The MEMOÍ House
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Our Commitments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-semibold mb-2 text-[16px] uppercase">Help</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Shipping & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Orders & Payment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  MEMOÍ care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Exchange Request
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-semibold mb-2 text-[16px] uppercase">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm uppercase">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookies Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookies Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4  text-gray-400 text-sm pb-6">
          <div className="flex justify-between px-24">
            <p>&copy; 2025 MyBrand. All rights reserved.</p>
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
