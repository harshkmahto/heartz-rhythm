import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';


gsap.registerPlugin(ScrollTrigger);


const allPngs = import.meta.glob('../../assets/**/*.png', { eager: true });

const frameUrls = Object.keys(allPngs)
  .filter(key => key.includes('Guitar b roll (1)_000/Guitar b roll (1)_'))
  .sort()
  .map(key => allPngs[key].default);

const Banner = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const ctaRef = useRef(null);
  const taglineRef = useRef(null);
  
  const [loadingText, setLoadingText] = useState('');
  const playhead = useRef({ frame: 0 });
  const navigate = useNavigate();


  const shop = () => {
    navigate('/shop');
  };


  useEffect(() => {
    if (frameUrls.length === 0) {
      console.error("No frames found. Check the glob pattern and asset paths.");
      setLoadingText('Error: Sequence not found.');
      return;
    }

    setLoadingText('Loading sequence... 0%');

  
    const loadedImages = [];
    let loadedCount = 0;

    const drawFirstFrame = (img) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      const scale = Math.max(window.innerWidth / img.width, window.innerHeight / img.height);
      const x = (window.innerWidth / 2) - (img.width / 2) * scale;
      const y = (window.innerHeight / 2) - (img.height / 2) * scale;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    frameUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      
      img.onload = () => {
        loadedCount++;
        loadedImages[index] = img; 

       
        if (index === 0) {
          drawFirstFrame(img);
        }

        if (loadedCount === frameUrls.length) {
          setLoadingText('');
          initAnimation(loadedImages);
        } else {
          setLoadingText(`Loading sequence... ${Math.round((loadedCount / frameUrls.length) * 100)}%`);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load frame: ${url}`);
        loadedCount++;
        if (loadedCount === frameUrls.length) {
          setLoadingText('');
          initAnimation(loadedImages);
        }
      };
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const initAnimation = (images) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const img = images[playhead.current.frame];
      if (!img) return; 
      

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      
      const scale = Math.max(window.innerWidth / img.width, window.innerHeight / img.height);
      const x = (window.innerWidth / 2) - (img.width / 2) * scale;
      const y = (window.innerHeight / 2) - (img.height / 2) * scale;
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    render();
    window.addEventListener('resize', render);


    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%', 
        scrub: 1,
        pin: true,
        onUpdate: render,
      }
    });

    // 1. Image sequence animation
    tl.to(playhead.current, {
      frame: images.length - 1,
      snap: 'frame',
      ease: 'none',
      duration: 1
    }, 0);


   

  
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.2
    }, 0.2);


    tl.to(taglineRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.2
    }, 0.6);

   
    tl.to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.2
    }, 0.8);

    return () => window.removeEventListener('resize', render);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#020202] overflow-hidden text-white">
   
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none" />

  
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{ width: '100vw', height: '100vh' }}
      />

     
      {loadingText && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <p className="text-[#D4AF37] font-light tracking-widest animate-pulse">
            {loadingText}
          </p>
        </div>
      )}

      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        
       
        
        {/* Tagline */}
        <p 
          ref={taglineRef}
          className="absolute mt-8 text-lg md:text-2xl font-light tracking-[0.3em] text-[#D4AF37] opacity-0 translate-y-10 text-center px-4"
        >
          PRECISION ENGINEERED. SOULFULLY CRAFTED.
        </p>

        {/* CTA Button */}
        <div 
          ref={ctaRef}

          className="absolute bottom-24 opacity-0 translate-y-10 pointer-events-auto"
        >
          <button 
            onClick={shop}
            className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white uppercase tracking-[0.3em] text-xs hover:bg-red-600  hover:scale-105 hover:rounded-xl cursor-pointer transition-all duration-500 ease-out">
            Explore the Collection
          </button>
        </div>
        
      </div>
      
    
    </div>
  );
};

export default Banner;
