"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const images = [
  "/images/home/cone.jpg",
  "/images/home/fire.jpg",
  "/images/home/car_refil.jpg",
  "/images/home/light_bulb.jpg",
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px]">
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImageIndex]}
              alt="Energy landscape"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <motion.div
          className="text-white max-w-2xl"
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The Need For Energy Is{" "}
            <span className="text-red-500">Universal</span>
          </h1>
          <p className="text-xl mb-8">
            CL Scientists And Engineers Are Pioneering New Research And Pursuing
            New Technologies To Reduce Emissions While Creating More Efficient
            Fuels.
          </p>
          <Link
            href="/who-we-are"
            className="inline-block bg-blue-900 text-white px-8 py-3 rounded-md hover:bg-blue-800 transition-colors group"
          >
            Learn more{" "}
            <span className="inline-block transition-transform group-hover:scale-125 animate-pulse ml-1">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
