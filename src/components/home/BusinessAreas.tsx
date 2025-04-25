"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function BusinessAreas() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const areas = [
    {
      title: "SHIELD-X",
      description:
        "The ultimate protection for all petrol engines, from cars and motorcycles to tricycles and machinery.  premium lubricant is designed to deliver exceptional engine performance, fuel efficiency, and longevity",
      image:
        "https://res.cloudinary.com/dx5wmtutn/image/upload/v1745544184/1000033982_bodbnp.jpg",
    },
    {
      title: "SUPPO HD50",
      description:
        "The heavy-duty solution for all diesel engines, from rugged trucks and trailers to commercial diesel vehicles and heavy equipment. This powerful lubricant is engineered to withstand extreme temperatures, pressures, and loads, ensuring maximum protection and durability.",
      image:
        "https://res.cloudinary.com/dx5wmtutn/image/upload/v1745544002/1000033980_cholsy.jpg",
    },
    {
      title: "POWERGEAR",
      description:
        "The versatile gear oil that's suitable for all vehicle types, engines, and machines. This high-performance lubricant is designed to reduce wear and tear, prevent corrosion, and optimize gear performance, ensuring smooth operation and extended equipment life.",
      image:
        "https://res.cloudinary.com/dx5wmtutn/image/upload/v1745543882/1000033978_lwzvuz.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          OUR PRIMARY PRODUCTS
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {areas.map((area, index) => (
            <motion.div
              key={index}
              initial={
                isMobile
                  ? { opacity: 0, translateY: 50 }
                  : { opacity: 0, scale: 0.8 }
              }
              whileInView={
                isMobile
                  ? { opacity: 1, translateY: 0 }
                  : { opacity: 1, scale: 1 }
              }
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                type: "tween",
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={!isMobile ? { scale: 1.05 } : undefined}
              className="bg-white rounded-lg shadow-lg overflow-hidden "
            >
              <div className="relative h-48">
                <Image
                  src={area.image}
                  alt={area.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600">{area.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
