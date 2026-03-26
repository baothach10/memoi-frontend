import OrderDetailContent from "@/components/ui/pages/account/OrderDetailContent";
import Footer from "@/components/ui/organisms/Footer";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (

    <div className="px-[100px] max-tablet:px-[5%] relative w-full bg-[#fffefa]" data-header-theme="light">

      <OrderDetailContent orderId={id} />

      <Footer />
    </div>
  );
}
