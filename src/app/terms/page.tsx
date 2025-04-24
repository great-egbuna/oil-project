import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function TermsPage() {
  return (
    <div>
      <Header />

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 pt-14">
        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Terms and Conditions
          </h1>
          <p className="text-gray-500">Effective Date: 20th April, 2025</p>
        </div>

        <div className="space-y-8 text-gray-600">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              1. Introduction
            </h2>
            <p>
              These Terms and Conditions ("Terms") govern your use of Confluence
              Lube Oil's ("we," "us," or "our") website, products, and services.
              By interacting with us, you ("user" or "you") agree to these
              Terms.
            </p>
          </section>

          {/* Definitions */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              2. Definitions
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-primary-red">Products</h3>
                <p>Lubricants and related services offered</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-primary-red">Services</h3>
                <p>Product support and consultation</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-primary-red">Website</h3>
                <p>Our online platforms and related services</p>
              </div>
            </div>
          </section>

          {/* Use of Website */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              3. Use of Website and Services
            </h2>
            <div className="p-4 bg-red-50 border-l-4 border-primary-red rounded-lg">
              <p className="font-medium mb-2">Requirements:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  Must be at least{" "}
                  <span className="font-semibold">18 years old</span>
                </li>
                <li>Legitimate purposes only</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-primary-red mb-2">
                Prohibited Activities:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Unlawful or unauthorized use</li>
                <li>Disruption of services</li>
              </ul>
            </div>
          </section>

          {/* Product Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              4. Product Information & Pricing
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium">Pricing Notice:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Prices subject to change</li>
                  <li>Excludes taxes/duties</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="font-medium">Accuracy:</p>
                <p>Errors may occur despite our efforts</p>
              </div>
            </div>
          </section>

          {/* Orders & Payment */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              5. Orders & Payment
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-medium">Payment Terms:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Full payment at order</li>
                  <li>Bank transfers/online/cheques</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Order Processing:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Subject to availability</li>
                  <li>Acceptance required</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Shipping & Returns */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              6. Shipping & Returns
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="font-medium">Delivery:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Estimated times guidance only</li>
                  <li>Third-party delays excluded</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="font-medium">Returns:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>24-hour defect notification</li>
                  <li>Subject to Return Policy</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Legal Sections */}
          <section className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Intellectual Property */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  8. Intellectual Property
                </h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>
                    All rights reserved. No reproduction/distribution without
                    permission.
                  </p>
                </div>
              </div>

              {/* Warranties */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  9. Warranties
                </h2>
                <div className="p-4 bg-green-50 rounded-lg">
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Products conform to specifications</li>
                    <li>Liability limited to purchase amount</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                11. Governing Law
              </h2>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p>
                  Federal Republic of Nigeria
                  <br />
                  Dispute resolution through emails and phone calls
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="p-4 bg-primary-red/10 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              14. Contact Us
            </h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                📧 support@ConfluenceLube.com
              </p>
              <p className="flex items-center gap-2">📍 08089617092</p>

              <p className="flex items-center gap-2">📞 07043005952</p>
            </div>
          </section>

          {/* Additional Provisions */}
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <h3 className="font-semibold mb-2">Additional Provisions:</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Force Majeure</li>
              <li>Severability</li>
              <li>Waiver</li>
            </ul>
          </div>

          {/* Acknowledgement */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              By using our services, you acknowledge reading and agreeing to
              these Terms.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[200px]">
        <Footer />
      </div>
    </div>
  );
}
