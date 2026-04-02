import React from 'react';
import { CreditCard, MapPin, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

const Checkout = () => {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-main)] w-full">
      <main className="pt-10 md:pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 italic text-[var(--color-text-main)]">Deployment.</h1>
          <p className="text-[var(--color-text-muted)] font-body max-w-2xl text-lg">Enter your rig location and finalize payment to drop the stage.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Forms */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 px-2 overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2 text-[var(--color-text-muted)] font-bold">
                <span className="min-w-8 w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-main)] flex items-center justify-center text-xs">
                  <CheckCircle2 size={16} className="text-[#FF3C38]" />
                </span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline">Cart</span>
              </div>
              <div className="h-px flex-1 min-w-[30px] bg-[var(--color-border-main)]"></div>
              <div className="flex items-center gap-2 text-[#FF3C38]">
                <span className="min-w-8 w-8 h-8 rounded-full border border-[#FF3C38] bg-[#FF3C38]/10 flex items-center justify-center text-xs font-bold">02</span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline font-bold">Shipping</span>
              </div>
              <div className="h-px flex-1 min-w-[30px] bg-[var(--color-border-main)]"></div>
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <span className="min-w-8 w-8 h-8 rounded-full border border-[var(--color-border-main)] flex items-center justify-center text-xs">03</span>
                <span className="text-sm uppercase tracking-widest hidden sm:inline">Review</span>
              </div>
            </div>

            <div className="space-y-8 glass-card bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-2xl p-8 md:p-10 shadow-lg">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-[var(--color-text-main)] flex items-center gap-3">
                <MapPin size={28} className="text-[#FF3C38]" />
                Deployment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3 flex flex-col items-start">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Full Name</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner" placeholder="Jimi Hendrix" type="text" />
                </div>
                <div className="space-y-3 flex flex-col items-start">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Email Signal</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner" placeholder="jimi@stratocaster.com" type="email" />
                </div>
                <div className="md:col-span-2 space-y-3 flex flex-col items-start">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Street Address</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner" placeholder="Electric Lady Studios, 52 W 8th St" type="text" />
                </div>
                <div className="space-y-3 flex flex-col items-start">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">City</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner" placeholder="New York" type="text" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3 flex flex-col items-start">
                    <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">State</label>
                    <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner" placeholder="NY" type="text" />
                  </div>
                  <div className="space-y-3 flex flex-col items-start">
                    <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Postal Code</label>
                    <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner" placeholder="10011" type="text" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-8 glass-card bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-2xl p-8 md:p-10 shadow-lg mt-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-[var(--color-text-main)] flex items-center gap-3">
                <CreditCard size={28} className="text-[#FF3C38]" />
                Payment Method
              </h2>
              <div className="space-y-6 pt-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 rounded-xl border-2 border-[#FF3C38] bg-[#FF3C38]/5 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,60,56,0.1)]">
                    <CreditCard size={24} className="text-[#FF3C38]" />
                    <span className="font-bold text-sm">Credit Card</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-[var(--color-border-main)] bg-[var(--color-bg)] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#FF3C38]/50 transition-colors">
                    <span className="font-bold text-xl italic font-serif leading-none">PayPal</span>
                  </div>
                </div>

                <div className="space-y-3 flex flex-col items-start">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Card Number</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner font-mono tracking-widest" placeholder="0000 0000 0000 0000" type="text" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3 flex flex-col items-start">
                    <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Expiry (MM/YY)</label>
                    <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner font-mono tracking-widest" placeholder="12/25" type="text" />
                  </div>
                  <div className="space-y-3 flex flex-col items-start">
                    <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">CVC</label>
                    <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-4 focus:ring-1 focus:ring-[#FF3C38] focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner font-mono tracking-widest" placeholder="123" type="text" />
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 glass-card p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-main)] flex flex-col gap-8 shadow-[0_0_30px_rgba(0,0,0,0.05)] dark:shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <h2 className="font-headline text-2xl font-black text-[var(--color-text-main)] italic tracking-tighter">Summary</h2>
              
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
              
              <div className="space-y-4 mt-6">
                <button className="w-full bg-gradient-to-br from-[#FF3C38] to-[#FF7A00] py-5 rounded-xl font-headline font-black uppercase tracking-widest text-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,60,56,0.2)] border-none">
                  Confirm & Route
                </button>
                
                <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold pt-2">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-[#FF3C38]" />
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
