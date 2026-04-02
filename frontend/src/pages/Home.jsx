import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BannerSection from '../components/ShowCaseSection/BannerSection';
import Category from '../components/ShowCaseSection/Category';

const Home = () => {
  return (
    <div className="w-full relative bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <Category/>
      {/* Hero Section */}
      <BannerSection/>

      {/* Categories: Bento Grid */}
      <section className="px-6 md:px-8 py-28 max-w-7xl mx-auto">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-16 tracking-tight">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[600px]">
          <div className="md:col-span-8 relative group overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 h-[300px] md:h-full cursor-pointer">
            <img alt="Electric Guitars" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUvorX8PcSg7Eb8rlgC54C53IlluxCicebNRLVMRHus0FPTzUHIop-CPTyRmL48g5BmzBlk3nb-kzA9sq5uUD00l0MwWWBmjzGszDjTh2N93Mg5RqERaAl-R5gMZpKKONqJUAuXy1J0K2In5VidsvP4s_-Id0fGsdrvo-iqMrsEk8Y7huwDkwmGym8WfxGeiDjJ8Qy61fc24ZXSV4cC1XDaVC29lFZHj5OhDEDWcg9uLu4iSZDm_razXxioltDRa3ImLYaWojUU1G6" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="font-headline text-3xl font-bold text-white">Electric</h3>
              <p className="text-gray-300 mt-2 text-xs uppercase tracking-widest">High Voltage Sound</p>
            </div>
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-8 h-[600px] md:h-full">
            <div className="relative group overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 cursor-pointer">
              <img alt="Acoustic Guitars" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMDTRWmBr7sveNmWd62zE5beChVwMhj3qGH0zc75Vd1n0RN8EDH8ehzjIdKJ4GCl0Q55cXUUwgcT_ul2MN5nE0NCLtvf4j6qZTrjWwyS6PA7zI6OYBbPnYj1dhdgmsWYBY-gXJc1mGxvIDzIhZva_g01oKlEHYod7YdGb6cE-XA3ICfDMreGo8L9986W4U9u3JuECy20ryqNqE8nF21gai5wz6BUolshYDjNs8FV2zQ4TDXyjHF5U7ZfTOvpB7NRE8CvL3IARTQfLL" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline text-2xl font-bold text-white">Acoustic</h3>
                <p className="text-gray-300 mt-1 text-xs uppercase tracking-widest">Pure Resonance</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 cursor-pointer">
              <img alt="Bass Guitars" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa_oBxNCQjx0FKReVouxTgdSAAOs4tQTlRlzHmwVMpfkJZ8wxfE2wVeRNfj8j3xaoPQ9YCY3T8gD83nm5hORwRiv7NKig0pVNtCgaypvfvOzWgQ1uO0vgqbCclNOe-5FVq-KmQxTBUnCDm0EtURmVfJlAaHTrve5kFExsPJu4j_uinGzdI8ekg03_XNsXsh6lfx7yi07tI5LVDgq4334NESZIzK_wO9X_A44zQN5GqWZ58I_NymRFqsULY3Ek3W4r27TRBvJPH0eOv" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline text-2xl font-bold text-white">Bass</h3>
                <p className="text-gray-300 mt-1 text-xs uppercase tracking-widest">Deep Foundation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products: Glass Cards */}
      <section className="bg-neutral-50 dark:bg-neutral-900 py-28 px-6 md:px-8 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight">The Gallery Vault</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-xl">Precision-crafted instruments designed for the modern maestro. Each piece is a testament to sound engineering and aesthetic mastery.</p>
            </div>
            <Link to="/shop" className="flex items-center gap-2 text-[#FF3C38] font-bold hover:gap-4 transition-all">
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="glass-card p-4 rounded-2xl group transition-all duration-300 hover:bg-[#FF3C38]/5 border border-neutral-200 dark:border-neutral-800">
              <div className="aspect-4/5 relative rounded-xl overflow-visible mb-6 bg-linear-to-b from-[#f2f2f2] to-[#dfdfdf] dark:from-[#202020] dark:to-[#121212] flex items-center justify-center p-4">
                <img alt="Phantom Red Electric" className="w-[80%] h-[90%] object-contain transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQmy8mn1-C1talHZbCCQjMSHj_0iS-3KH8s3DEbW5Ve62T3Zs3vhzuejPFavel1ZMYwNP8g9NmqK-9xkA1muNUPO6_OyRBK_pdBrGPDwb-V2cqyfGVBHKKdM6nAeEohOPoyH1-gPG6d2wGOy6ljYv5VGPuw6ZiThwH5QTXmdpxp3O7zLuTjIr00nBNpx3GtUfS_J68CNO1yA-3KcP8nm_ztJtOfvVStgkkF4bPawuRoE1gP4a5t45HOgVfpcJaHnX489QSGf6vokfI" />
              </div>
              <div className="px-4 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline text-xl font-bold">Phantom Red V2</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Limited Edition Series</p>
                  </div>
                  <p className="font-headline font-black text-[#FF3C38] text-xl">$2,499</p>
                </div>
                <button className="w-full mt-6 bg-white dark:bg-neutral-950 py-3 rounded-xl font-bold border border-neutral-200 dark:border-neutral-800 hover:bg-primary hover:text-white transition-colors hover:border-transparent text-neutral-900 dark:text-neutral-50 pulse-glow">Quick Buy</button>
              </div>
            </div>
            {/* Card 2 */}
            <div className="glass-card p-4 rounded-2xl group transition-all duration-300 hover:bg-[#FF3C38]/5 border border-neutral-200 dark:border-neutral-800">
              <div className="aspect-4/5 relative rounded-xl overflow-visible mb-6 bg-linear-to-b from-[#f2f2f2] to-[#dfdfdf] dark:from-[#202020] dark:to-[#121212] flex items-center justify-center p-4">
                <img alt="Obsidian Prime" className="w-[80%] h-[90%] object-contain transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0T9UMbSCErTrQqw92T2-cL8cMRVTJw4RBz7B-R2mbUBc_D8p1a19XzQkKVkcZxreFeB1eJwqSToBNcWxgyYrKWHWnKes9adC47P-uuD5iGpc74HUIWGdIVkS6Lrm86TNTE7mJAs53S9Veu0b0N5oNG3iPAlIyaukR9yHVBDtK0ETrYZVCipIVZYhheVdav0pd6KWbEi7NU48H4xLypiGZWjRkwvIEnOrX1omNscI1bDyHidsn5AU7FjI4EoT8KRQlTd6wZVtFUMNR" />
              </div>
              <div className="px-4 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline text-xl font-bold">Obsidian Prime</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Signature Studio Line</p>
                  </div>
                  <p className="font-headline font-black text-[#FF3C38] text-xl">$1,850</p>
                </div>
                <button className="w-full mt-6 bg-white dark:bg-neutral-950 py-3 rounded-xl font-bold border border-neutral-200 dark:border-neutral-800 hover:bg-primary hover:text-white transition-colors hover:border-transparent text-neutral-900 dark:text-neutral-50 pulse-glow">Quick Buy</button>
              </div>
            </div>
            {/* Card 3 */}
            <div className="glass-card p-4 rounded-2xl group transition-all duration-300 hover:bg-[#FF3C38]/5 border border-neutral-200 dark:border-neutral-800">
              <div className="aspect-4/5 relative rounded-xl overflow-visible mb-6 bg-linear-to-b from-[#f2f2f2] to-[#dfdfdf] dark:from-[#202020] dark:to-[#121212] flex items-center justify-center p-4">
                <img alt="Vintage Echo Acoustics" className="w-[80%] h-[90%] object-contain transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKN1cZNAlVqEfX01T1RNHyipmpP02HOgEV0ZECEr_nWxHG1-At9WeDGSuzdV8Z26_3EMoFYHTjTScBY7c9v8PVcYMQSwMKuK2UuHmMqQen-fgPG5jiVd9X4IjL6FR6tWs--A3_7DTPpP1gzB7IVL4uCpxZRqKOP9aLLdl8Qx-wmD7Nx3y7sqgcerqh5mfYV54-SZBBXKdUwS6SRlhjCkF9p6wXRdfcU-l4G4voZ4qUUH_e-PhPzEZJQl53q950plPlnuHRf3O8Kea2" />
              </div>
              <div className="px-4 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline text-xl font-bold">Vintage Echo</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Heritage Series</p>
                  </div>
                  <p className="font-headline font-black text-[#FF3C38] text-xl">$3,200</p>
                </div>
                <button className="w-full mt-6 bg-white dark:bg-neutral-950 py-3 rounded-xl font-bold border border-neutral-200 dark:border-neutral-800 hover:bg-primary hover:text-white transition-colors hover:border-transparent text-neutral-900 dark:text-neutral-50 pulse-glow">Quick Buy</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-widest mb-12 font-bold">Trusted by Global Icons</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="font-headline text-3xl font-black italic hover:text-[#FF3C38] transition-colors cursor-pointer">FENDER</span>
            <span className="font-headline text-3xl font-black italic hover:text-[#FF3C38] transition-colors cursor-pointer">GIBSON</span>
            <span className="font-headline text-3xl font-black italic hover:text-[#FF3C38] transition-colors cursor-pointer">PRS</span>
            <span className="font-headline text-3xl font-black italic hover:text-[#FF3C38] transition-colors cursor-pointer">IBANEZ</span>
            <span className="font-headline text-3xl font-black italic hover:text-[#FF3C38] transition-colors cursor-pointer">TAYLOR</span>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-28 px-6 md:px-8 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
            <h2 className="font-headline text-3xl font-extrabold uppercase tracking-tighter">On High Rotation</h2>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer border border-neutral-200 dark:border-neutral-800 hover:border-[#FF3C38] hover:shadow-[0_0_20px_rgba(255,60,56,0.1)]">
              <div className="bg-white/5 dark:bg-black/20 rounded-xl p-4 mb-4">
                <img alt="Pickups" className="w-full h-32 object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsTo4lVSw8jVVAOoowu1K-U4-fZW1OY2dr8BPJbxqwRGIkZ6rfaD_NFcIpwN-k6Jck2Iy-Rgjv4tBzfYRSDPFkbhnHjqUSrgvqBEdckCU17mx0sOm0qbRrfWBBM19Oov-PvlEXWebRGSVXFcL4kFhoM_QYkLENTlR8q9ZG9Mr6VeWSY2ViZy_a3CC4xAyjBdfeLPwHk01mvXcJD7JMiNJM848GHBb0iDinW6ef6m12gIMTs4Umg_FSqgDSRhfvDoTE2JfHbhSuUl9B" />
              </div>
              <h5 className="font-bold text-lg">Velocity Humbuckers</h5>
              <p className="text-[#FF3C38] font-black mt-2 text-xl">$299</p>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer border border-neutral-200 dark:border-neutral-800 hover:border-[#FF3C38] hover:shadow-[0_0_20px_rgba(255,60,56,0.1)]">
              <div className="bg-white/5 dark:bg-black/20 rounded-xl p-4 mb-4">
                <img alt="Pedals" className="w-full h-32 object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrDw_9HaaPLU3BgvESiTVIH1O-OtVb-4xZLyruspFg3hmwQmoU7QQEOQ6cnybohrcBIhfNClSIyy4rV0gIsvhxiAom2PaJxIKiFHOpZ5yxdSsuyHkn8ZKtApO7GRhdedvfKMwxq6QakAH7ttlpi7T4KUV8q08XipXAnTOfdIsU3aDDEq5lWiVpxquXQ5bxHVqES_ydyXXd3Af80YSiIgb4g0X8g7qIUosIu2t2BajjJP3RbfyNtmGMNKGF-J18RwAr4WK1rzgJzXPz" />
              </div>
              <h5 className="font-bold text-lg">Warped Space Delay</h5>
              <p className="text-[#FF3C38] font-black mt-2 text-xl">$180</p>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer border border-neutral-200 dark:border-neutral-800 hover:border-[#FF3C38] hover:shadow-[0_0_20px_rgba(255,60,56,0.1)]">
              <div className="bg-white/5 dark:bg-black/20 rounded-xl p-4 mb-4">
                <img alt="Strings" className="w-full h-32 object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS4kYk0LSyyliOeUHSCHb0NVhnaANesW01xnKPhgF4lXXevvYSgh9pNQxyijiJO1E4pg6unBmsSYcVlPvER1LTLRzIG3CgWjgIvunJwrt53jv_AoN3HamF2Lu8zD7aHPVfyWc76DdBW-o4KrhE7EbcqPHdkMn5EYikKuwIp2PucA1Caov58437Yn0Tf7v25JGJZMn9iJ1oBAbO-P67n1REHl4wsfmWPSqEeJBfXYQsZYUSTTv0TA_KwiSjyoKt1Xm-QDNEOsZEdlYa" />
              </div>
              <h5 className="font-bold text-lg">Titanium Core Strings</h5>
              <p className="text-[#FF3C38] font-black mt-2 text-xl">$24</p>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer border border-neutral-200 dark:border-neutral-800 hover:border-[#FF3C38] hover:shadow-[0_0_20px_rgba(255,60,56,0.1)]">
              <div className="bg-white/5 dark:bg-black/20 rounded-xl p-4 mb-4">
                <img alt="Picks" className="w-full h-32 object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR6WLqn8poXgnKj27Os-PyTIsIDq1y72Kl38hCp86lIsTtL43OG-LhEP1DHmac2Kp_UlZz4YzH9K-0ZwGoIs6S1QNJHZKQsnIU2NZo6E6yDTaFmROAt4RmVEpkBnfhi2nFj7nxS6Vw3mlNWzmnKtuFjqQMte7Dc4P_MUlGOCR6QkA9vzn2D0-LW-MMMTc1Q-RB_NASpUmQeWS31INqfYmo9e0FPIGUQGR3gnhlaof8O4kS2b5N88jatHekqAbnEp0w88315r0YQKne" />
              </div>
              <h5 className="font-bold text-lg">Hand-Carved Pick Set</h5>
              <p className="text-[#FF3C38] font-black mt-2 text-xl">$45</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;