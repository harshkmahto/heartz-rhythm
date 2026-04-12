// components/ShowCaseSection/BannerWithScrollGuitar.jsx
import React, { useRef, useEffect, useState, Suspense } from 'react'; // Added Suspense here
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Music, Guitar, Zap, Wind, ArrowRight } from 'lucide-react';
import Button from './Buttons';
import guitarImage from '../../assets/guitar.png';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// 3D Guitar Model Component
const AnimatedGuitarModel = ({ scrollProgress, color, isVisible }) => {
  const guitarRef = useRef();
  const { scene } = useGLTF('/model/guitar-2075.glb');
  
  // Clone scene to avoid mutations
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  
  // Apply color to the model
  useEffect(() => {
    if (clonedScene) {
      clonedScene.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.color.set(color);
            });
          } else {
            child.material.color.set(color);
          }
        }
      });
    }
  }, [clonedScene, color]);
  
  useFrame(() => {
    if (guitarRef.current) {
      // Smooth rotation based on scroll
      guitarRef.current.rotation.y = scrollProgress * Math.PI * 1.5;
      guitarRef.current.rotation.x = scrollProgress * Math.PI * 0.3;
      
      // Position based on scroll
      guitarRef.current.position.y = -2 + (scrollProgress * 3);
      
      // Scale based on scroll
      const scale = 2.5 + (scrollProgress * 1.5);
      guitarRef.current.scale.set(scale, scale, scale);
      
      // Opacity based on scroll
      if (guitarRef.current.material) {
        guitarRef.current.material.opacity = 0.5 + (scrollProgress * 0.5);
      }
    }
  });
  
  if (!isVisible) return null;
  
  return (
    <group ref={guitarRef}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Main Component
const BannerWithScrollGuitar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [guitarColor, setGuitarColor] = useState('#f59e0b');
  const [show3DGuitar, setShow3DGuitar] = useState(true);
  const [modelError, setModelError] = useState(false);
  const containerRef = useRef();
  const bannerSectionRef = useRef();
  const musicSectionRef = useRef();
  const canvasContainerRef = useRef();

  const categories = [
    {
      id: 1,
      name: 'Guitar',
      path: '/shop/category/guitar',
      icon: Guitar,
      image: guitarImage,
      description: 'Acoustic & Classical',
      stats: '24 Models Available'
    },
    {
      id: 2,
      name: 'Electric',
      path: '/shop/category/electric',
      icon: Zap,
      image: null,
      description: 'Electric & Bass',
      stats: '18 Models Available'
    },
    {
      id: 3,
      name: 'Ukulele',
      path: '/shop/category/ukelele',
      icon: Wind,
      image: guitarImage,
      description: 'Hawaiian Vibes',
      stats: '12 Models Available'
    }
  ];

  const primaryColor = {
    gradient: 'from-red-500 to-rose-600',
    light: 'from-red-50 to-rose-50',
    dark: 'from-red-950/40 to-rose-950/40',
  };

  const colorClick = (color) => {
    setGuitarColor(color);
  };

  useEffect(() => {
    // Create scroll trigger for the 3D guitar
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        // Calculate progress based on scroll position between banner and music section
        const bannerRect = bannerSectionRef.current?.getBoundingClientRect();
        const musicRect = musicSectionRef.current?.getBoundingClientRect();
        
        if (bannerRect && musicRect) {
          const scrollY = window.scrollY;
          const bannerBottom = bannerRect.top + window.scrollY + bannerRect.height;
          const musicTop = musicRect.top + window.scrollY;
          const range = musicTop - bannerBottom;
          const currentScroll = scrollY - bannerBottom;
          
          let progress = currentScroll / range;
          progress = Math.min(Math.max(progress, 0), 1);
          setScrollProgress(progress);
          
          // Hide 3D guitar when we're past the music section
          setShow3DGuitar(progress <= 1);
        }
      },
    });
    
    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      
      {/* Floating 3D Canvas */}
      <div 
        ref={canvasContainerRef}
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-50"
        style={{
          opacity: scrollProgress > 0 ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ preserveDrawingBuffer: true, alpha: true }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-3, 2, 4]} intensity={0.8} color="#ffaa44" />
          <pointLight position={[2, 1, 3]} intensity={0.6} />
          <pointLight position={[-2, -1, 2]} intensity={0.5} color="#8866ff" />
          <pointLight position={[0, 3, 2]} intensity={0.4} color="#ff66aa" />
          <pointLight position={[0, -1, 3]} intensity={0.5} color="#ff8844" />
          
          {!modelError ? (
            <Suspense fallback={null}>
              <AnimatedGuitarModel 
                scrollProgress={scrollProgress}
                color={guitarColor}
                isVisible={show3DGuitar}
              />
            </Suspense>
          ) : null}
        </Canvas>
      </div>

      {/* ========== BANNER SECTION ========== */}
      <section ref={bannerSectionRef} className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative z-10">
        <div className='relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0 overflow-hidden min-h-screen'>
          
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" 
              style={{ background: `${guitarColor}15` }}></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" 
              style={{ background: `${guitarColor}15` }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl" 
              style={{ background: `${guitarColor}20` }}></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto">
            
            {/* HeartzRhythm Logo */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-left mb-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-orange-500 via-rose-600 to-red-500 bg-clip-text text-transparent">
                  HEARTZ RHYTHM
                </span>
              </h1>
              <div className="w-20 h-0.5 bg-gradient-to-r from-red-400 to-rose-500 mt-2 rounded-full"></div>
            </motion.div>
            
            {/* MUSIC Text */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 mb-8 sm:mb-12 mt-8">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 bg-clip-text text-transparent"
              >
                M
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 bg-clip-text text-transparent"
              >
                U
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 bg-clip-text text-transparent"
              >
                S
              </motion.span>
              
              {/* Space for 3D guitar (will be overlayed) */}
              <div className="relative w-48 h-56 sm:w-52 sm:h-64 md:w-60 md:h-72 lg:w-64 lg:h-90 xl:w-72 xl:h-92"></div>
              
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 bg-clip-text text-transparent"
              >
                C
              </motion.span>
            </div>

            {/* Decorative separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mb-8"
            />

            {/* Main Content */}
            <div className="w-full flex justify-between items-start px-12 sm:px-16 lg:px-24">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-left max-w-2xl"
              >
                <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-rose-500 mb-4 rounded-full"></div>
                
                <h2 className="uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-3">
                  Sound of{' '}
                  <span className="uppercase bg-gradient-to-r from-red-400 via-rose-400 to-red-500 bg-clip-text text-transparent">
                    Excellence
                  </span>
                </h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                  className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl"
                >
                  Experience the perfect harmony of innovation and craftsmanship. 
                  Our premium collection brings your musical journey to life with 
                  unparalleled sound quality and stunning design.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 justify-start items-start"
                >
                  <Button text="SHOP NOW" />
                </motion.div>
              </motion.div>

              {/* Color Circles */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.65 }}
                className="flex flex-col gap-5 mt-6 sm:mt-0 sm:ml-2 ml-0"
              >
                <div 
                  onClick={() => colorClick('#f59e0b')} 
                  className="w-6 h-6 bg-amber-500 rounded-full border-2 border-amber-300/50 shadow-lg shadow-amber-200 hover:shadow-amber-500 hover:scale-110 transition-transform duration-300 cursor-pointer"
                ></div>
                <div 
                  onClick={() => colorClick('#f43f5e')} 
                  className="w-6 h-6 bg-rose-500 rounded-full border-2 border-rose-300/50 shadow-lg shadow-red-200 hover:shadow-rose-500 hover:scale-110 transition-transform duration-300 cursor-pointer"
                ></div>
                <div 
                  onClick={() => colorClick('#3b82f6')} 
                  className="w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-300/50 shadow-lg shadow-blue-200 hover:shadow-blue-500 hover:scale-110 transition-transform duration-300 cursor-pointer"
                ></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MUSIC HERO SECTION ========== */}
      <section ref={musicSectionRef} className='min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-black dark:to-neutral-900 text-black dark:text-white py-16 px-4 relative z-10'>
        
        {/* 3D Guitar Landing Zone Indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className={`transition-all duration-500 ${scrollProgress > 0.8 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 blur-2xl animate-pulse"></div>
          </div>
        </div>

        {/* Header */}
        <div className='flex items-center gap-4 mb-16 max-w-7xl mx-auto'>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300 to-transparent dark:via-red-800"></div>
          <div className="text-center relative">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <Music className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mt-4">
              FIND AMAZING CATEGORIES
            </h2>
            <div className="flex justify-center gap-2 mt-3">
              <div className="w-12 h-1 bg-red-500 rounded-full"></div>
              <div className="w-6 h-1 bg-rose-500 rounded-full"></div>
              <div className="w-3 h-1 bg-pink-500 rounded-full"></div>
            </div>
            <p className="text-base text-neutral-600 dark:text-neutral-400 mt-4">
              Choose your instrument and start your musical journey
            </p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300 to-transparent dark:via-red-800"></div>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full mx-auto'>
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={category.path}
              className='group relative block transform transition-all duration-500 hover:scale-105'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${primaryColor.light} dark:${primaryColor.dark} shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 border border-red-100 dark:border-red-900/30`}>
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {category.stats}
                  </div>
                </div>

                <div className='relative p-8 flex flex-col items-center'>
                  <div className='relative w-52 h-52 mb-6 flex items-center justify-center'>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className='w-full h-full object-contain transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl' 
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 rounded-full'>
                        <category.icon className="w-36 h-36 text-red-500 transition-all duration-500 group-hover:scale-110 group-hover:text-red-600" strokeWidth={1.5} />
                      </div>
                    )}
                    
                    <div className={`absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-full`}></div>
                  </div>

                  <div className='text-center w-full space-y-3'>
                    <h3 className={`text-3xl font-black uppercase tracking-wide bg-gradient-to-r ${primaryColor.gradient} bg-clip-text text-transparent`}>
                      {category.name}
                    </h3>
                    
                    <p className='text-base text-neutral-700 dark:text-neutral-300 font-medium'>
                      {category.description}
                    </p>
                    
                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-red-500/50 transform transition-all duration-300 group-hover:gap-3 group-hover:bg-red-600">
                        Shop Now 
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${primaryColor.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full`}></div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-full">
            <span className="text-2xl">🎵</span>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium">
              Every musician starts somewhere. Find your perfect instrument today!
            </p>
            <span className="text-2xl">✨</span>
          </div>
        </div>

        {/* Explore Collection Card */}
        <div className='flex justify-center items-center mt-16'>
          <div className='relative group max-w-2xl w-full'>
            <div className='absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse'></div>
            
            <div className='relative bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 rounded-2xl shadow-2xl overflow-hidden'>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
              
              <div className='p-8 text-center relative z-10'>
                <div className='font-serif font-bold text-2xl md:text-3xl tracking-wide text-white mb-4'>
                  Ready to Start Your Journey?
                </div>
                <p className="text-white/90 text-sm md:text-base mb-6 max-w-md mx-auto">
                  Explore our complete collection of premium instruments and accessories
                </p>
                <Link to='/categories'>
                  <button className='bg-white text-red-600 px-8 py-3 rounded-full font-bold cursor-pointer hover:bg-black hover:text-white active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group'>
                    <span>EXPLORE FULL COLLECTION</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BannerWithScrollGuitar;