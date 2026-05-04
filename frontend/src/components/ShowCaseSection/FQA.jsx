import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What types of instruments do you offer?",
      answer: "Heartz Rhythm specializes in guitars primarily, but we also offer a wide range of musical instruments including keyboards, drums, ukuleles, violins, and various accessories. All our products are sourced from premium brands and come with authenticity guarantees."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a confirmation email with a tracking number and link. You can also track your order directly from your account dashboard under 'My Orders' section. We provide real-time updates on your delivery status."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day hassle-free return policy on all products. If you're not satisfied with your purchase, you can initiate a return within 7 days of delivery. The product must be unused and in original packaging with all accessories intact."
    },
    {
      question: "Do you offer warranty on instruments?",
      answer: "Yes, all our instruments come with a minimum 1-year manufacturer warranty. Some premium brands offer extended warranties up to 3-5 years. The warranty covers manufacturing defects and ensures free repairs or replacement as per terms."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-7 business days depending on your location. We also offer express shipping options (1-3 business days) for urgent deliveries. Metro cities usually receive deliveries faster than remote areas."
    },
    {
      question: "Do you provide installation or setup services?",
      answer: "Yes, we provide professional setup services for guitars and other instruments. Our expert technicians can help with tuning, string replacement, and basic adjustments. Some products include free setup service, while others may have a nominal charge."
    },
    {
      question: "Are your products authentic?",
      answer: "Absolutely! Heartz Rhythm is an authorized dealer for all brands we carry. Every product comes with a certificate of authenticity and genuine serial numbers that can be verified on the brand's official website."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 px-4 md:px-8 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950/40 dark:to-rose-950/40 rounded-full mb-4 ">
            <HelpCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Got Questions?
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Frequently Asked Questions
          </h1>
          
          {/* Decorative Line */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-12 h-1 bg-red-500 rounded-full"></div>
            <div className="w-6 h-1 bg-rose-500 rounded-full"></div>
            <div className="w-3 h-1 bg-pink-500 rounded-full"></div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our products, services, and policies
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-xl bg-white/30 dark:bg-black/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 border border-white/20 dark:border-white/10"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors duration-300"
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 cursor-pointer transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <div className="h-px bg-gradient-to-r from-red-200 to-rose-200 dark:from-red-900/50 dark:to-rose-900/50 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-12 text-center">
          <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/30 rounded-2xl p-8 shadow-lg border border-white/20 dark:border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-rose-600/5 rounded-2xl"></div>
            
            <div className="relative">
              <Sparkles className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Can't find the answer you're looking for? Please contact our support team
              </p>
              <Link to="/contact">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-white font-semibold hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <span>Contact Support</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FAQ;