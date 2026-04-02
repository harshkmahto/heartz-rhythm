import React from 'react';
import { Minus, Plus, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-main)] w-full">
      <main className="pt-10 md:pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 italic text-[var(--color-text-main)]">Stage Ready.</h1>
          <p className="text-[var(--color-text-muted)] font-body max-w-2xl text-lg">Your selected gear is prepped for the performance. Review your kit and finalize the signal chain.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Cart & Steps */}
          <div className="lg:col-span-8 space-y-12">
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 px-2 overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2 text-[#FF3C38] font-bold">
                <span className="min-w-8 w-8 h-8 rounded-full bg-[#FF3C38]/10 border border-[#FF3C38] flex items-center justify-center text-xs">01</span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline">Cart</span>
              </div>
              <div className="h-px flex-1 min-w-[30px] bg-[var(--color-border-main)]"></div>
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <span className="min-w-8 w-8 h-8 rounded-full border border-[var(--color-border-main)] flex items-center justify-center text-xs">02</span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline">Shipping</span>
              </div>
              <div className="h-px flex-1 min-w-[30px] bg-[var(--color-border-main)]"></div>
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <span className="min-w-8 w-8 h-8 rounded-full border border-[var(--color-border-main)] flex items-center justify-center text-xs">03</span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline">Review</span>
              </div>
            </div>

            {/* Cart Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-[var(--color-border-main)] bg-[var(--color-surface)] shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-[#f5f5f5] dark:bg-[#1a1a1a] border-b border-[var(--color-border-main)]">
                    <tr>
                      <th className="p-6 font-headline uppercase tracking-widest text-xs text-[var(--color-text-muted)] font-bold">Instrument</th>
                      <th className="p-6 font-headline uppercase tracking-widest text-xs text-[var(--color-text-muted)] font-bold text-center">Quantity</th>
                      <th className="p-6 font-headline uppercase tracking-widest text-xs text-[var(--color-text-muted)] font-bold text-right">Subtotal</th>
                      <th className="p-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-main)]">
                    {/* Item 1 */}
                    <tr className="group hover:bg-[#FF3C38]/5 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border-main)] p-2 flex items-center justify-center relative overflow-visible">
                            <img alt="The Midnight Pulse" className="w-[85%] h-[90%] object-contain transform group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-bwJA3cXTkON24_dkhvH1RsasJQF26RLywHDADI2sA66rUAS0e-eBkgSU_6T5aLQi9ZRvuVqmEHT400fNqxc4OwbaHAW2YQQnHNC1enxpB83QrTTZZXjJxLhMfKG_7wh6JJLpnfavVBJxo4aEmnRa8bfAadRXM8FcQ1yDJSlc5rguilV2icnbQfnT3qID8ZZo3Gb1BafHVuOIGWzfbvGfqHo8FsMKZskVMZNhAslrRfj7wA50x4Hjw82-jZ-VGTDcfJJ7CclFD5ms" />
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-lg text-[var(--color-text-main)] group-hover:text-[#FF3C38] transition-colors">The Midnight Pulse</h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-body mt-1">Ebony Fretboard / Seymour Duncan Pickups</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center bg-[var(--color-bg)] rounded-full px-4 py-2 border border-[var(--color-border-main)] shadow-inner">
                            <button className="text-[var(--color-text-muted)] hover:text-[#FF3C38] transition-colors p-1">
                              <Minus size={14} />
                            </button>
                            <span className="mx-4 font-headline font-bold text-[var(--color-text-main)]">1</span>
                            <button className="text-[var(--color-text-muted)] hover:text-[#FF3C38] transition-colors p-1">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className="font-headline font-black text-lg text-[var(--color-text-main)]">$3,499.00</span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors p-2 bg-[var(--color-bg)] rounded-full border border-transparent hover:border-red-500/30">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Item 2 */}
                    <tr className="group hover:bg-[#FF3C38]/5 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border-main)] p-2 flex items-center justify-center relative overflow-visible">
                            <img alt="Vortex 50W Head" className="w-[85%] h-[90%] object-contain transform group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT9-aj-loTZCpHDG-oUnQhH0NDzStA0gBSYdua21j_zjWe4UUyWMgXZGKBXLtX5Zo2HW8EV_OTNqh329G9pTn0eqyV3XvVhauWtG3iwfnZ3NuUyBrFyg8a9d-QWP27qwifC_9J5Wo4dp6Prt9iDWTQ39vb-xXNRE13q_Hr7OWp378eFiZ0FwcOGfTKcoaNTGh0ABOxNEPn84aLd6zBZCu8so5EeHL-oofQyXcPceE5lAYTu1ljok6yN9VJXVSN2cRSXL25XjMEq6QT" />
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-lg text-[var(--color-text-main)] group-hover:text-[#FF3C38] transition-colors">Vortex 50W Head</h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-body mt-1">Point-to-Point Handwired / Class A</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center bg-[var(--color-bg)] rounded-full px-4 py-2 border border-[var(--color-border-main)] shadow-inner">
                            <button className="text-[var(--color-text-muted)] hover:text-[#FF3C38] transition-colors p-1">
                              <Minus size={14} />
                            </button>
                            <span className="mx-4 font-headline font-bold text-[var(--color-text-main)]">1</span>
                            <button className="text-[var(--color-text-muted)] hover:text-[#FF3C38] transition-colors p-1">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className="font-headline font-black text-lg text-[var(--color-text-main)]">$2,199.00</span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors p-2 bg-[var(--color-bg)] rounded-full border border-transparent hover:border-red-500/30">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 glass-card p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-main)] flex flex-col gap-8 shadow-[0_0_30px_rgba(0,0,0,0.05)] dark:shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <h2 className="font-headline text-2xl font-black text-[var(--color-text-main)] italic tracking-tighter">Total Signal Strength</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)] font-body">Subtotal</span>
                  <span className="text-[var(--color-text-main)] font-headline font-bold">$5,698.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)] font-body">Insured Shipping</span>
                  <span className="text-[var(--color-text-main)] font-headline font-bold">$45.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)] font-body">Est. Tax</span>
                  <span className="text-[var(--color-text-main)] font-headline font-bold">$484.33</span>
                </div>
                <div className="pt-6 mt-4 border-t border-[var(--color-border-main)] flex justify-between items-center">
                  <span className="text-[var(--color-text-main)] font-headline font-black text-xl italic uppercase">Grand Total</span>
                  <span className="text-[#FF3C38] font-headline font-black text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,60,56,0.3)]">$6,227.33</span>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <Link to="/checkout" className="w-full block text-center bg-gradient-to-br from-[#FF3C38] to-[#FF7A00] py-5 rounded-xl font-headline font-black uppercase tracking-widest text-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,60,56,0.2)] border-none">
                  Commence Checkout
                </Link>
                
                <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold pt-2">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-[#FF3C38]" />
                    Secure Gear
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck size={14} className="text-[#FF3C38]" />
                    Global Tour-Ready
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--color-bg)] p-6 rounded-xl border border-[var(--color-border-main)] space-y-3 mt-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-text-main)]">Need technical assist?</h4>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)] font-body">Our master luthiers are standing by to ensure your signal chain is perfect before shipping.</p>
                <a className="inline-block text-xs font-bold text-[#FF3C38] border-b border-[#FF3C38]/40 hover:border-[#FF3C38] transition-all" href="#">Chat with an Expert</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
