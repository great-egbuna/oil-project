"use client";

import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import cone from "../../assets/images/home/cone.jpg";
import mobileOne from "../../assets/images/home/mobile-one.png";
import pcOne from "../../assets/images/home/pcOne.jpg";
import tabOne from "../../assets/images/home/tabOne.jpg";
import imgMobileTwo from "../../assets/images/home/image-two-mobile.png";
import imgTabTwo from "../../assets/images/home/image-three-tab.jpg";
import imgPCTwo from "../../assets/images/home/image-two-pc.jpg";
import imgPCThree from "../../assets/images/home/image-three-pc.jpg";
import imgTabThree from "../../assets/images/home/image-oil-tab.jpg";
import imgMobileThree from "../../assets/images/home/image-three-mobile.jpg";
import fire from "../../assets/images/home/fire.jpg";
import lightBulb from "../../assets/images/home/light_bulb.jpg";
import Overlay from "../ui/Overlay";
import { ContactModal } from "./ContactUs";
import { adminService } from "@/service/admin.service";
import { FullScreenLoader } from "../ui/Loader";
import { cn } from "@/lib/utils";

interface ImageData {
  url: StaticImageData;
  alt: string;
}

const defaultImages: ImageData[] = [
  { url: cone, alt: "Oil cone" },
  { url: fire, alt: "Energy fire" },
  { url: lightBulb, alt: "Light bulb energy" },
  { url: pcOne, alt: "Engine oil" },
  { url: imgPCTwo, alt: "Industrial lubricant" },
  { url: imgPCThree, alt: "Oil refinery" },
];

const mobileImages: ImageData[] = [
  { url: cone, alt: "Oil cone" },
  { url: fire, alt: "Energy fire" },
  { url: lightBulb, alt: "Light bulb energy" },
  { url: mobileOne, alt: "Mobile oil" },
  { url: imgMobileTwo, alt: "Engine maintenance" },
  { url: imgMobileThree, alt: "Oil products" },
];

const tabImages: ImageData[] = [
  { url: cone, alt: "Oil cone" },
  { url: fire, alt: "Energy fire" },
  { url: lightBulb, alt: "Light bulb energy" },
  { url: tabOne, alt: "Tablet oil" },
  { url: imgTabTwo, alt: "Factory lubricant" },
  { url: imgTabThree, alt: "Oil storage" },
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [images, setImages] = useState<ImageData[]>(defaultImages);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        setDeviceType("mobile");
        setImages(mobileImages);
      } else if (screenWidth <= 1024) {
        setDeviceType("tablet");
        setImages(tabImages);
      } else {
        setDeviceType("desktop");
        setImages(defaultImages);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await adminService.getLandingDescription();
        setDesc(content?.description || "");
        setLoading(false);
      } catch (error) {
        console.error("Error loading content:", error);
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Hide text after 3rd image for all device types
  const showTextContent = currentImageIndex < 3;

  if (loading) return <FullScreenLoader />;

  return (
    <div className="relative min-h-[600px]">
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${deviceType}-${currentImageIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-end"
          >
            <Image
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized
            />
            <div
              className={cn("absolute inset-0", {
                "bg-black/30": showTextContent,
              })}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {showTextContent && (
        <div className="relative max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8 pt-12">
          <motion.div
            className="text-white max-w-2xl"
            initial={{ translateY: 50, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The Need For Premium Quality Lubricant Yet Affordable Is{" "}
              <span className="text-red-500">Universal</span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl mb-8 text-justify md:text-left">
              {desc ||
                `CL Scientists And Engineers Are Pioneering New Research And Pursuing
              New Technologies To Reduce Emissions While Creating More Efficient
              Fuels.`}
            </p>

            <button
              className="inline-block bg-primary-red text-white px-8 py-3 rounded-md hover:bg-red-600 transition-colors group"
              onClick={() => setShow(true)}
            >
              Contact Us
              <span className="inline-block transition-transform group-hover:scale-125 animate-pulse ml-1">
                →
              </span>
            </button>
          </motion.div>
        </div>
      )}

      {show && (
        <Overlay onClose={() => setShow(false)}>
          <ContactModal onClose={() => setShow(false)} />
        </Overlay>
      )}
    </div>
  );
}
