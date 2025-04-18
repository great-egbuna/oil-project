"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      category: "General",
      items: [
        {
          q: "What is Confluence Lube?",
          a: [
            "We're a leading provider of high-quality lubricants and oil solutions for various industries.",
          ],
        },
        {
          q: "What products do you offer?",
          a: [
            "We offer a range of products, including industrial lubricants, automotive oils, and more.",
          ],
        },
        {
          q: "What industries do you serve?",
          a: [
            "We serve various industries, including manufacturing, automotive, and more.",
          ],
        },
      ],
    },
    {
      category: "Ordering and Payment",
      items: [
        {
          q: "How do I place an order?",
          a: [
            "You can place an order through our website, phone, or email:",
            "• Website: www.confluencelube.com",
            "• Email: support@ConfluenceLube.com",
            "• Phone: 07043005952",
          ],
        },
        {
          q: "What payment methods do you accept?",
          a: [
            "We accept various payment methods, including bank transfers and online payments.",
          ],
        },
        {
          q: "Is my payment information secure?",
          a: ["Yes, our payment system is secure and encrypted."],
        },
      ],
    },
    {
      category: "Product Information",
      items: [
        {
          q: "What are the benefits of using your products?",
          a: [
            "Our products are designed to:",
            "• Improve engine and equipment performance",
            "• Reduce downtime",
            "• Increase efficiency",
            "• Extend engine lifespan",
          ],
        },
        {
          q: "How do I choose the right product for my needs?",
          a: [
            "Our team can help you select the right product based on your specific requirements.",
            "Every product has its specifications listed for easy identification - check the product specifications section.",
          ],
        },
        {
          q: "Do you offer product testing or sampling?",
          a: ["Yes, we can provide samples for testing and evaluation."],
        },
      ],
    },
    {
      category: "Shipping and Delivery",
      items: [
        {
          q: "What is your shipping policy?",
          a: [
            "We strive to deliver products promptly and efficiently.",
            "We offer free shipping for orders above 1,000 cartons",
          ],
        },
        {
          q: "How long does shipping take?",
          a: [
            "Delivery times vary depending on location and product availability.",
            "Typically takes between 24 hours to 7 working days",
          ],
        },
        {
          q: "Do you ship internationally?",
          a: ["Yes, we ship to various countries worldwide."],
        },
      ],
    },
    {
      category: "Account and Login",
      items: [
        {
          q: "How do I create an account?",
          a: [
            "You can create an account through our website:",
            '1. Click on "Register"',
            "2. Fill in all necessary details",
            "3. Wait for admin approval",
          ],
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: [
            '1. Click "Forgot Password" on the login page',
            "2. Check your email for reset instructions",
            "3. Follow the instructions to reset your password",
          ],
        },
      ],
    },
    {
      category: "Returns and Refunds",
      items: [
        {
          q: "Can I return a product?",
          a: [
            "Yes, we have a return policy in place (subject to change without notice).",
          ],
        },
        {
          q: "How do I initiate a return?",
          a: ["Contact our customer service team to start the return process."],
        },
        {
          q: "What is your refund policy?",
          a: ["Refunds are processed according to our return policy."],
        },
      ],
    },
    {
      category: "Technical Support",
      items: [
        {
          q: "Do you offer technical support?",
          a: ["Yes, our team provides technical support and guidance."],
        },
        {
          q: "How do I contact technical support?",
          a: [
            "You can reach us through:",
            "• Phone",
            "• Email",
            "• Website contact form",
            "Visit our Contact Us page for details",
          ],
        },
      ],
    },
    {
      category: "Quality and Safety",
      items: [
        {
          q: "What quality standards do your products meet?",
          a: [
            "Our products meet industry standards and regulations (SON certified).",
          ],
        },
        {
          q: "Are your products safe to use?",
          a: [
            "Yes, our products are 100% safe and come with guaranteed value.",
          ],
        },
      ],
    },
    {
      category: "Contact Us",
      items: [
        {
          q: "How do I contact Confluence Lube?",
          a: [
            "• Phone: +2347043005952",
            "• Email: support@ConfluenceLube.com",
            "• Website contact form",
          ],
        },
        {
          q: "What are your business hours?",
          a: ["Mondays to Saturday: 8am - 9pm"],
        },
        {
          q: "Can I schedule a consultation?",
          a: ["Yes, just give us a call to schedule a meeting."],
        },
        {
          q: "How do I stay updated?",
          a: [
            "• Subscribe to our newsletter",
            "• Follow us on social media @ConfluenceLube",
          ],
        },
      ],
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Create flat array of all questions for indexing
  const allQuestions = faqData.flatMap((category) => category.items);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary-red mb-12 text-center">
        Frequently Asked Questions
      </h1>

      {faqData.map((category, catIndex) => (
        <div key={catIndex} className="mb-12">
          <h2 className="text-2xl font-bold text-primary-red mb-6">
            {category.category}
          </h2>

          <div className="space-y-4">
            {category.items.map((item, itemIndex) => {
              const index = allQuestions.findIndex((q) => q.q === item.q);
              return (
                <div
                  key={itemIndex}
                  className="border rounded-lg transition-all duration-300 ease-in-out"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-left font-medium text-gray-900">
                      {item.q}
                    </span>
                    <FiChevronDown
                      className={`text-primary-red transform transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 pt-0">
                      {item.a.map((text, i) => (
                        <p key={i} className="text-gray-600 mb-3 last:mb-0">
                          {text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
