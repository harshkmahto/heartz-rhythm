import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Store, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  CheckCircle,
  FileText,
  Lock,
  Heart,
  Truck,
  RefreshCw,
  CreditCard,
  Eye,
  Cookie,
  Bell,
  ArrowLeft
} from 'lucide-react';

const Policies = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const customerPolicies = [
    {
      title: "Privacy Policy",
      icon: <Lock className="w-5 h-5 text-red-500" />,
      content: "We collect personal information including name, email, address, and payment details to process orders and provide services. Your data is encrypted and never sold to third parties. You have the right to access, modify, or delete your personal information at any time. Cookies are used to enhance your browsing experience."
    },
    {
      title: "Return & Refund Policy",
      icon: <RefreshCw className="w-5 h-5 text-red-500" />,
      content: "Most products are eligible for return within 7 days of delivery. Refunds are processed within 5-7 business days after quality inspection. Products must be unused, with original packaging and tags. Return shipping is free for defective items. Some categories like customized products are non-refundable."
    },
    {
      title: "Shipping Policy",
      icon: <Truck className="w-5 h-5 text-red-500" />,
      content: "Orders are processed within 1-2 business days. Standard shipping takes 3-7 business days. Express shipping (1-3 days) is available at checkout. Tracking information is provided via email. International shipping times vary by destination. Free shipping applies to orders above a certain threshold."
    },
    {
      title: "Payment Security Policy",
      icon: <CreditCard className="w-5 h-5 text-red-500" />,
      content: "All payments are processed through PCI-DSS compliant gateways. We accept credit/debit cards, UPI, net banking, and digital wallets. Your payment information is encrypted using SSL technology. We never store complete card details on our servers. 3D Secure authentication is required for all card payments."
    },
    {
      title: "Cookie Policy",
      icon: <Cookie className="w-5 h-5 text-red-500" />,
      content: "We use essential cookies for site functionality, performance cookies to improve user experience, and analytics cookies to understand site usage. You can manage cookie preferences in your browser settings. Disabling cookies may affect certain features. Third-party cookies are used for payment processing and analytics."
    },
    {
      title: "Data Retention Policy",
      icon: <FileText className="w-5 h-5 text-red-500" />,
      content: "Customer data is retained for as long as your account is active or as needed to provide services. We may retain certain information for legal compliance, fraud prevention, and dispute resolution. You may request data deletion by contacting support, subject to legal requirements."
    }
  ];

  const sellerPolicies = [
    {
      title: "Product Listing Policy",
      icon: <Store className="w-5 h-5 text-red-500" />,
      content: "All product listings must be accurate, with clear images and honest descriptions. Prohibited items include counterfeit goods, unsafe products, regulated items without proper licenses, and intellectual property violations. We reserve the right to remove listings that violate these standards."
    },
    {
      title: "Quality Assurance Policy",
      icon: <CheckCircle className="w-5 h-5 text-red-500" />,
      content: "Sellers must maintain minimum quality standards including product authenticity, proper packaging, and accurate inventory. Random quality checks may be performed. Failure to meet standards results in penalties including listing removal, account suspension, or permanent ban."
    },
    {
      title: "Customer Data Protection",
      icon: <Shield className="w-5 h-5 text-red-500" />,
      content: "Sellers must protect customer data including names, addresses, and order details. Customer information cannot be used for marketing outside our platform. Data breaches must be reported immediately. Violation of data protection policies results in immediate account termination and legal action."
    },
    {
      title: "Fair Trading Policy",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      content: "Sellers must engage in honest business practices including accurate pricing, truthful advertising, and timely fulfillment. Price manipulation, fake reviews, misleading discounts, or any deceptive practices are strictly prohibited and will be investigated."
    },
    {
      title: "Dispute Resolution Policy",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      content: "Disputes between buyers and sellers are reviewed by our resolution team. Both parties must provide evidence within 3 days. Decisions are final and binding. Repeated disputes may affect seller ranking and account status. Fraudulent claims result in immediate penalties."
    },
    {
      title: "Commission & Fee Policy",
      icon: <CreditCard className="w-5 h-5 text-red-500" />,
      content: "Standard commission is calculated as a percentage of each successful sale. Additional fees apply for promoted listings, premium store features, and international transactions. All fees are deducted automatically before payout. Fee structure is subject to change with 30 days notice."
    }
  ];

  const faqs = [
    {
      question: "How is my personal information protected?",
      answer: "We use industry-standard encryption (SSL) for all data transmission. Your password is hashed and never stored in plain text. We regularly audit our security systems and comply with data protection regulations. Two-factor authentication is available for additional security."
    },
    {
      question: "Can I request deletion of my account and data?",
      answer: "Yes, you can request account deletion through Settings or by contacting support. We will remove your personal information within 30 days, subject to legal retention requirements for transaction records and fraud prevention."
    },
    {
      question: "What happens if a seller violates policies?",
      answer: "Penalties range from warnings and listing removal to account suspension or permanent termination. Serious violations including counterfeit products or data breaches result in immediate ban, forfeiture of pending payments, and potential legal action."
    },
    {
      question: "Are my payment details safe on your platform?",
      answer: "Absolutely. We use PCI-DSS compliant payment gateways. Your complete card details are never stored on our servers. All transactions are processed with 3D Secure authentication for an extra layer of protection."
    },
    {
      question: "How do I report a policy violation?",
      answer: "Use the 'Report' button on product listings or seller profiles. Our trust & safety team reviews all reports within 24-48 hours. You can also email compliance@musicstore.com for urgent matters. Anonymous reporting is available."
    },
    {
      question: "Are third-party sellers verified?",
      answer: "Yes, all sellers undergo a rigorous verification process including business registration, tax ID validation, and identity verification. Verified sellers are marked with a badge. We regularly audit seller compliance with our policies."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/10 dark:to-black">
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-rose-600 dark:from-red-900 dark:via-red-800 dark:to-rose-900">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-40 -mb-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Policies • Last Updated: January 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
              Our Policies
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">Transparent, fair, and customer-first</span>
            </h1>
            
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              Clear guidelines that protect both customers and sellers on our platform.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white" className="dark:fill-black"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        {/* Info Alert */}
        <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-xl p-4 mb-12">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 dark:text-red-300 font-medium">Policy Updates</p>
              <p className="text-red-600/70 dark:text-red-400/70 text-sm mt-1">
                We may update these policies from time to time. Continued use of our platform constitutes acceptance of any changes.
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Customer & Seller Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Customer Policies Column */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">For Customers</h2>
              </div>
              
              <div className="space-y-4">
                {customerPolicies.map((policy, idx) => (
                  <div key={idx} className="bg-white dark:bg-black/40 rounded-xl border border-red-100 dark:border-red-900/30 p-5 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {policy.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{policy.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{policy.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller Policies Column */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 p-3 rounded-xl">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">For Sellers</h2>
              </div>
              
              <div className="space-y-4">
                {sellerPolicies.map((policy, idx) => (
                  <div key={idx} className="bg-white dark:bg-black/40 rounded-xl border border-red-100 dark:border-red-900/30 p-5 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {policy.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{policy.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{policy.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section with Collapsible */}
        <div className="bg-white dark:bg-black/40 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 rounded-full px-4 py-1.5 mb-3">
              <Eye className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Have Questions?</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Policy FAQs</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need to know about our policies</p>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-red-100 dark:border-red-900/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-black/20 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <span className="font-semibold text-gray-800 dark:text-white">{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 border-t border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            These policies are designed to create a safe, fair, and transparent environment for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policies;