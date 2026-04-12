import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import Button from './Buttons';
import guitar from '../../assets/guitar.png';
import { FaSpinner } from 'react-icons/fa';
import * as THREE from 'three';
import RoundedText from './RoundedText';


const BannerSection = () => {
  const [modelError, setModelError] = useState(false);
  const [color, setColor] = useState('yellow');

  // Pre-load the model to avoid loading issues
  const GuitarModel = () => {
    const { scene } = useGLTF('/model/guitar-2075.glb');

    
  useEffect(() => {
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      // keep original material, just tint it
      child.material.color.set(color);

      // optional: keep lighting nice
      child.material.needsUpdate = true;
    }
  });
}, [scene, color]);

  return (
    <primitive 
      object={scene} 
      scale={3} 
      position={[0, -2.1, 0]} 
      rotation={[0.1, 0.3, 0]}
    />
  );
};
  const colorClick = (color) => {
    
    setColor(color)
  }

  return (
    <section className=" min-h-screen bg-gradient-to-br from-gray-200 via-rose-50 to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-900 "
    
    >
      <div className='relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0 overflow-hidden min-h-screen'>
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72  rounded-full blur-3xl" 
          style={{
            background:` ${color}15  `
          }} ></div>
          <div className="absolute bottom-20 right-10 w-96 h-96  rounded-full blur-3xl" 
          style={{
            background: `${color}15 `
          }} ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]  rounded-full blur-3xl" 
          style={{
            background: `${color}20 `
          }} ></div>
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
          
          {/* MUSIC with Guitar - Centered */}
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
            
            {/* 3D Guitar - Fixed rendering issue */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative w-48 h-56 sm:w-52 sm:h-64 md:w-60 md:h-72 lg:w-64 lg:h-90 xl:w-72 xl:h-92 flex items-center justify-center"
              key="guitar-container"
            >
              <Canvas 
                camera={{ position: [0, 0, 5.5], fov: 45 }}
                className="w-full h-full"
                style={{ background: 'transparent' }}
                gl={{ preserveDrawingBuffer: true }}
              >
                <ambientLight intensity={5} />
                <directionalLight position={[5, 5, 5]} intensity={1.5} />
                <directionalLight position={[-3, 2, 4]} intensity={0.8} color="#ffaa44" />
                <pointLight position={[2, 1, 3]} intensity={0.6} />
                <pointLight position={[-2, -1, 2]} intensity={0.5} color="#8866ff" />
                <pointLight position={[0, 3, 2]} intensity={0.4} color="#ff66aa" />
                <pointLight position={[0, -1, 3]} intensity={0.5} color="#ff8844" />
                
                <Suspense fallback={
                  <Html center>
                    <div className="text-amber-400 text-lg animate-spin flex items-center mt-8">
                      <FaSpinner className="w-8 h-8 mx-auto mb-2" />
                    </div>
                  </Html>
                }>
                  {!modelError ? <GuitarModel color={color} /> : (
                    <Html center>
                      <div className="w-60 h-60 sm:w-58 sm:h-58 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-transparent">
                        <img src={guitar} alt="guitar" 
                        className='w-full h-full object-cover border-none'/>
                      </div>
                    </Html>
                  )}
                </Suspense>
                
                <OrbitControls 
                  enableZoom={false}
                  enablePan={false}
                  autoRotate={false}
                  enableDamping={true}
                  dampingFactor={0.05}
                  rotateSpeed={0.8}
                />
              </Canvas>
            </motion.div>
            
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 bg-clip-text text-transparent"
            >
              C
            </motion.span>
          </div>

          {/* Decorative separator - centered */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mb-8"
          />

          {/* Main Content - Left Aligned with Color Circles */}
          <div className="w-full flex justify-between items-start px-12 sm:px-16 lg:px-24">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-left max-w-2xl"
            >
              <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-rose-500 mb-4 rounded-full"></div>
              
            
              <RoundedText text="Sound Of"/>
              <span className="uppercase font-bold text-2xl bg-gradient-to-r from-red-400 via-rose-400 to-red-500 bg-clip-text text-transparent ml-2">
                  Excellence
                </span>
              
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

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 justify-start items-start"
              >
                <Button text="SHOP NOW" />
              </motion.div>
            </motion.div>

            {/* Color Circles - Fixed display issue */}
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
  );
};

export default BannerSection;