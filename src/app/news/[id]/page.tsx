import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NewsDetailPageComponent from "@/components/pages/NewsDetails";

export default function NewssDetailsPage() {
  return (
    <>
      <Header />

      <NewsDetailPageComponent />
      <div className="mt-[200px]">
        <Footer />
      </div>
    </>
  );
}
