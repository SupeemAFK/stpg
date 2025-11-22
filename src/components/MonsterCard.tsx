import type { Monster } from '../types';
import { Lock, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import MonsterMini3D from './MonsterMini3D';

interface MonsterCardProps {
    monster: Monster;
    onClick?: () => void;
    locked?: boolean;
}

export default function MonsterCard({ monster, onClick, locked }: MonsterCardProps) {
    const isLocked = locked ?? !monster.isUnlocked;

    return (
        <motion.div
            whileHover={!isLocked ? { scale: 1.08, rotateY: 5 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            onClick={!isLocked ? onClick : undefined}
            className={`
        relative overflow-hidden rounded-xl diagonal-cut-br transform-3d
        ${!isLocked ? 'cursor-pointer card-shine holographic' : 'cursor-not-allowed'}
        ${!isLocked ? 'bg-gradient-to-br from-white via-white to-gray-50' : 'bg-gray-300'}
        border-4 transition-all duration-300
        ${!isLocked ? 'border-gray-900 hover:border-red-600 glow-red' : 'border-gray-500'}
        ${!isLocked ? 'shadow-2xl hover:shadow-red-500/50' : 'shadow-lg'}
      `}
        >
            {/* Type Badge */}
            {!isLocked && (
                <div
                    className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold uppercase text-white z-10 shadow-lg animate-bounce-in"
                    style={{ backgroundColor: monster.color, boxShadow: `0 0 20px ${monster.color}80` }}
                >
                    {monster.type}
                </div>
            )}

            {/* Sparkles effect for unlocked cards */}
            {!isLocked && (
                <div className="absolute top-2 left-2 z-10">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                </div>
            )}

            {/* Monster 3D Model or Locked State */}
            <div className={`aspect-square relative flex items-center justify-center overflow-hidden ${!isLocked ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'bg-gray-400'
                }`}>
                {!isLocked ? (
                    <Canvas camera={{ position: [0, 0, 3], fov: 50 }} className="w-full h-full">
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <pointLight position={[-5, -5, -3]} intensity={0.3} />
                        <MonsterMini3D color={monster.color} type={monster.type} />
                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                        <Environment preset="city" />
                    </Canvas>
                ) : (
                    <div className="relative">
                        <div className="w-32 h-32 hexagon bg-gray-500 opacity-40 animate-pulse-scale" />
                        <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-gray-600" />
                    </div>
                )}
            </div>

            {/* Monster Info */}
            <div className={`p-4 ${!isLocked ? 'bg-gradient-to-r from-white to-gray-50' : 'bg-gray-200'}`}>
                <h3 className={`font-black text-lg mb-1 ${!isLocked ? 'text-gray-900' : 'text-gray-500'} ${!isLocked ? 'animate-slide-up' : ''}`}>
                    {!isLocked ? monster.name : '???'}
                </h3>

                {!isLocked && (
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                        <Zap className="w-4 h-4" style={{ color: monster.color }} />
                        <span>Sound Monster</span>
                    </div>
                )}

                {isLocked && (
                    <p className="text-sm text-gray-500 font-semibold">Unknown Signal</p>
                )}
            </div>
        </motion.div>
    );
}
