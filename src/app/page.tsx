import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import BusinessAreas from "@/components/home/BusinessAreas";
import AboutSection from "@/components/home/AboutSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <BusinessAreas />
      </main>
      <Footer />
    </div>
  );
}
