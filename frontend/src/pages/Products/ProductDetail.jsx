import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingBag, Zap, Hand, Wrench, Mountain, ArrowRight, CheckCircle2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-main)] w-full">
      <main className="pt-10 md:pt-20 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Product Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          {/* Gallery Block */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-2 flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
              <div className="min-w-[80px] aspect-square bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-[#FF3C38] transition-all duration-300">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsM_yWgDtkQcflsjHqyMrvoYiprCTR-3UQ2Gv3Fv9AvROylzvMbO8Qyi--MLczLU15DqPb6GxYYjlZUkAvKjp7qiWYYsm7aIAtncXttosBvRjYQWi6SzaygxSi3UEkdviyBI3raxYGJlVP4n8saGXwHkiuXpVd1zCx5cSbPA6YiFl7mB_euoJerHPDKibmLUPteXQf8r-hVQQTbSg3u0QMTvRWXgE-CCxEMdPckBQwmJ5f7rJo7u_rz9kSGGFZCATJJMTOdsVKDGwW" alt="Headstock" />
              </div>
              <div className="min-w-[80px] aspect-square bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-[#FF3C38] transition-all duration-300">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz2xvaTeUi6_sRl-izgxqwd70SFR_FK6rnBgR9IyGfLURPVIsRkdoJddDxsgQ_wnyZaSMMl8aBTmOblfHI5UC_3NavBrg_a-zJBYUxm0TdfYqRGjAgcm-xWLGJgX6dwC7z1SRpjK0z1QA5L1M1HWkyLRMQUQRbJwb4VeNWlaQQBtkUVthGp76zdcKbB00JmonWEpqNo0NP27sY2RiocryL5SgG5x2jgv_U6a1cVWet20Rt_y8osZQIBn4a6PGE8cLMZQscooYbEhvg" alt="Pickups" />
              </div>
              <div className="min-w-[80px] aspect-square bg-[var(--color-surface)] border border-[var(--color-border-main)] rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-[#FF3C38] transition-all duration-300">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9BeIfnB7tnLoQH_ngugC9AQ2IVhh1iqzzCdXYCQ-tUCAxdCWJwjIVl-vnQuBFwuMOKQJ2sE5ZtB_LPUJ0soWsUf16SfPm11THWKxOmGu41Y5XfSl_UCFUA8XWkOJewupo4f9CmMbMqHIGD1J5XGAlNGuBZw0ZXI0lrQV173Ejrm3SHwYLul_ODSLmeD3ArX23sLgNYv95Mjjq8QbVH2wd4aS2ktlLTxiD0LbW688KoZux2GHaR0Dlk66pnGd04G5h9zcgAul2tSGv" alt="Fretboard" />
              </div>
            </div>
            <div className="md:col-span-10">
              <div className="aspect-[4/5] bg-gradient-to-b from-[#f2f2f2] to-[#dfdfdf] dark:from-[#202020] dark:to-[#121212] rounded-2xl border border-[var(--color-border-main)] overflow-hidden relative group flex items-center justify-center p-8">
                <img className="w-[85%] h-[90%] object-contain transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSM__RQGuaFJP9vbILKuBheSAQyU-D8n-_Ym-maOxx6boouWJajz-GeF_aR5LzfoEgoQxVBdcDsY0JFo6ogXqjTvRXlzvEc0TrvZLASMhPDfLCwHek4tIG62dSwdyeYmtgWehum4Hgd2LJe2iHxGDBoaPh547u4c3VdBn0zMNe4a7mfYS5WNBKh9UeDc6kXzRGax8T0qeZ6mX_7VgzMjtyjE8pRspHO1hnCppz5WoxGSct0Qrhtrs9rxIVD9d4LjRdaT4yIIUsecRK" alt="Main Product" />
              </div>
            </div>
          </div>

          {/* Product Info Block */}
          <div className="lg:col-span-5 flex flex-col gap-8 mt-10 lg:mt-0">
            <div>
              <span className="text-[#FF3C38] font-headline font-bold text-sm uppercase tracking-widest mb-4 block">Signature Series</span>
              <h1 className="text-5xl md:text-6xl font-headline font-black text-[var(--color-text-main)] tracking-tighter leading-none mb-4">PULSE REVENANT v2</h1>
              <div className="flex items-center gap-4">
                <div className="flex text-[#FF7A00]">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} className="text-[#FF7A00]" />
                </div>
                <span className="text-[var(--color-text-muted)] font-label text-sm uppercase tracking-wider">4.8 (124 Reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-headline font-bold text-[var(--color-text-main)] tracking-tighter drop-shadow-[0_0_15px_rgba(255,60,56,0.3)]">$3,499</span>
              <span className="text-[var(--color-text-muted)] line-through text-xl">$4,200</span>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border-main)] p-6 rounded-2xl shadow-inner">
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                Engineered for the stage, the Revenant v2 features an ultra-resonant roasted maple neck and active pulse-coil pickups. This is the weapon of choice for those who live for the low-end growl and crystalline highs.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#FF3C38]" />
                  <span className="text-[var(--color-text-main)] text-sm">Limited Edition Ebony Finish</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#FF3C38]" />
                  <span className="text-[var(--color-text-main)] text-sm">Custom Heart-Rhythm Flight Case Included</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button className="w-full h-16 bg-gradient-to-r from-[#FF3C38] to-[#FF7A00] text-white font-headline font-black text-lg rounded-xl shadow-[0_0_40px_rgba(255,60,56,0.25)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group border-none">
                ADD TO STAGE
                <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-full h-16 bg-[var(--color-surface)] backdrop-blur-md text-[var(--color-text-main)] font-headline font-bold text-lg rounded-xl border border-[var(--color-border-main)] hover:bg-[var(--color-border-main)] transition-all duration-300">
                REQUEST CUSTOM SHOP MODS
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Bento Section */}
        <section className="mt-32">
          <h2 className="text-3xl font-headline font-bold text-[var(--color-text-main)] mb-12 tracking-tight">Technical Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-main)] p-8 rounded-2xl flex flex-col justify-between h-48 hover:shadow-[0_0_20px_rgba(255,60,56,0.1)] hover:border-[#FF3C38]/50 transition-all duration-300 group">
              <Zap size={32} className="text-[#FF3C38] group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-[var(--color-text-muted)] font-label text-xs uppercase tracking-widest mb-1">Pickups</h3>
                <p className="text-[var(--color-text-main)] font-bold text-lg">Active H-Rhythm X1</p>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-main)] p-8 rounded-2xl flex flex-col justify-between h-48 hover:shadow-[0_0_20px_rgba(255,60,56,0.1)] hover:border-[#FF3C38]/50 transition-all duration-300 group">
              <Hand size={32} className="text-[#FF3C38] group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-[var(--color-text-muted)] font-label text-xs uppercase tracking-widest mb-1">Fretboard</h3>
                <p className="text-[var(--color-text-main)] font-bold text-lg">Macassar Ebony</p>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-main)] p-8 rounded-2xl flex flex-col justify-between h-48 hover:shadow-[0_0_20px_rgba(255,60,56,0.1)] hover:border-[#FF3C38]/50 transition-all duration-300 group">
              <Wrench size={32} className="text-[#FF3C38] group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-[var(--color-text-muted)] font-label text-xs uppercase tracking-widest mb-1">Scale Length</h3>
                <p className="text-[var(--color-text-main)] font-bold text-lg">25.5" Modern Pro</p>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border-main)] p-8 rounded-2xl flex flex-col justify-between h-48 hover:shadow-[0_0_20px_rgba(255,60,56,0.1)] hover:border-[#FF3C38]/50 transition-all duration-300 group">
              <Mountain size={32} className="text-[#FF3C38] group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-[var(--color-text-muted)] font-label text-xs uppercase tracking-widest mb-1">Body Wood</h3>
                <p className="text-[var(--color-text-main)] font-bold text-lg">Swamp Ash Solid</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-32 glass-card p-8 md:p-12 rounded-3xl border border-[var(--color-border-main)] relative overflow-hidden bg-[var(--color-surface)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3C38]/5 blur-[120px]"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-black text-[var(--color-text-main)] mb-2">PULSE REVIEWS</h2>
              <p className="text-[var(--color-text-muted)]">Real experiences from touring artists and collectors.</p>
            </div>
            <button className="text-[#FF3C38] font-bold uppercase text-sm tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              Write a Review <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Review 1 */}
            <div className="bg-[var(--color-bg)] border border-[var(--color-border-main)] p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--color-border-main)]">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOcAiVeSxjcTZhHDxGh1Pi-RBod5CdomuqPV7D9IO7DlE7OaR94seFsFs-L-R9yzgOqmjdHuD0sBgUHHudevDHlJSjcGKseUA7wdvhssB3dpcs4yiDyE2iM6VBW_wRUK5Gal2qZui0ARqTYQ-CzDzeIgos08t_7hiRakeXVmvBQs70j0OruMEZeG9P3BLHQF7qadsbkcy7D5UFhGrR7c-U97pO1wRloI71-q-rFo3S_PwHHItZw6s6geghA-cp9eb-eGqcMdaqU9Zr" alt="Reviewer" />
                </div>
                <div>
                  <p className="text-[var(--color-text-main)] font-bold">Kaelen Vance</p>
                  <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Verified Artist</p>
                </div>
              </div>
              <div className="flex text-[#FF7A00] mb-4">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-[var(--color-text-main)] italic leading-relaxed font-light">
                "The Revenant v2 cuts through the mix like nothing else I've played. The sustain on the low strings is haunting. It's not just a guitar; it's an extension of the soul."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-[var(--color-bg)] border border-[var(--color-border-main)] p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--color-border-main)]">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvqW4E03UBWBYcCeHyxbmkajPrF_8ouY7d8wBzE-q8ztBJ2BZzkUdII0c1Z7Lz9RUeU5yzYdymIebfqiYuuhvYIv2v5qmlmB-rR8ObTxvmquq-IfzTagz-qweVy_cbwDkpQwh74Ewh0wfz-NE-dHCKwqd-Pfka6GTGktKnpcYKpait2JJC99D0lelcpDhCGsfH1mY59ICkpmpMXrPxD2nuzX7lKrfUBQNzu7x30FGw6ZzDySyM-hTkKwN3uREM7WjxeTM6cd_Et5Cn" alt="Reviewer" />
                </div>
                <div>
                  <p className="text-[var(--color-text-main)] font-bold">Sarah Vox</p>
                  <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Sound Designer</p>
                </div>
              </div>
              <div className="flex text-[#FF7A00] mb-4">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-[var(--color-text-main)] italic leading-relaxed font-light">
                "Build quality is flawless. The neck profile is incredibly fast. I've used it for every session this month. Simply the most versatile high-gain machine I own."
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ProductDetail;
