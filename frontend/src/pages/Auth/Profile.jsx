import React from 'react';
import { User, Settings, Package, Heart, LogOut, ChevronRight, Edit3 } from 'lucide-react';

const Profile = () => {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-main)] w-full min-h-screen">
      <main className="pt-10 md:pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 italic text-[var(--color-text-main)]">Your <span className="text-[#FF3C38]">Backstage.</span></h1>
          <p className="text-[var(--color-text-muted)] font-body max-w-2xl text-lg">Manage your profile, secure your gear, and review past tours.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="glass-card bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-2xl p-6 text-center relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF3C38]/10 rounded-full blur-[40px] group-hover:bg-[#FF3C38]/20 transition-all"></div>
              <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#FF3C38]/30 mb-4 overflow-hidden relative group-hover:border-[#FF3C38] transition-colors">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB4E5blKP0r5VTEfNRJIY6Hds7QNWkWD9HQtv7qDPKROBpwoaruAE5ekMUaNVpWJE_4fmhabRC0bZWpTW5iuh2qCLb3ngH828rptotptpLIHLd5QcJHHLupABnSwAe7fcWEC56pFIc2jygnmmHgnKV3_Gw99nbEqYA45HKKNGlxZssWLCH0CyuTB1BMkOA1LFTt2urtuRzaXTN4uc-CUiFmtCn_WoHxx1OGS7Euv2UH-XrUyhX2luH2MtapCofLAMw3DUnviT7P03Y" alt="Profile" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Edit3 size={20} className="text-white" />
                </div>
              </div>
              <h3 className="font-headline font-bold text-xl">Julian Drummers</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">julian@rhythm.com</p>
              <div className="inline-block px-3 py-1 bg-[#FF3C38]/10 border border-[#FF3C38]/20 text-[#FF3C38] text-[10px] font-bold tracking-widest uppercase rounded-full">Pro Member</div>
            </div>

            <nav className="flex flex-col gap-2">
              <button className="flex items-center justify-between w-full px-5 py-3 rounded-xl bg-[#FF3C38]/10 text-[#FF3C38] font-semibold border-l-4 border-[#FF3C38] transition-all">
                <div className="flex items-center gap-3">
                  <User size={18} /> Account Info
                </div>
                <ChevronRight size={16} />
              </button>
              <button className="flex items-center justify-between w-full px-5 py-3 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-white transition-all">
                <div className="flex items-center gap-3">
                  <Package size={18} /> Order History
                </div>
              </button>
              <button className="flex items-center justify-between w-full px-5 py-3 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-white transition-all">
                <div className="flex items-center gap-3">
                  <Heart size={18} /> Wishlist
                </div>
              </button>
              <button className="flex items-center justify-between w-full px-5 py-3 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-white transition-all">
                <div className="flex items-center gap-3">
                  <Settings size={18} /> Preferences
                </div>
              </button>
              <button className="flex items-center justify-between w-full px-5 py-3 mt-4 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-semibold">
                <div className="flex items-center gap-3">
                  <LogOut size={18} /> Disconnect
                </div>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Account Details */}
            <div className="glass-card bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-headline font-black mb-6 flex items-center gap-3 border-b border-[var(--color-border-main)] pb-4">
                <User size={24} className="text-[#FF3C38]" /> Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Full Name</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-3 outline-none text-[var(--color-text-main)] shadow-inner pointer-events-none opacity-70 cursor-not-allowed" value="Julian Drummers" readOnly type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Email Address</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-3 outline-none text-[var(--color-text-main)] shadow-inner pointer-events-none opacity-70 cursor-not-allowed" value="julian@rhythm.com" readOnly type="email" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Phone Number</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-3 focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner" defaultValue="+1 (555) 123-4567" type="tel" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold ml-1">Timezone</label>
                  <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl px-5 py-3 focus:border-[#FF3C38] outline-none transition-all text-[var(--color-text-main)] shadow-inner" defaultValue="Pacific Standard Time (PST)" type="text" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button className="bg-gradient-to-r from-[#FF3C38] to-[#FF7A00] text-white font-bold py-3 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,60,56,0.2)]">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="glass-card bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--color-border-main)] pb-4">
                <h2 className="text-2xl font-headline font-black flex items-center gap-3">
                  <Package size={24} className="text-[#FF3C38]" /> Recent Gear Tours
                </h2>
                <button className="text-sm font-bold text-[#FF3C38] hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                {/* Order 1 */}
                <div className="bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#FF3C38]/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-main)] flex items-center justify-center p-2">
                      <img className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-bwJA3cXTkON24_dkhvH1RsasJQF26RLywHDADI2sA66rUAS0e-eBkgSU_6T5aLQi9ZRvuVqmEHT400fNqxc4OwbaHAW2YQQnHNC1enxpB83QrTTZZXjJxLhMfKG_7wh6JJLpnfavVBJxo4aEmnRa8bfAadRXM8FcQ1yDJSlc5rguilV2icnbQfnT3qID8ZZo3Gb1BafHVuOIGWzfbvGfqHo8FsMKZskVMZNhAslrRfj7wA50x4Hjw82-jZ-VGTDcfJJ7CclFD5ms" alt="Product" />
                    </div>
                    <div>
                      <h4 className="font-bold">The Midnight Pulse</h4>
                      <p className="text-[var(--color-text-muted)] text-xs mt-1">Ordered on Oct 12, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 flex-1 md:flex-none w-full md:w-auto">
                    <div className="text-right">
                      <p className="font-black font-headline text-lg">$3,499.00</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Order 2 */}
                <div className="bg-[var(--color-bg)] border border-[var(--color-border-main)] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#FF3C38]/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-main)] flex items-center justify-center p-2">
                      <img className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT9-aj-loTZCpHDG-oUnQhH0NDzStA0gBSYdua21j_zjWe4UUyWMgXZGKBXLtX5Zo2HW8EV_OTNqh329G9pTn0eqyV3XvVhauWtG3iwfnZ3NuUyBrFyg8a9d-QWP27qwifC_9J5Wo4dp6Prt9iDWTQ39vb-xXNRE13q_Hr7OWp378eFiZ0FwcOGfTKcoaNTGh0ABOxNEPn84aLd6zBZCu8so5EeHL-oofQyXcPceE5lAYTu1ljok6yN9VJXVSN2cRSXL25XjMEq6QT" alt="Product" />
                    </div>
                    <div>
                      <h4 className="font-bold">Vortex 50W Head</h4>
                      <p className="text-[var(--color-text-muted)] text-xs mt-1">Ordered on Oct 24, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 flex-1 md:flex-none w-full md:w-auto">
                    <div className="text-right">
                      <p className="font-black font-headline text-lg">$2,199.00</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FF3C38]/10 text-[#FF3C38] border border-[#FF3C38]/20">In Transit</span>
                    </div>
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

export default Profile;
