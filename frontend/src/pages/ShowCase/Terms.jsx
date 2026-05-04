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
  UserCheck,
  Award,
  Ban,
  Mail,
  Lock,
  Globe,
  ArrowLeft
} from 'lucide-react';

const Terms = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const customerTerms = [
    {
      title: "Account Registration",
      icon: <Users className="w-5 h-5 text-red-500" />,
      content: "To access certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account."
    },
    {
      title: "Ordering & Payments",
      icon: <FileText className="w-5 h-5 text-red-500" />,
      content: "All orders placed through our website are subject to acceptance. We reserve the right to refuse or cancel any order for any reason including product availability, pricing errors, or suspected fraud. Payments must be made at the time of order placement using approved payment methods. You agree to pay all charges incurred by you or any users of your account."
    },
    {
      title: "Pricing & Taxes",
      icon: <Award className="w-5 h-5 text-red-500" />,
      content: "All prices are listed in your local currency and are subject to change without notice. Taxes, shipping, and handling charges may apply and will be added to your total order amount. You are responsible for all applicable taxes associated with your purchase unless exempt by law."
    },
    {
      title: "Shipping & Delivery",
      icon: <Globe className="w-5 h-5 text-red-500" />,
      content: "Estimated delivery times are provided for reference only. We are not responsible for delays caused by carriers, customs clearance, or events beyond our control. Risk of loss and title for products pass to you upon delivery to the carrier. Please inspect all packages immediately upon receipt."
    },
    {
      title: "Intellectual Property",
      icon: <Lock className="w-5 h-5 text-red-500" />,
      content: "All content on this website including text, graphics, logos, images, and software is our property or licensed to us and is protected by copyright and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written consent."
    },
    {
      title: "Prohibited Conduct",
      icon: <Ban className="w-5 h-5 text-red-500" />,
      content: "You agree not to use our platform for any unlawful purpose or in any way that could damage, disable, or impair our services. This includes but is not limited to: uploading malicious code, attempting to gain unauthorized access, harassing other users, or engaging in fraudulent activities."
    },
    {
      title: "Reviews & Feedback",
      icon: <Mail className="w-5 h-5 text-red-500" />,
      content: "You may submit reviews, comments, and feedback about products. By submitting content, you grant us permission to use, modify, and display such content. Reviews must be honest, accurate, and not violate any third-party rights. We reserve the right to remove content that is inappropriate or violates these terms."
    },
    {
      title: "Limitation of Liability",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      content: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our platform or purchase of products. Our total liability shall not exceed the amount you paid for the product in question."
    }
  ];

  const sellerTerms = [
    {
      title: "Seller Authentication",
      icon: <UserCheck className="w-5 h-5 text-red-500" />,
      content: "All sellers must complete a verification process including business registration, tax identification, and identity verification. We reserve the right to reject any seller application that does not meet our standards. Fake or unverified accounts will be terminated immediately without notice."
    },
    {
      title: "Product Authenticity",
      icon: <Shield className="w-5 h-5 text-red-500" />,
      content: "Sellers guarantee that all products listed are authentic, genuine, and accurately described. Counterfeit, replica, or unauthorized products are strictly prohibited. Any seller found listing inauthentic products will face immediate account termination and legal action may be pursued."
    },
    {
      title: "Content Guidelines",
      icon: <CheckCircle className="w-5 h-5 text-red-500" />,
      content: "Product images, descriptions, and videos must be original, accurate, and not misleading. Abusive, offensive, or inappropriate content including hate speech, nudity, violence, or discriminatory material is strictly forbidden. We reserve the right to remove any content that violates these guidelines."
    },
    {
      title: "Pricing & Fair Competition",
      icon: <Store className="w-5 h-5 text-red-500" />,
      content: "Sellers must set fair and competitive prices. Price manipulation, artificial inflation, collusion with other sellers, or any deceptive pricing practices are prohibited. We monitor pricing patterns and may take action against sellers engaging in unfair practices."
    },
    {
      title: "Order Fulfillment",
      icon: <FileText className="w-5 h-5 text-red-500" />,
      content: "Sellers must fulfill orders within the committed timeframe. Failure to ship products on time, sending incorrect items, or poor packaging that results in damage will result in penalties including fees, temporary suspension, or permanent removal from the platform."
    },
    {
      title: "Customer Service Standards",
      icon: <Users className="w-5 h-5 text-red-500" />,
      content: "Sellers must respond to customer inquiries within 24 hours. Professional, respectful, and helpful communication is mandatory. Abusive language, harassment, or failure to address legitimate customer concerns will result in account review and potential termination."
    },
    {
      title: "Commission & Fees",
      icon: <Award className="w-5 h-5 text-red-500" />,
      content: "A commission fee applies to each successful sale as specified in your seller agreement. Additional fees may apply for premium listings, promotions, or special features. All fees are non-refundable and subject to change with 30 days notice."
    },
    {
      title: "Violation & Termination",
      icon: <Ban className="w-5 h-5 text-red-500" />,
      content: "Violation of any term may result in warnings, temporary suspension, or permanent termination of your seller account. We reserve the right to withhold payments, remove listings, and pursue legal remedies for serious violations including fraud or intellectual property infringement."
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my order after placing it?",
      answer: "Orders can be cancelled within 2 hours of placement. After that, the order enters processing and may not be cancellable. Please contact customer support immediately if you need to cancel."
    },
    {
      question: "What happens if I receive a damaged product?",
      answer: "Contact us within 48 hours of delivery with photos or video of the damage. We will arrange a free replacement or full refund based on your preference and product availability."
    },
    {
      question: "How do I become a seller on your platform?",
      answer: "Visit our Seller Registration page, complete the application form with your business details, and submit required documents. Our team will verify your information and contact you within 3-5 business days."
    },
    {
      question: "What are the consequences of selling counterfeit products?",
      answer: "Selling counterfeit products is strictly prohibited and will result in immediate account termination, permanent ban from the platform, forfeiture of all pending payouts, and potential legal action."
    },
    {
      question: "Can I return a product if I simply change my mind?",
      answer: "Yes, most products are eligible for return within 7 days of delivery for store credit. Please check the product page for specific return policies as some categories may have different terms."
    },
    {
      question: "How are disputes between buyers and sellers resolved?",
      answer: "Our dedicated dispute resolution team reviews each case individually. Both parties can submit evidence, and we aim to resolve all disputes within 5-7 business days fairly."
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
              <FileText className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Terms of Service • Last Updated: January 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
              Terms & Conditions
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">Read carefully before using our platform</span>
            </h1>
            
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              By accessing our website, you agree to be bound by these terms and conditions.
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
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 dark:text-red-300 font-medium">Legal Agreement</p>
              <p className="text-red-600/70 dark:text-red-400/70 text-sm mt-1">
                These terms constitute a legally binding agreement between you and our platform. Please read them carefully.
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Customer & Seller Terms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Customer Terms Column */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">For Customers</h2>
              </div>
              
              <div className="space-y-4">
                {customerTerms.map((term, idx) => (
                  <div key={idx} className="bg-white dark:bg-black/40 rounded-xl border border-red-100 dark:border-red-900/30 p-5 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {term.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{term.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{term.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller Terms Column */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 p-3 rounded-xl">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">For Sellers</h2>
              </div>
              
              <div className="space-y-4">
                {sellerTerms.map((term, idx) => (
                  <div key={idx} className="bg-white dark:bg-black/40 rounded-xl border border-red-100 dark:border-red-900/30 p-5 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {term.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{term.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{term.content}</p>
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Find quick answers to common questions</p>
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
            By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;