import CustomerProductList from "@/components/home/CustomerProductList";
import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";

export default function ProductsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MobileHeader />
        <CustomerProductList />
      </div>
    </>
  );
}
