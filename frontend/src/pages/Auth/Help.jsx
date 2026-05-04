import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Mail, 
  User, 
  Tag, 
  FolderOpen, 
  MessageSquare,
  Send,
  Clock,
  Headphones,
  CheckCircle,
  ArrowLeft,
  Phone,
  Calendar
} from 'lucide-react';
import help from '../../assets/png/support.png';

const Help = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regarding: '',
    productName: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const regardingOptions = [
    'Product Inquiry',
    'Return Request',
    'Replacement Request',
    'Order Issue',
    'Payment Problem',
    'Shipping Delay',
    'Technical Support',
    'Account Issue',
    'Other'
  ];

  const subjectOptions = [
    'Fake/Counterfeit Product',
    'Scam Concern',
    'Login Issue',
    'Account Blocked',
    'Wrong Product Delivered',
    'Damaged Product',
    'Missing Parts',
    'Warranty Claim',
    'Refund Not Received',
    'Other Issue'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const stats = [
    {
      icon: <Headphones className="w-6 h-6 text-red-500" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance",
      note: "Available all days"
    },
    {
      icon: <Clock className="w-6 h-6 text-red-500" />,
      title: "Response Time",
      description: "Within 24 hours",
      note: "Longer on weekends (Sat-Sun)"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-red-500" />,
      title: "Resolution Rate",
      description: "98% satisfaction",
      note: "Escalate if unsatisfied"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/10 dark:to-black">
      
      {/* Simple Header - No Banner */}
      <div className="relative pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-red-100 dark:bg-red-950/50 rounded-full px-4 py-2 mb-6">
              <HelpCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300 font-medium">Customer Support</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Help Regarding
              <span className="block text-red-600 dark:text-red-500">Heartz Rhythm</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Our support team is ready to assist you with any questions or concerns
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        {/* Form and Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Left Side - Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white dark:bg-black/40 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Get Support
                </h2>
                <p className="text-white/80 text-sm mt-1">Fill the form below and we'll get back to you</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 text-red-500" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 text-red-500" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Regarding - Combobox style (can write or choose) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FolderOpen className="w-4 h-4 text-red-500" />
                    Regarding *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="regarding"
                      required
                      value={formData.regarding}
                      onChange={handleChange}
                      list="regardingList"
                      placeholder="Type or select an option (e.g., Return Request)"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <datalist id="regardingList">
                      {regardingOptions.map((option, idx) => (
                        <option key={idx} value={option} />
                      ))}
                    </datalist>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You can type your own or select from options</p>
                </div>

                {/* Product Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4 text-red-500" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g., Acoustic Guitar, Electric Guitar, Ukulele"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Subject - Combobox style (can write or choose) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <HelpCircle className="w-4 h-4 text-red-500" />
                    Subject *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      list="subjectList"
                      placeholder="Type or select a subject (e.g., Fake product, Login issue)"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <datalist id="subjectList">
                      {subjectOptions.map((option, idx) => (
                        <option key={idx} value={option} />
                      ))}
                    </datalist>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You can type your own or select from options</p>
                </div>

                {/* Message Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MessageSquare className="w-4 h-4 text-red-500" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your issue in detail. Include order number if applicable..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Submit Request
                </button>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-500 rounded-lg p-3 text-center animate-fadeIn">
                    <p className="text-green-700 dark:text-green-400 text-sm">
                      ✓ Request submitted successfully! We'll reply to your email within 24 hours.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Side - Just PNG Image (No Background/BG) */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-24 flex justify-center items-center">
              <img 
                src={help}
                alt="Customer Support Illustration"
                className="w-full max-w-md h-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x400?text=Customer+Support";
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 rounded-full px-4 py-1.5 mb-3">
              <Headphones className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Support Excellence</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">We're Here for You</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Committed to providing the best support experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-black/40 rounded-xl border border-red-100 dark:border-red-900/30 p-6 text-center hover:shadow-lg hover:shadow-red-500/5 transition-all group">
                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{stat.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{stat.description}</p>
                <p className="text-sm text-red-500 dark:text-red-400 mt-2 font-medium">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Heartz Rhythm Team Signature */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-full">
            <span className="text-2xl">🎵</span>
            <p className="text-gray-700 dark:text-gray-300">
              With love from <strong className="text-red-600 dark:text-red-400">Heartz Rhythm Team</strong>
            </p>
            <span className="text-2xl">❤️</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
            We value every customer and strive to resolve all issues promptly and professionally
          </p>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Help;