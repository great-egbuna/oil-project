import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AllNewsPage from "@/components/pages/AllNewsPage";

export default function AllNews() {
  return (
    <>
      <Header />

      <AllNewsPage />

      <div className="mt-[200px]">
        <Footer />
      </div>
    </>
  );
}
