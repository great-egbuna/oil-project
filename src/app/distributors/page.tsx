import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import CommercialUsersList from "@/components/pages/Distributors";

export default function DistributorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MobileHeader />

      <CommercialUsersList />
    </div>
  );
}
