"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { Suspense } from "react";

function AnimatedSphere() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 2, 1]} intensity={1.2} />
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.5}>
        <Sphere args={[1, 100, 200]} scale={2.4} position={[2.5, 0, -1]}>
          <MeshDistortMaterial
            color="#6366f1"
            attach="material"
            distort={0.45}
            speed={1.8}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={2}>
        <Sphere args={[1, 64, 128]} scale={0.8} position={[-3, 1.5, -2]}>
          <MeshDistortMaterial
            color="#a855f7"
            attach="material"
            distort={0.6}
            speed={2.5}
            roughness={0.3}
            metalness={0.6}
          />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
        <Sphere args={[1, 64, 128]} scale={0.5} position={[4, -2, -3]}>
          <MeshDistortMaterial
            color="#06b6d4"
            attach="material"
            distort={0.3}
            speed={3}
            roughness={0.4}
            metalness={0.5}
          />
        </Sphere>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const } },
};

export default function Hero() {
  return (
    <div className="relative w-full h-[90vh] bg-slate-950 text-white flex items-center overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-transparent z-[1]" />
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <AnimatedSphere />
          </Canvas>
        </Suspense>
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl pl-8 md:pl-16"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            🚀 Next-Gen Learning Platform
          </span>
        </motion.div>
        
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
        >
          Transform Your{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Career
          </span>{" "}
          with Kladriva
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed"
        >
          Outcome-driven learning, real-world projects, human mentorship, and a job marketplace — all in one dynamic platform.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98]">
            Start Learning Free
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-full font-bold transition-all backdrop-blur-md border border-white/10 hover:border-white/20">
            Find Mentors
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-10 flex items-center gap-6 text-sm text-slate-400">
          <div className="flex -space-x-2">
            {["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500"].map((color, i) => (
              <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-slate-950`} />
            ))}
          </div>
          <span>Join <strong className="text-white">50,000+</strong> professionals already transforming their careers</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
