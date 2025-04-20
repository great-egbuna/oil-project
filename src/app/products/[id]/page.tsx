import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import ProductDetailsPage from "@/components/productDetails/ProductDetails";

export default function ProductDetails() {
  return (
    <>
      <div className="min-h-screen ">
        <Header />
        <MobileHeader />

        <ProductDetailsPage />
      </div>
      <div className="mt-[200px]">
        <Footer />
      </div>
    </>
  );
}
