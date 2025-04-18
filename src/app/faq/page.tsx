import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import FAQPage from "@/components/pages/Faq";

export default function FaqPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MobileHeader />

        <FAQPage />
      </div>
    </>
  );
}
