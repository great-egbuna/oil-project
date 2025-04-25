"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-6 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ translateY: 20, opacity: 0 }}
          whileInView={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
            OUR CORE
            <span className="text-red-500"> VALUES</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 text-justify">
            At Confluence Lube, our core values are the foundation of our
            business, guiding our actions, decisions, and interactions with
            customers, employees, and partners. These values reflect who we are,
            what we stand for, and how we aim to make a positive impact. We
            value these principles because they help us build trust, drive
            growth, and create a better future for our Partners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ translateY: 20, opacity: 0 }}
              whileInView={{ translateY: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-lg shadow-lg border border-blue-100"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Customer Focus
              </h3>
              <p className="text-gray-600 text-left">
                We prioritize customer satisfaction, committed to understanding
                and meeting the needs of our customers and building long-term
                relationships.
              </p>
            </motion.div>
            <motion.div
              initial={{ translateY: 20, opacity: 0 }}
              whileInView={{ translateY: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-lg shadow-lg border border-blue-100"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Quality
              </h3>
              <p className="text-gray-600 text-left">
                We deliver high-quality products that meet the highest industry
                standards.
              </p>
            </motion.div>
            <motion.div
              initial={{ translateY: 20, opacity: 0 }}
              whileInView={{ translateY: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-lg shadow-lg border border-blue-100"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Integrity and Trust
              </h3>
              <p className="text-gray-600 text-left">
                We operate with honesty, transparency, and ethics, building
                trust with our customers and partners.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
