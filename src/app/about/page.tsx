import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MobileHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Heading */}
        <h1 className="text-3xl font-bold text-primary-red mb-8">
          About Confluence Lube
        </h1>

        {/* Introduction */}
        <p className="text-gray-600 mb-8">
          At Confluence Lube, we're dedicated to delivering high-quality
          lubricants and oil solutions that keep your engines running smoothly
          and efficiently. With a passion for innovation and customer
          satisfaction, we've established ourselves as a trusted name in the
          industry.
        </p>

        {/* Mission Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-red mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600">
            Our mission is to be the preferred lubricant and oil solutions
            provider, recognized for our commitment to quality, customer
            satisfaction, and environmental responsibility. We strive to build
            long-lasting relationships with our clients, providing them with
            tailored solutions that meet their unique needs.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-red mb-4">
            Our Values
          </h2>
          <ul className="list-disc pl-6 space-y-4 text-gray-600">
            <li>
              <span className="font-semibold">Customer Focus:</span> We're
              committed to understanding and meeting the needs of our customers.
            </li>
            <li>
              <span className="font-semibold">Quality:</span> We deliver
              high-quality products that meet the highest industry standards.
            </li>
            <li>
              <span className="font-semibold">Integrity and Trust:</span> We
              operate with honesty, transparency, and ethics, building trust
              with our customers and partners.
            </li>
          </ul>
        </section>

        {/* History Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-red mb-4">
            Our History
          </h2>
          <p className="text-gray-600">
            Confluence Lube and Oil Company was founded in 2024 on the
            principles of quality, integrity, and customer satisfaction. Over
            the years, we've grown and evolved to become a leading provider of
            lubricant and oil solutions.
          </p>
        </section>

        {/* Products Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-red mb-4">
            Our Products and Services
          </h2>
          <p className="text-gray-600">
            We offer a wide range of products and services designed to meet the
            diverse needs of our customers. From industrial lubricants to
            automotive oils, our products are designed to deliver exceptional
            performance and value.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-red mb-4">
            Why Choose Us?
          </h2>
          <ul className="list-disc pl-6 space-y-4 text-gray-600">
            <li>
              <span className="font-semibold">Expertise:</span> Our team has
              extensive knowledge and experience in the lubricant and oil
              industry.
            </li>
            <li>
              <span className="font-semibold">Quality Products:</span> We offer
              high-quality products that meet the highest industry standards.
            </li>
            <li>
              <span className="font-semibold">Customer-Centric Approach:</span>{" "}
              We prioritize our customers' needs, providing personalized support
              and service.
            </li>
          </ul>
        </section>

        {/* CTA */}
      </div>

      <div className="mt-[200px]">
        <Footer />
      </div>
    </div>
  );
}
