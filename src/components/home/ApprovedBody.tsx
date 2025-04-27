export default function ApprovedBodies() {
  const logos = [
    "https://res.cloudinary.com/dx5wmtutn/image/upload/v1745527217/1000033875_tgv5e5.jpg",
    "https://res.cloudinary.com/dx5wmtutn/image/upload/v1745527706/1000033878_fn5dkn.jpg",
    "https://res.cloudinary.com/dx5wmtutn/image/upload/v1745527839/1000033834_uwqk3q.jpg",
    "https://res.cloudinary.com/dx5wmtutn/image/upload/v1745527958/1000033837_lf5oy8.jpg",
    "https://res.cloudinary.com/dx5wmtutn/image/upload/v1745712769/fed_ofinvk.jpg",
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
          APPROVED CERTIFICATIONS
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our products meet the highest standards and are certified by leading
          international organizations.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-lg group"
          >
            <img
              src={logo}
              alt={`Approved Body ${index + 1}`}
              className="h-32 w-full object-contain transform transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
