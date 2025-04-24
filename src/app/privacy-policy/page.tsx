import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function PrivacyPage() {
  return (
    <div>
      <Header />

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 pt-14">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Confluence Lube Oil Privacy Policy
          </h1>
          <p className="text-gray-500">Effective Date: 20th April, 2025</p>
        </div>

        <div className="space-y-8 text-gray-600">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Introduction
            </h2>
            <p>
              Confluence Lube Oil ("we," "us," or "our") is committed to
              protecting the privacy and security of our customers, users, and
              anyone who interacts with us. This Privacy Policy outlines our
              practices regarding the collection, use, disclosure, and
              protection of personal data.
            </p>
          </section>

          {/* Data Collection */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Personal Data We Collect
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2 text-primary-red">
                  We Collect:
                </h3>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Contact Information</li>
                  <li>Account Information</li>
                  <li>Product/Service Information</li>
                  <li>Usage Data</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2 text-primary-red">
                  Collection Methods:
                </h3>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Website Forms</li>
                  <li>Account Creation</li>
                  <li>Payment Processing</li>
                  <li>Cookies & Tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Data Usage & Protection
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-l-4 border-primary-red bg-gray-50">
                <h3 className="font-medium mb-2">We Use Data For:</h3>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Order Fulfillment</li>
                  <li>Account Management</li>
                  <li>Customer Support</li>
                  <li>Marketing & Analytics</li>
                </ul>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h3 className="font-medium mb-2">Security Measures:</h3>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Encryption</li>
                  <li>Access Controls</li>
                  <li>Secure Servers</li>
                  <li>Regular Updates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Rights</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-2 text-primary-blue">You Can:</h3>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Access/Update Data</li>
                  <li>Request Deletion</li>
                  <li>Opt-out of Marketing</li>
                  <li>Object to Processing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact & Legal */}
          <section className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                Contact Us
              </h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  📧{" "}
                  <a
                    href="mailto:support@ConfluenceLube.com"
                    className="text-primary-red hover:underline"
                  >
                    support@ConfluenceLube.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  📞{" "}
                  <a
                    href="tel:07043005952"
                    className="text-primary-red hover:underline"
                  >
                    07043005952
                  </a>{" "}
                  /
                  <a
                    href="tel:08089617092"
                    className="text-primary-red hover:underline"
                  >
                    08089617092
                  </a>
                </p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                Legal Information
              </h2>
              <ul className="space-y-2">
                <li>📜 Governing Law: Federal Republic of Nigeria</li>
                <li>
                  🔒 Children's Privacy: No data collection under 18 years
                </li>
                <li>⚠️ Breach Notification: Immediate disclosure policy</li>
              </ul>
            </div>
          </section>

          {/* Updates */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              We reserve the right to update this policy at any time. Please
              review periodically for changes.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last Updated: 20th April, 2025 | Version 1.0
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
