"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function BusinessAreas() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const areas = [
    {
      title: "Low Carbon Solutions",
      description:
        "Helping reduce emissions by providing solutions to our industrial and commercial customers in growing markets for carbon capture and storage, hydrogen and biofuels.",
      image:
        "https://images.pexels.com/photos/12174063/pexels-photo-12174063.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Product Solutions Company",
      description:
        "Integrating our downstream and chemical operations to develop lower-emission fuels and innovative products critical to modern society.",
      image:
        "https://images.pexels.com/photos/20500733/pexels-photo-20500733/free-photo-of-close-up-of-a-person-refueling-the-car-at-a-gas-station.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Upstream Company",
      description:
        "Focused on strengthening energy security by expanding low-cost-of-supply, high-return oil and natural gas operations.",
      image:
        "https://images.pexels.com/photos/2284164/pexels-photo-2284164.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Our Three Primary Businesses
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
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
              className="bg-white rounded-lg shadow-lg overflow-hidden"
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
