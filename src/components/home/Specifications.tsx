export default function Specifications() {
  return (
    <div className="max-w-6xl mx-auto p-6  bg-white py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
        PRODUCT SPECIFICATIONS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SHIELD-X Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-primary-red">SHIELD-X</h3>
            <p className="text-gray-500 text-sm">(PETROL ENGINES)</p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-50 text-primary-red rounded-full text-sm">
                SAE 20W/50
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                API: SL/CF
              </span>
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-2">Available in:</p>
              <div className="grid grid-cols-2 gap-2">
                {["1L", "4L", "25L", "Drum"].map((size) => (
                  <div
                    key={size}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-primary-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {size}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUPPO Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-primary-red">SUPPO</h3>
            <p className="text-gray-500 text-sm">(DIESEL ENGINES)</p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-50 text-primary-red rounded-full text-sm">
                HD50
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                CF/SF
              </span>
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-2">Available in:</p>
              <div className="grid grid-cols-2 gap-2">
                {["4L", "25L", "Drum"].map((size) => (
                  <div
                    key={size}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-primary-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {size}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* POWERGEAR Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-primary-red">POWERGEAR</h3>
            <p className="text-gray-500 text-sm">(GEAR OIL)</p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-50 text-primary-red rounded-full text-sm">
                SAE 85W/140
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                API: GL5
              </span>
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-2">Available in:</p>
              <div className="grid grid-cols-2 gap-2">
                {["1L", "4L", "25L", "Drum"].map((size) => (
                  <div
                    key={size}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-primary-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {size}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
