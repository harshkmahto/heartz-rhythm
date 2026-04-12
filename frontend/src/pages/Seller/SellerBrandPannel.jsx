import React from 'react';
import {
  MapPin, Calendar, Users, Star, Briefcase, Globe, Mail, Phone,
  Award, Heart, Shield, Truck, Clock,
  ExternalLink, CheckCircle, Headphones, Disc, Mic,
  Sparkles, Zap, ChevronRight, Music, Volume2, Guitar,
  Monitor, Smartphone
} from 'lucide-react';

const SellerBrandPanel = () => {
  const featuredProducts = [
    { name: "Stratocaster", type: "Electric Guitar", price: "$1,299", image: "https://images.unsplash.com/photo-1564186763535-5e6b8c1d9f3d?w=400&h=300&fit=crop", tag: "Bestseller" },
    { name: "Telecaster", type: "Electric Guitar", price: "$1,199", image: "https://images.unsplash.com/photo-1556182105-d548f7a3f1c5?w=400&h=300&fit=crop", tag: "Classic" },
    { name: "Precision Bass", type: "Bass Guitar", price: "$1,499", image: "https://images.unsplash.com/photo-1516924962500-aaec7c6b3bb5?w=400&h=300&fit=crop", tag: "New" }
  ];

  const achievements = [
    { value: "75+", label: "Years of Excellence", icon: Award },
    { value: "500+", label: "Products", icon: Guitar },
    { value: "50+", label: "Countries", icon: Globe },
    { value: "10M+", label: "Happy Customers", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">

      {/* Hero Banner Section */}
      <div className="relative">
        <div className="relative w-full h-[320px] md:h-[440px] lg:h-[500px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69415868d?w=1600&h=500&fit=crop"
            alt="Fender Brand Banner"
            className="w-full h-full object-cover brightness-90 dark:brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-emerald-900/20 to-emerald-800/30 dark:from-gray-950/80 dark:via-gray-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>

          {/* Premium Seller Badge */}
          <div className="absolute top-6 right-6 z-10">
            <div className="px-4 py-2 bg-emerald-600/95 backdrop-blur-md rounded-full shadow-xl border border-emerald-400/30">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <p className="text-white font-semibold text-sm tracking-wide">PREMIUM SELLER</p>
              </div>
            </div>
          </div>

          {/* Sonic Architect Badge */}
          <div className="absolute top-6 left-6 z-10">
            <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full shadow-xl border border-white/20">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-400" />
                <p className="text-white font-medium text-sm tracking-wide">Sonic Architect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Profile Card */}
        <div className="relative -mt-20 sm:-mt-24 md:-mt-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-200/50 dark:border-emerald-800/30">

              {/* Brand Logo */}
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Fender_logo.png/800px-Fender_logo.png"
                    alt="Fender Brand Logo"
                    className="w-full h-full object-contain p-3"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-xl border-2 border-white dark:border-gray-800">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Brand Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-200">
                    Fender
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">SINCE 1946</span>
                </div>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center justify-center md:justify-start gap-2">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Premium Musical Instruments & Analog Gear
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  {["Acoustic Guitars", "Electric Guitars", "Bass Guitars", "Amplifiers", "Vinyl Pressing"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-semibold dark:bg-emerald-950/60 dark:text-emerald-300 backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-shrink-0">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 hover:from-emerald-500 hover:to-emerald-600 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Follow Store
                </button>
                <button className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-300 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/50 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          <div className="lg:col-span-2">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-7 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                  <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">About the Identity</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Fender</span> represents the pinnacle of high-fidelity sound reproduction.
                We specialize in curating limited edition releases and bespoke analog studio hardware that bridges the gap
                between classic warmth and futuristic precision.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Founded in 1946 by Leo Fender, the company has shaped modern music with iconic instruments like the Stratocaster, Telecaster,
                and Precision Bass. Today, Fender continues to innovate while honoring its rich heritage, serving musicians of all levels.
              </p>
              <div className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30 p-4 rounded-xl mb-6 border-l-4 border-emerald-500">
                <p className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Mastered for Precision Audio
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sustainable 180g Vinyl Pressing • Hand-assembled Analog Circuits</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/30">
                {achievements.map((stat, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company Details Card */}
          <div>
            <div className="bg-gradient-to-br from-emerald-50/80 to-white dark:from-gray-900 dark:to-gray-950 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                Premium Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Established</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Since 1946</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Headquarters</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Los Angeles, California, USA</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Team Size</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">3,000+ Global Team</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Website</p>
                    <a href="#" className="text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400 flex items-center gap-1">
                      www.fender.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-emerald-200/50 dark:border-emerald-800/30">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-emerald-500" /> Contact Support
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">support@fender.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">+1 (800) 856-9801</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Omnichannel Preview Section ── */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Monitor className="w-6 h-6 text-emerald-500" />
              Omnichannel Preview
            </h2>
            {/* Desktop / Mobile toggle icons */}
            <div className="flex gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700">
                <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Smartphone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            See how the Fender identity adapts across different surfaces.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6 items-end">

            {/* Desktop Browser Mockup */}
            <div className="rounded-2xl overflow-hidden border-2 border-gray-700 dark:border-gray-600 shadow-2xl">
              {/* Title bar */}
              <div className="bg-[#2d3447] px-4 py-2.5 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
                <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
                <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
                <div className="flex-1 ml-2 bg-[#1a1f2e] rounded px-3 py-0.5 text-[11px] text-gray-400">
                  fender.com
                </div>
              </div>
              {/* Body */}
              <div className="bg-[#1a1f2e] p-5">
                {/* Mini store preview */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-xl mb-2">🎸</div>
                  <p className="text-white font-bold text-sm">The Audio Store</p>
                  <p className="text-gray-400 text-xs mt-0.5">Live store preview for desktop environments.</p>
                </div>
                {/* Skeleton bars */}
                <div className="space-y-2 mb-4">
                  <div className="h-2 bg-[#2d3447] rounded w-4/5"></div>
                  <div className="h-2 bg-[#2d3447] rounded w-3/5"></div>
                  <div className="h-2 bg-[#2d3447] rounded w-2/5"></div>
                </div>
                {/* Skeleton cards row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 bg-[#2d3447] rounded-lg flex items-center justify-center">
                    <div className="h-1.5 bg-emerald-500/40 rounded w-3/5"></div>
                  </div>
                  <div className="h-10 bg-[#2d3447] rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="mx-auto w-[180px] rounded-[28px] border-[3px] border-gray-700 dark:border-gray-600 overflow-hidden shadow-2xl bg-[#111827]">
              {/* Status bar / notch */}
              <div className="bg-[#1f2937] px-3 py-1.5 flex items-center justify-between">
                <span className="text-[9px] text-gray-400">4G</span>
                <div className="w-8 h-2 bg-[#111827] rounded-full"></div>
                <span className="text-[9px] text-gray-400">●●●</span>
              </div>
              {/* Body */}
              <div className="bg-[#0f172a] p-3">
                <p className="text-[9px] text-gray-500 text-right mb-2">Safe for work</p>
                {/* Mini music player */}
                <div className="bg-[#1e293b] rounded-xl p-3">
                  <p className="text-[9px] text-gray-400 mb-1">Now Playing</p>
                  <p className="text-[11px] text-gray-100 font-semibold mb-2">Midnight Echoes</p>
                  {/* Album art */}
                  <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center mb-2">
                    <Music className="w-5 h-5 text-white/80" />
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 bg-[#334155] rounded-full mb-2">
                    <div className="h-1 bg-emerald-400 rounded-full w-2/5"></div>
                  </div>
                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-[#334155] flex items-center justify-center">
                      <span className="text-gray-400" style={{ fontSize: 8 }}>⏮</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white" style={{ fontSize: 10 }}>⏸</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#334155] flex items-center justify-center">
                      <span className="text-gray-400" style={{ fontSize: 8 }}>⏭</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Showcase */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Disc className="w-6 h-6 text-emerald-500" />
              Featured Showcase
            </h2>
            <button className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Signature releases and precision engineered hardware.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product, idx) => (
              <div key={idx} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-100 dark:border-emerald-800/30">
                <div className="relative h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">{product.tag}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.type}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{product.price}</span>
                    <button className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-semibold hover:bg-emerald-500 hover:text-white transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl mb-3">
              <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Premium Vinyl & Analog Gear</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Experience uncompromised quality and craftsmanship</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Express Shipping", desc: "On orders over $50 worldwide", gradient: "from-emerald-500 to-teal-500" },
              { icon: Clock, title: "24/7 Concierge Support", desc: "Premium customer service", gradient: "from-blue-500 to-cyan-500" },
              { icon: Shield, title: "Lifetime Warranty", desc: "On all analog equipment", gradient: "from-purple-500 to-indigo-500" },
              { icon: Star, title: "Master Setup Included", desc: "Professional calibration", gradient: "from-amber-500 to-orange-500" }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className={`inline-flex p-3 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 dark:from-emerald-950 dark:to-gray-900 rounded-2xl p-8 text-center shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to experience analog perfection?</h3>
          <p className="text-emerald-200 mb-6">Join thousands of musicians who trust Fender for their sound</p>
          <button className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105">
            Explore Collection
          </button>
        </div>

      </div>
    </div>
  );
};

export default SellerBrandPanel;