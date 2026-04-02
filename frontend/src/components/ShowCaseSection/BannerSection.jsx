import React from 'react'
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Buttons';

const BannerSection = () => {
  return (
    <div>
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Electric guitar"
            className="w-full h-full object-cover grayscale brightness-50"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvDK188L7NpGW7JR_fgknO9KeWaX1uYr2Hj5tJRe9y97a6WgbeRfb8kKbmafUXticmVXHOtyA24o2Qb57UVEoEB01lTi2R7DZxvn_mSe6dpwTjHx_5wgTb2qv3XouhnBs5nz6_9SGZS9UwW2twEMVASIactR-FNrMmk5zNdDaG_JWdxUbbVG8Xf6b1kOO2q1PmrUuRKkrYZK-dKDas_QQiCBIsc4UxkOg5pp7I3D7DVT3Y-c3XednP4yifDz_RfYFkr4TYfNcAv9np"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-headline font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter mb-6 leading-none text-white"
          >
            Feel the <span className="text-gradient">Sound.</span><br />
            Own the <span className="text-gradient">Rhythm.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col md:flex-row gap-6 justify-center mt-12"
          >
            <Link to="/shop" className=" text-center">
              <Button text="Shop Now" />
            </Link>
            <Link to="/shop" className="bg-white/10 hover:scale-95 py-3 px-6 text-white   rounded-xl font-headline font-bold text-lg transition-all duration-300 active:scale-95 text-center">
              Explore
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default BannerSection