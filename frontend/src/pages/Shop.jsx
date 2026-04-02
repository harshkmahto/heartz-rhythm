import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Star, ShoppingCart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop = () => {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-main)] w-full">
      <main className="pt-10 md:pt-20 pb-20 px-6 md:px-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-headline tracking-tighter leading-none mb-6 text-[var(--color-text-main)]">
              THE <span className="text-[#FF3C38] drop-shadow-[0_0_15px_rgba(255,60,56,0.4)] italic">COLLECTION</span>
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg max-w-md">Precision engineering meets raw electric power. Explore our curated range of signature instruments.</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 bg-[var(--color-surface)] border border-[var(--color-border-main)] p-2 rounded-full  whitespace-nowrap">
            <button className="px-6 py-2 bg-[var(--color-border-main)]/50 rounded-full text-sm font-semibold text-[#FF3C38]">All Gear</button>
            <button className="px-6 py-2 hover:bg-[var(--color-border-main)]/50 rounded-full text-sm font-semibold text-[var(--color-text-muted)] transition-colors">Electric</button>
            <button className="px-6 py-2 hover:bg-[var(--color-border-main)]/50 rounded-full text-sm font-semibold text-[var(--color-text-muted)] transition-colors">Basses</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <h3 className="font-headline font-bold text-xl tracking-tight flex items-center gap-2">
                <Filter size={20} className="text-[#FF3C38]" /> Filters
              </h3>
              
              {/* Search Mobile */}
              <div className="lg:hidden flex items-center bg-[var(--color-surface)] border border-[var(--color-border-main)] px-4 py-3 rounded-2xl">
                <Search size={18} className="text-[var(--color-text-muted)]" />
                <input className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full ml-2 text-[var(--color-text-main)]" placeholder="Search..." type="text" />
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Price Range</label>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border-main)] p-6 rounded-2xl space-y-4">
                  <div className="h-1 bg-[var(--color-border-main)] rounded-full relative">
                    <div className="absolute left-0 right-1/4 h-full bg-[#FF3C38] shadow-[0_0_10px_rgba(255,60,56,0.5)]"></div>
                    <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-[#FF3C38] cursor-pointer"></div>
                  </div>
                  <div className="flex justify-between text-sm font-mono text-[var(--color-text-muted)]">
                    <span>$500</span>
                    <span>$4500+</span>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Manufacturer</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-[var(--color-border-main)] group-hover:border-[#FF3C38] transition-colors flex items-center justify-center"></div>
                    <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors text-sm">Vanguard Custom</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-[#FF3C38] bg-[#FF3C38]/10 flex items-center justify-center">
                      <Check size={14} className="text-[#FF3C38]" />
                    </div>
                    <span className="text-[var(--color-text-main)] transition-colors text-sm">Heart Rhythm Ltd.</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-[var(--color-border-main)] group-hover:border-[#FF3C38] transition-colors flex items-center justify-center"></div>
                    <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors text-sm">Void Series</span>
                  </label>
                </div>
              </div>

              {/* Finish/Type */}
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Body Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-3 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-main)] text-xs text-[var(--color-text-muted)] hover:border-[#FF3C38]/50 hover:text-[var(--color-text-main)] transition-all">Solid Body</button>
                  <button className="py-3 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-main)] text-xs text-[var(--color-text-muted)] hover:border-[#FF3C38]/50 hover:text-[var(--color-text-main)] transition-all">Semi-Hollow</button>
                  <button className="py-3 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-main)] text-xs text-[var(--color-text-muted)] hover:border-[#FF3C38]/50 hover:text-[var(--color-text-main)] transition-all">Offset</button>
                  <button className="py-3 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-main)] text-xs text-[var(--color-text-muted)] hover:border-[#FF3C38]/50 hover:text-[var(--color-text-main)] transition-all">Double Cut</button>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-xl border-[#FF3C38]/20 bg-[var(--color-surface)]">
              <p className="text-xs uppercase tracking-widest text-[#FF3C38] font-bold mb-2">Need a pro opinion?</p>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">Talk to our master luthiers about a custom build today.</p>
              <button className="w-full py-4 bg-gradient-to-br from-[#FF3C38] to-[#FF7A00] rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(255,60,56,0.3)] transition-all">Book Consultation</button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <span className="text-[var(--color-text-muted)] font-label text-sm">Showing <span className="text-[var(--color-text-main)] font-bold">24</span> instruments</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Sort by:</span>
                <select className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-bold text-[#FF3C38] cursor-pointer">
                  <option className="bg-[var(--color-bg)]">Price: High to Low</option>
                  <option className="bg-[var(--color-bg)]">Newest Arrivals</option>
                  <option className="bg-[var(--color-bg)]">Customer Favorites</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Product 1 */}
              <Link to="/product/1" className="group relative bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-[#FF3C38]/50 overflow-hidden block">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF3C38]/10 blur-[80px] group-hover:bg-[#FF3C38]/20 transition-all duration-700"></div>
                <div className="relative h-80 mb-8 flex items-center justify-center">
                  <img alt="The Void SE" className="h-[90%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSM__RQGuaFJP9vbILKuBheSAQyU-D8n-_Ym-maOxx6boouWJajz-GeF_aR5LzfoEgoQxVBdcDsY0JFo6ogXqjTvRXlzvEc0TrvZLASMhPDfLCwHek4tIG62dSwdyeYmtgWehum4Hgd2LJe2iHxGDBoaPh547u4c3VdBn0zMNe4a7mfYS5WNBKh9UeDc6kXzRGax8T0qeZ6mX_7VgzMjtyjE8pRspHO1hnCppz5WoxGSct0Qrhtrs9rxIVD9d4LjRdaT4yIIUsecRK" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black font-headline tracking-tight group-hover:text-[#FF3C38] transition-colors">THE VOID SE</h3>
                      <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest mt-1">Heart Rhythm Ltd.</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#FF7A00]">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-black font-headline tracking-tighter text-glow text-[var(--color-text-main)] drop-shadow-[0_0_10px_rgba(255,60,56,0.3)]">$3,299</span>
                    <button className="w-12 h-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border-main)] flex items-center justify-center text-[#FF3C38] hover:bg-[#FF3C38] hover:text-white transition-all duration-300">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </Link>

              {/* Product 2 */}
              <Link to="/product/2" className="group relative bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-[#FF3C38]/50 overflow-hidden block">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF7A00]/10 blur-[80px] group-hover:bg-[#FF7A00]/20 transition-all duration-700"></div>
                <div className="relative h-80 mb-8 flex items-center justify-center">
                  <img alt="Bloodline Custom" className="h-[90%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNAuuP7J-aT4HdsCG5WYV2MqQJR8Oo1e3JiaYmx3kE2ou7ZQZ6T3kdibJseFUQjWUofKypVhFsMOwbkb4xzUWhV2PfI2MJF3RxSTiGOWRno2c0FLVBwJIdHN3xI5g41ca9NrXXxcVIQqWQBsDEhvWygU92QzXWFK4Dzoqv5NReO8YctjSc3h3NniU8XmwafxAjdI4VauJMfb2GI_-8J2X3A-pcVKi-1l5HOGX0IncQ3smiuhnZk116xquiIb2NSt3g2tEPkPucZjxG" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black font-headline tracking-tight group-hover:text-[#FF3C38] transition-colors">BLOODLINE CUSTOM</h3>
                      <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest mt-1">Vanguard Custom</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#FF7A00]">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold">5.0</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-black font-headline tracking-tighter text-glow text-[var(--color-text-main)] drop-shadow-[0_0_10px_rgba(255,60,56,0.3)]">$4,850</span>
                    <button className="w-12 h-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border-main)] flex items-center justify-center text-[#FF3C38] hover:bg-[#FF3C38] hover:text-white transition-all duration-300">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </Link>

              {/* Product 3 */}
              <Link to="/product/3" className="group relative bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-[#FF3C38]/50 overflow-hidden block">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[80px] group-hover:bg-purple-500/20 transition-all duration-700"></div>
                <div className="relative h-80 mb-8 flex items-center justify-center">
                  <img alt="Nebula Bass" className="h-[90%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW9HqVw-kK9dlBZ4IlhTZ5W3o4JcLR3SHcPSYM7KisDZ__C4nDAUq8OZjJbWkr3ITeS9ZT5kmi8zWg5nSurR5uG8ckjiIYN_7pwnpOmnbLX3jW48LpLRptj7_ua98mB2hkNExdpE5qlRgVLhoSqBNH3-2WIfZjuK5PJINA_alL_xkJjrTO_iH3sbR5AAi_8xbZ2BZbmLhAGsrLPpqvw28vp7o49HNGqUa9ozjFfa8yFL-woUz12ddAmCoQnb7ZVurphVEhai9PBbZy" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black font-headline tracking-tight group-hover:text-[#FF3C38] transition-colors">NEBULA BASS</h3>
                      <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest mt-1">Heart Rhythm Ltd.</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#FF7A00]">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-black font-headline tracking-tighter text-glow text-[var(--color-text-main)] drop-shadow-[0_0_10px_rgba(255,60,56,0.3)]">$2,195</span>
                    <button className="w-12 h-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border-main)] flex items-center justify-center text-[#FF3C38] hover:bg-[#FF3C38] hover:text-white transition-all duration-300">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </Link>

              {/* Additional products could go here, simplified for sake of component length */}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex justify-center items-center gap-4">
              <button className="w-12 h-12 rounded-full border border-[var(--color-border-main)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[#FF3C38] hover:border-[#FF3C38] transition-all">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <button className="w-12 h-12 rounded-full bg-[#FF3C38] text-white font-bold">1</button>
                <button className="w-12 h-12 rounded-full border border-[var(--color-border-main)] hover:border-[#FF3C38] text-[var(--color-text-main)] transition-all font-bold">2</button>
                <button className="w-12 h-12 rounded-full border border-[var(--color-border-main)] hover:border-[#FF3C38] text-[var(--color-text-main)] transition-all font-bold">3</button>
                <span className="px-2 text-[var(--color-text-muted)]">...</span>
                <button className="w-12 h-12 rounded-full border border-[var(--color-border-main)] hover:border-[#FF3C38] text-[var(--color-text-main)] transition-all font-bold">12</button>
              </div>
              <button className="w-12 h-12 rounded-full border border-[var(--color-border-main)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[#FF3C38] hover:border-[#FF3C38] transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;
