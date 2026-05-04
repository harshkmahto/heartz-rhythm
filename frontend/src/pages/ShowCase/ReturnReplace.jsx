import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, 
  Shield, 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Package,
  CreditCard,
  Smartphone,
  Home,
  ArrowLeft
} from 'lucide-react';

const ReturnReplace = () => {
  const returnPolicy = {
    title: "Return Policy",
    description: "Not satisfied with your purchase? We'll help you return it within the specified period.",
    days: 7,
    conditions: [
      "Product must be in original condition",
      "All accessories and tags must be intact",
      "Original packaging required",
      "Proof of purchase mandatory"
    ],
    process: [
      "Request return within return window",
      "Get return approval & tracking ID",
      "Pack item securely with all accessories",
      "Ship to our warehouse (FREE pickup available)",
      "Quality check (2-3 business days)",
      "Refund processed to original payment method"
    ],
    exceptions: [
      "Customized/Personalized products",
      "Clearance/Sale items (Final sale)",
      "Intimate wear for hygiene reasons",
      "Digital products once downloaded"
    ]
  };

  const replacePolicy = {
    title: "Replacement Policy",
    description: "Got a defective or damaged product? We'll replace it immediately.",
    days: 15,
    conditions: [
      "Manufacturing defect or damage",
      "Wrong product delivered",
      "Missing parts or accessories",
      "Product not matching description"
    ],
    process: [
      "Report issue with photo/video proof",
      "Get replacement approval",
      "Schedule pickup from your address",
      "Replacement shipped within 2-3 days",
      "Track your replacement easily"
    ],
    exceptions: [
      "Normal wear and tear",
      "Damage due to misuse",
      "Products past warranty period",
      "Items without original invoice"
    ]
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/10 dark:to-black">
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-rose-600 dark:from-red-900 dark:via-red-800 dark:to-rose-900">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-40 -mb-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
        

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <RefreshCw className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Policies Updated: January 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
              Return & Replacement
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">Hassle-Free Policy</span>
            </h1>
            
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              Shop with confidence. If something isn't right, we'll make it right.
            </p>

            {/* Policy Highlight Cards */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <p className="text-white/70 text-sm">Return Window</p>
                    <p className="text-white font-bold text-xl">{returnPolicy.days}-30 Days</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <p className="text-white/70 text-sm">Free Pickup</p>
                    <p className="text-white font-bold text-xl">Pan India</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <p className="text-white/70 text-sm">Secure Refund</p>
                    <p className="text-white font-bold text-xl">7 Days Max</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave SVG at bottom */}
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
              <p className="text-red-800 dark:text-red-300 font-medium">Policy varies by product category</p>
              <p className="text-red-600/70 dark:text-red-400/70 text-sm mt-1">
                Each product displays its specific return/replacement window on its product page. The policy below applies to most items.
              </p>
            </div>
          </div>
        </div>

        {/* Return & Replace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Return Policy Card */}
          <div className="group">
            <div className="bg-white dark:bg-black/40 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-lg hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 h-full overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <RefreshCw className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{returnPolicy.title}</h2>
                      <p className="text-white/80 text-sm mt-1">{returnPolicy.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <span className="text-white font-bold text-2xl">{returnPolicy.days}</span>
                      <span className="text-white/80 text-sm"> Days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Conditions */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-red-500" />
                    Eligibility Conditions
                  </h3>
                  <ul className="space-y-2">
                    {returnPolicy.conditions.map((condition, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <span className="text-red-500 mt-0.5">•</span>
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-red-500" />
                    Return Process
                  </h3>
                  <div className="space-y-2">
                    {returnPolicy.process.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exceptions */}
                <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    Non-Returnable Items
                  </h3>
                  <ul className="space-y-1">
                    {returnPolicy.exceptions.map((item, idx) => (
                      <li key={idx} className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Replacement Policy Card */}
          <div className="group">
            <div className="bg-white dark:bg-black/40 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-lg hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 h-full overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-800 dark:to-red-900 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{replacePolicy.title}</h2>
                      <p className="text-white/80 text-sm mt-1">{replacePolicy.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <span className="text-white font-bold text-2xl">{replacePolicy.days}</span>
                      <span className="text-white/80 text-sm"> Days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Conditions */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-red-500" />
                    Replacement Eligibility
                  </h3>
                  <ul className="space-y-2">
                    {replacePolicy.conditions.map((condition, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <span className="text-red-500 mt-0.5">•</span>
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
                    <Truck className="w-4 h-4 text-red-500" />
                    Replacement Process
                  </h3>
                  <div className="space-y-2">
                    {replacePolicy.process.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exceptions */}
                <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    Limited Warranty Exceptions
                  </h3>
                  <ul className="space-y-1">
                    {replacePolicy.exceptions.map((item, idx) => (
                      <li key={idx} className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      
        {/* FAQ Section */}
        <div className="bg-white dark:bg-black/40 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 md:p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need to know about returns & replacements</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-red-500" />
                  How long does refund take?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Refunds are processed within 5-7 business days after quality check. The amount reflects in your account within 2-3 days depending on your bank.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-red-500" />
                  Do I pay for return shipping?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No, we offer free return pickup for defective/damaged products. For change of mind returns, shipping charges may apply.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-red-500" />
                  Can I return to a physical store?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Currently, returns are only processed online. We're working on enabling in-store returns soon.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-red-500" />
                  What if I received wrong product?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Contact us within 48 hours of delivery with unboxing video. We'll arrange immediate replacement with free pickup.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-2xl p-6 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">Need Help?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">support@musicstore.com</p>
              </div>
            </div>
            <div className="h-8 w-px bg-red-200 dark:bg-red-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">Response Time</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">24/7 Support Available</p>
              </div>
            </div>
            <Link to="/contact">
              <button className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all hover:scale-105 cursor-pointer">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnReplace;