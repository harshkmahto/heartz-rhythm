import React, { useState, useEffect } from 'react';
import RoundedText from '../../components/ShowCaseSection/RoundedText';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ShowCaseSection/Buttons';

const BecomeSeller = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('seller');

  const navigate = useNavigate();

  const loginHandler = () => {
    navigate('/seller/auth');
  };


  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Sections for the right-side vertical timeline
  const sections = [
    { id: 'seller', label: 'Become a Seller', icon: '🎸' },
    { id: 'heartz', label: 'Heartz Rhythm', icon: '❤️' },
    { id: 'benefits', label: 'Benefits', icon: '✨' },
    { id: 'docs', label: 'Documentation', icon: '📘' },
    { id: 'terms', label: 'T&C', icon: '📜' },
    { id: 'faq', label: 'FAQ', icon: '❓' }
  ];

  // Scroll spy to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let current = 'seller';
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          current = section.getAttribute('data-section');
        }
      });
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const faqs = [
    {
      question: "How long does seller approval take?",
      answer: "Most applications are reviewed within 24–48 hours. Once you submit all docs, you'll get an email with next steps. Express review available for premium instruments."
    },
    {
      question: "Are there hidden fees?",
      answer: "No hidden fees. You only pay transaction fee (4.5% + $0.30) upon sale. Optional promoted listings cost extra but are never mandatory."
    },
    {
      question: "Can I sell digital products (samples, beats)?",
      answer: "Absolutely! Digital goods like sample packs, MIDI kits, or mixing presets are welcome. We provide file hosting and license protection for creators."
    },
    {
      question: "How do I increase visibility?",
      answer: "Optimize listings, use high-quality media, and join our 'Vendor Spotlight' program. Sellers with responsive customer service get algorithm boost."
    },
    {
      question: "What happens if an item is damaged during shipping?",
      answer: "Heartz Rhythm offers seller protection up to $500 for shipments with valid tracking. We recommend insurance for high-value items."
    }
  ];

  const benefits = [
    { icon: "📈", title: "Zero Commission Launch", desc: "First 3 months 0% fee, then only 4.5% — lowest in music marketplace." },
    { icon: "🌍", title: "Global Audience", desc: "Reach musicians, collectors, and studios worldwide with rhythm-first tools." },
    { icon: "🛡️", title: "Seller Protection", desc: "Dispute resolution & fraud detection — sell with confidence." },
    { icon: "📊", title: "Analytics Studio", desc: "Real-time insights, inventory tracker & promotional dashboard." },
    { icon: "⚡", title: "Fast Payouts", desc: "Get paid within 2 days after delivery confirmation. Weekly or instant payout options." },
    { icon: "🎵", title: "Music Community", desc: "Join 50K+ music lovers and get featured in our curated newsletters." }
  ];

  const documentation = [
    { label: "Identity Verification", desc: "Valid government ID, tax information (if applicable), and a verified email/phone. For international sellers, additional KYC may be needed." },
    { label: "Store Setup", desc: "Create a seller profile, store banner, bio, and link socials. Add payout method (Stripe/PayPal/bank transfer)." },
    { label: "Product Catalog", desc: "High-res images, condition details, pricing, and optionally demo audio/video. Must follow listing guidelines (authenticity guarantee)." },
    { label: "Shipping & Logistics", desc: "Provide shipping rates, handling time (1–5 business days). Tracking mandatory for items over $50. International customs docs generated automatically." },
    { label: "Payout Schedule", desc: "Payouts are released 2 days after delivery confirmation. Weekly or instant payout (small fee). Minimum threshold $20." },
    { label: "Customer Service", desc: "Respond to inquiries within 24 hours. Maintain 95%+ response rate to qualify for 'Top Seller' badge." }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100 transition-colors">
      <div className=" mx-10 md:mx-20 px-4 sm:px-6 lg:px-8 py-5 relative corner-accent">
        
        <div className='flex items-center justify-between  mx-auto'>
        <div className='  '>
        <RoundedText text="Seller" />
        </div>

        <div>
           <Button text="Login" size='sm' onClick={loginHandler}/>
          </div>

          </div>
        

        {/* ========== HEADER ========== */}
        <header className="flex flex-wrap justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-5 mb-8">


          <div className="flex items-center space-x-2">
            <i className="fas fa-heartbeat text-3xl text-rose-600 dark:text-rose-400 rhythm-heart"></i>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent dark:from-rose-400 dark:to-orange-400">
              Heartz Rhythm
            </span>
            
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`hover:text-rose-600 dark:hover:text-rose-400 transition ${activeSection === section.id ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-500' : ''}`}
              >
                {section.icon} {section.label}
              </button>
            ))}
          </div>
          
          
        </header>
        
        {/* Hero area */}
        <div className="text-center md:text-left md:flex md:justify-between md:items-end mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight inline-block bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-amber-600 dark:from-rose-400 dark:to-amber-400">
              Become a Seller
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl">
              Turn your passion into rhythm — sell gear, beats, or vintage guitars on Heartz Rhythm.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-sm font-mono text-rose-500 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 rounded-full px-4 py-1.5 inline-flex items-center gap-2">
            <i className="fas fa-head-side-headphones"></i> <span>seller success rate +87%</span>
          </div>
        </div>
        
        {/* main 2-col layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT MAIN CONTENT */}
          <div className="lg:w-2/3 space-y-12 pb-12">
            
            {/* BECOME A SELLER section */}
            <section id="seller" data-section="seller" className="scroll-mt-24 vibe-border pl-4 md:pl-6">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-guitar text-rose-500 text-xl"></i>
                <h2 className="text-2xl font-bold">🎸 Become a Seller</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4 bg-gradient-to-r from-rose-50/30 to-transparent dark:from-rose-950/10 p-6 rounded-xl">
                <p className="text-lg font-medium">Ready to share your music gear with the world? <span className="text-rose-600 dark:text-rose-400">Heartz Rhythm</span> is the premier marketplace for musicians, collectors, and creators.</p>
                <p>As a seller on our platform, you'll get access to a passionate community of music lovers, powerful selling tools, and dedicated support. Whether you're selling vintage guitars, studio equipment, digital beats, or merch — we've got you covered.</p>
                <div className="flex gap-4 mt-4">
                  <Link to="/seller">
                  <Button text="Start Selling" size='md'/>
                  </Link>
                  <button onClick={() => scrollToSection('docs')} className="border border-rose-600 text-rose-600 dark:text-rose-400 px-6 py-2 rounded-full cursor-pointer font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">View Requirements</button>
                </div>
              </div>
            </section>
            
            {/* HEARTZ RHYTHM section */}
            <section id="heartz" data-section="heartz" className="scroll-mt-24 border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-heartbeat text-rose-500 text-xl rhythm-heart"></i>
                <h2 className="text-2xl font-bold">❤️ About Heartz Rhythm</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl">
                  <i className="fas fa-music text-rose-500 text-2xl mb-3"></i>
                  <h3 className="font-bold text-lg mb-2">Our Mission</h3>
                  <p className="text-gray-600 dark:text-gray-400">Empowering musicians and creators to turn their passion into sustainable income through a trusted, community-driven marketplace.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl">
                  <i className="fas fa-users text-rose-500 text-2xl mb-3"></i>
                  <h3 className="font-bold text-lg mb-2">Community First</h3>
                  <p className="text-gray-600 dark:text-gray-400">Over 50,000 active buyers and 3,500+ successful sellers. Join a network that celebrates authentic musical expression.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl">
                  <i className="fas fa-shield-alt text-rose-500 text-2xl mb-3"></i>
                  <h3 className="font-bold text-lg mb-2">Trust & Safety</h3>
                  <p className="text-gray-600 dark:text-gray-400">Every transaction is protected. We verify sellers and offer dispute resolution to ensure fair dealings.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl">
                  <i className="fas fa-chart-line text-rose-500 text-2xl mb-3"></i>
                  <h3 className="font-bold text-lg mb-2">Growth Tools</h3>
                  <p className="text-gray-600 dark:text-gray-400">Analytics, promotion tools, and SEO optimization to help your products reach the right audience.</p>
                </div>
              </div>
            </section>
            
            {/* BENEFITS section */}
            <section id="benefits" data-section="benefits" className="scroll-mt-24 border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-star-of-life text-rose-500 text-xl"></i>
                <h2 className="text-2xl font-bold">✨ Seller Benefits & Perks</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl doc-card border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition">
                    <div className="text-3xl mb-2">{benefit.icon}</div>
                    <h3 className="font-bold text-lg">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* DOCUMENTATION section */}
            <section id="docs" data-section="docs" className="scroll-mt-24 border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex items-center gap-2 mb-5">
                <i className="fas fa-file-alt text-rose-500 text-xl"></i>
                <h2 className="text-2xl font-bold">📄 Seller Documentation & Requirements</h2>
              </div>
              <div className="space-y-4 bg-gray-50/40 dark:bg-gray-900/20 rounded-2xl p-5 md:p-7">
                {documentation.map((doc, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                    <div className="sm:w-1/3 font-semibold text-rose-600 dark:text-rose-400">
                      <i className="fas fa-check-circle mr-2 text-rose-400"></i> {doc.label}
                    </div>
                    <div className="sm:w-2/3 text-gray-700 dark:text-gray-300">{doc.desc}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-sm italic flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg">
                <i className="fas fa-microphone-alt text-rose-400"></i> Pro tip: Complete your seller orientation (free video course) to unlock "Rising Star" badge.
              </div>
            </section>
            
            {/* TERMS & CONDITIONS section */}
            <section id="terms" data-section="terms" className="scroll-mt-24 border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-scale-balanced text-rose-500 text-xl"></i>
                <h2 className="text-2xl font-bold">📜 Terms & Conditions for Sellers</h2>
              </div>
              <div className="space-y-3 bg-white dark:bg-black/20 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <p><strong className="text-rose-600 dark:text-rose-400">1. Authenticity Pledge:</strong> All listed items must be genuine. Counterfeit or stolen goods result in permanent ban and legal action.</p>
                <p><strong className="text-rose-600 dark:text-rose-400">2. Returns & Refunds:</strong> Sellers must honor 14-day return policy for damaged/not-as-described items. Heartz Rhythm may mediate disputes.</p>
                <p><strong className="text-rose-600 dark:text-rose-400">3. Fees & Billing:</strong> Standard transaction fee 4.5% + $0.30 per order. No monthly subscription. Promotional fees optional.</p>
                <p><strong className="text-rose-600 dark:text-rose-400">4. Community Standards:</strong> No hate speech, prohibited items (weapons, illegal mods). Respect the rhythm community.</p>
                <p><strong className="text-rose-600 dark:text-rose-400">5. Termination:</strong> Heartz Rhythm reserves the right to suspend accounts violating policies. Full T&C available on seller hub.</p>
              </div>
            </section>
            
            {/* FAQ SECTION */}
            <section id="faq" data-section="faq" className="scroll-mt-24 border-t border-gray-200 dark:border-gray-800 pt-8 pb-10">
              <div className="flex items-center gap-2 mb-5">
                <i className="fas fa-question-circle text-rose-500 text-xl"></i>
                <h2 className="text-2xl font-bold">🎸 Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900/30">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="faq-question flex justify-between items-center w-full p-4 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/20 transition text-left"
                    >
                      <span><i className="fas fa-question-circle text-rose-400 mr-2"></i> {faq.question}</span>
                      <i className={`fas fa-chevron-down text-gray-500 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}></i>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === idx ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                      <div className="px-4 text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* CTA */}
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 p-6 rounded-2xl text-center border border-rose-200 dark:border-rose-800/40">
              <p className="font-semibold text-xl">🎵 Ready to share your rhythm?</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Join <span className="text-rose-600 dark:text-rose-400 font-bold">3,500+ active sellers</span> and start your journey today.</p>
              <Link to="/seller">
              <div className='mt-2'>
              <Button text="Start Selling" />
              </div>
              </Link>
            </div>
          </div>
          
          {/* RIGHT SIDE: Vertical Timeline with glowing active line */}
          <div className="hidden md:flex flex-col lg:w-1/3 relative">
            <div className="sticky top-24 space-y-6">
              {/* Vertical timeline navigation */}
              <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-6 border-l-4 border-rose-500 dark:border-rose-500 relative overflow-hidden">
                <div className="absolute -top-2 -right-2 text-rose-500 dark:text-rose-400 text-3xl opacity-60">♩ ♪ ♫</div>
                <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                  <i className="fas fa-bars-staggered text-rose-500"></i> 
                  On this page
                </h3>
                <div className="space-y-0 relative">
                  {/* Vertical line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                  
                  {sections.map((section, idx) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`relative flex items-center gap-3 w-full text-left py-3 pl-8 pr-2 rounded-lg transition-all duration-300 group ${
                        activeSection === section.id 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {/* Glowing dot on the timeline */}
                      <div className={`absolute left-[7px] w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-rose-500 shadow-lg shadow-rose-500/50 ring-4 ring-rose-500/20 scale-125'
                          : 'bg-gray-400 dark:bg-gray-600 group-hover:bg-rose-400'
                      }`}></div>
                      
                      <span className="text-xl">{section.icon}</span>
                      <span className={`font-medium transition-all ${activeSection === section.id ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                        {section.label}
                      </span>
                      
                      {/* Glowing line effect for active section */}
                      {activeSection === section.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Decorative musical lines */}
                <div className="mt-6 pt-4 border-t border-dashed border-rose-300 dark:border-rose-800">
                  <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <div className="flex items-center gap-2"><i className="fas fa-grip-lines-vertical text-rose-400"></i> <span>━━━━━━━━━━━━━━━━━━━━━━━</span></div>
                    <div className="flex items-center gap-2"><i className="fas fa-grip-lines-vertical text-rose-400"></i> <span>───────── ♪ ─────────</span></div>
                    <div className="flex items-center gap-2"><i className="fas fa-grip-lines-vertical text-rose-400"></i> <span>╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍</span></div>
                    <div className="flex items-center gap-2"><i className="fas fa-grip-lines-vertical text-rose-400"></i> <span>♩ ♪ ♫ ♬ ♩ ♪ ♫ ♬</span></div>
                  </div>
                  <p className="text-xs italic text-center mt-4 text-gray-500 dark:text-gray-400">"Every seller brings a unique chord"</p>
                  <div className="flex justify-end mt-2"><span className="text-rose-500 text-xl">♫</span></div>
                </div>
              </div>
              
              {/* Quick stats card */}
              <div className="bg-white dark:bg-gray-900/40 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
                <h4 className="font-bold flex items-center gap-2 mb-3"><i className="fas fa-chart-simple text-rose-500"></i> Platform Stats</h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">50K+</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Active Buyers</div>
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">3.5K+</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Sellers</div>
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">98%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Satisfaction</div>
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">24h</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Payouts</div>
                  </div>
                </div>
              </div>
              
              {/* Support CTA */}
              <div className="text-center py-4 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl bg-gradient-to-r from-transparent to-rose-100/20 dark:to-rose-950/20">
                <i className="fas fa-headset text-2xl mb-2 block"></i>
                <p className="text-sm font-medium">Need help?</p>
                <p className="text-xs">Contact seller support</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* footer */}
        <footer className="mt-16 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-500 flex justify-between flex-wrap">
          <span>© Heartz Rhythm — Seller Hub v2.0</span>
          <span><i className="fas fa-heart text-rose-500"></i> rhythm & soul</span>
        </footer>
      </div>

      <style>{`
        .rhythm-heart {
          animation: pulse 1.6s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; text-shadow: 0 0 6px #e11d48; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        .dark .rhythm-heart {
          animation: pulse-dark 1.6s infinite;
        }
        @keyframes pulse-dark {
          0% { transform: scale(1); text-shadow: 0 0 0px #f43f5e; }
          50% { transform: scale(1.08); text-shadow: 0 0 10px #f43f5e; }
          100% { transform: scale(1); text-shadow: 0 0 0px #f43f5e; }
        }
        .vibe-border {
          position: relative;
        }
        .vibe-border::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #e11d48, #f97316, #e11d48);
          border-radius: 4px 0 0 4px;
          opacity: 0.7;
        }
        .dark .vibe-border::before {
          background: linear-gradient(135deg, #f43f5e, #fb923c, #be123c);
          opacity: 0.9;
        }
        .corner-accent {
          position: relative;
        }
        .corner-accent::after {
          content: "♫";
          font-size: 1.8rem;
          font-weight: 400;
          position: absolute;
          bottom: 0.5rem;
          right: 0.75rem;
          color: #e11d48;
          opacity: 0.35;
          font-family: monospace;
          pointer-events: none;
        }
        .dark .corner-accent::after {
          color: #f43f5e;
          opacity: 0.55;
          text-shadow: 0 0 2px #ff3366;
        }
        .doc-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .doc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.1);
        }
        .dark .doc-card:hover {
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.4);
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default BecomeSeller;