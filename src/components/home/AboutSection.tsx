"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ translateY: 20, opacity: 0 }}
          whileInView={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
            The Need For Energy Is{" "}
            <span className="text-red-500">Universal</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            That's why CL scientists and engineers are pioneering new research
            and pursuing new technologies to reduce emissions while creating
            more efficient fuels. We're committed to responsibly meeting the
            world's energy needs.
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
                Innovation
              </h3>
              <p className="text-gray-600">
                Pioneering new research and technologies to create more
                efficient and sustainable energy solutions.
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
                Sustainability
              </h3>
              <p className="text-gray-600">
                Committed to reducing emissions and developing cleaner energy
                alternatives for a better future.
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
                Responsibility
              </h3>
              <p className="text-gray-600">
                Meeting the world's energy needs responsibly while maintaining
                the highest safety and environmental standards.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
