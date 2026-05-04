import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ShowCaseSection/Buttons';
import RoundedText from '../../components/ShowCaseSection/RoundedText';

// Import images (replace with your actual image paths)
import heroImage from '../../assets/png/seller.webp';
import planImage from '../../assets/png/create.webp';
import recordImage from '../../assets/png/product-listing.png';
import launchImage from '../../assets/png/order-tracking.webp';
import helpImage1 from '../../assets/png/product-listing.png';
import helpImage2 from '../../assets/png/analytic.webp';
import helpImage3 from '../../assets/png/16918913.png';

const BecomeSeller = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const loginHandler = () => {
    navigate('/seller/auth');
  };

  const howToBeginSteps = [
    {
      title: "Create your product",
      image: planImage,
      points: [
        "Start with your passion and knowledge about music instruments and gear.",
        "Choose a promising product category with the help of our Marketplace Insights tool.",
        "The way you present your product — what you bring to it — is up to you."
      ],
      helpText: "We offer plenty of resources on how to create your first listing. Our seller dashboard and inventory pages help keep you organized."
    },
    {
      title: "Live your product",
      image: recordImage,
      points: [
        "Use a smartphone or DSLR to capture high-quality photos and videos of your item.",
        "Add a good microphone for audio demos — you're ready to start selling.",
        "If you don't have video, just upload detailed photos and condition notes."
      ],
      helpText: "Our support team is available to help you throughout the process and provide feedback on your listings."
    },
    {
      title: "Track order",
      image: launchImage,
      points: [
        "Gather your first ratings and reviews by promoting your products through social media.",
        "Your listings will be discoverable in our marketplace where you earn revenue from each sale.",
        "Use our custom coupon tool to offer incentives and drive traffic."
      ],
      helpText: "There's even more opportunity for products chosen for Heartz Rhythm Business. Our global promotions drive traffic to your listings."
    }
  ];

  const howWeHelpItems = [
    {
      title: "Product listing optimization",
      desc: "AI-powered suggestions for titles, descriptions, and tags",
      icon: "🎸",
      image: helpImage1
    },
    {
      title: "Analytics & tracking",
      desc: "Real-time insights on views, sales, and customer behavior",
      icon: "📊",
      image: helpImage2
    },
    {
      title: "Seller protection & payouts",
      desc: "Dispute resolution, fraud detection, and fast payouts",
      icon: "🛡️",
      image: helpImage3
    }
  ];

 

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Left: Heartz Rhythm */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold  tracking-tight bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text text-transparent">
              Heartz Rhythm
            </span>
          </div>

          {/* Center: RoundedText */}
          <div>
            <RoundedText text="Seller" textColor='' />
          </div>

          {/* Right: Login Button */}
          <div>
            <Button text="REGISTER NOW" size="sm" variant='outline' textColor='' onClick={loginHandler} />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Banner - Full Width */}
        <div className="w-full bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20 border-y border-rose-200 dark:border-rose-800/30">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Text */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-4">
                  Come Sell<br />
                  <span className="text-rose-600 dark:text-rose-400">with us</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
                  Become a seller and turn your passion for instruments into profit.
                </p>
                <Link to="/seller/auth">
                  <Button text="Get started" size="lg" />
                </Link>
              </div>

              {/* Right Image */}
              <div className="flex-1 flex justify-center">
                <img
                  src={heroImage}
                  alt="Musician with guitar"
                  className="max-w-full h-auto "
                  style={{ maxHeight: '350px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* So many reasons to start */}
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">So many reasons to start</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition">
                <div className="text-4xl mb-3">🎸</div>
                <h3 className="text-xl font-semibold mb-2">Sell your way</h3>
                <p className="text-gray-600 dark:text-gray-400">Publish the gear you want, in the way you want, and always have control of your own inventory.</p>
              </div>
              <div className="text-center p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Get rewarded</h3>
                <p className="text-gray-600 dark:text-gray-400">Expand your network, build your expertise, and earn money on each sale.</p>
              </div>
              <div className="text-center p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-xl font-semibold mb-2">Inspire buyers</h3>
                <p className="text-gray-600 dark:text-gray-400">Help musicians find their dream instruments, gain new skills, and advance their craft.</p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-20 bg-gray-50 dark:bg-gray-900/30 rounded-2xl py-10 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-rose-600 dark:text-rose-400">50K+</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Customers</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-rose-600 dark:text-rose-400">3.5K+</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Sellers</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-rose-600 dark:text-rose-400">98%</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Satisfaction Rate</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-rose-600 dark:text-rose-400">180+</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Countries</p>
              </div>
            </div>
          </section>

          {/* How to begin  */}
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">How to begin</h2>
            
            <div className="space-y-4">
              {howToBeginSteps.map((step, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveTab(activeTab === idx ? -1 : idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-900/40 transition"
                  >
                    <span>{step.title}</span>
                    <svg 
                      className={`w-5 h-5 cursor-pointer transition-transform ${activeTab === idx ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {activeTab === idx && (
                    <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                          {step.points.map((point, i) => (
                            <p key={i} className="text-gray-700 dark:text-gray-300">
                              {point}
                            </p>
                          ))}
                          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="font-semibold text-rose-600 dark:text-rose-400 mb-2">How we help you</h4>
                            <p className="text-gray-600 dark:text-gray-400">{step.helpText}</p>
                          </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                          <img src={step.image} alt={step.title} className="rounded-lg max-w-full h-auto" style={{ maxHeight: '280px' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* How we help you  */}
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How we help you</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howWeHelpItems.map((item, idx) => (
                <div key={idx} className="  overflow-hidden ">
                  <img src={item.image} alt={item.title} className="w-64 h-64 object-cover" />
                  <div className="p-5">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* You won't have to do it alone - Testimonials carousel style */}
          <section className="mb-20 bg-gray-50 dark:bg-gray-900/30 rounded-2xl py-12 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">You won't have to do it alone</h2>
            
           
            
            {/* Support message */}
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our <strong className="text-rose-600 dark:text-rose-400">Seller Support Team</strong> is here to answer your questions and review your test listing, 
                while our <strong className="text-rose-600 dark:text-rose-400">Seller Center</strong> gives you plenty of resources to help you through the process. 
                Plus, get the support of experienced sellers in our <strong className="text-rose-600 dark:text-rose-400">online community</strong>.
              </p>
              <Link to="/seller/auth">
                <Button text="Contact support" variant="outline" textColor='' />
              </Link>
            </div>
          </section>

          {/* Final CTA: Become a seller today */}
          <section className="text-center py-12 bg-gradient-to-r from-orange-700 via-red-600 to-orange-500 rounded-2xl text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Become a seller today</h2>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              Join one of the world's largest music marketplaces and start your journey.
            </p>
            <Link to="/seller/auth">
              <button className="bg-white text-rose-600 hover:bg-rose-600 hover:text-white px-8 py-3 rounded-full font-semibold hover:border-white border-2 transition shadow-lg cursor-pointer">
                Get started
              </button>
            </Link>
          </section>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <span>© Heartz Rhythm — Seller Hub</span>
        </div>
      </footer>
    </div>
  );
};

export default BecomeSeller;