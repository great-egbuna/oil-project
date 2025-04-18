import { FiX } from "react-icons/fi";

export const ContactModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-primary-red transition-colors"
        >
          <FiX size={24} />
        </button>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-primary-red mb-6 text-center">
            Contact Us
          </h2>

          <p className="text-gray-600 mb-6 text-center">
            We're committed to building strong relationships with our customers
            and partners.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <svg
                className="w-6 h-6 text-primary-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-700">Email</p>
                <a
                  href="mailto:support@ConfluenceLube.com"
                  className="text-primary-red hover:underline"
                >
                  support@ConfluenceLube.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <svg
                className="w-6 h-6 text-primary-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-700">Phone</p>
                <div className="space-y-1">
                  <p className="text-gray-600">07043005952</p>
                  <p className="text-gray-600">08089617092</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
