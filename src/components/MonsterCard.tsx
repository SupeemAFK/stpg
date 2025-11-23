import type { Monster } from '../types';
import { Lock, Sparkles } from 'lucide-react';
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
            whileHover={!isLocked ? { y: -5 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            onClick={!isLocked ? onClick : undefined}
            className={`
                relative w-64 h-80 rounded-[2rem] border-4 overflow-hidden flex flex-col
                ${!isLocked ? 'bg-white border-slate-200 shadow-[0_8px_0_#cbd5e1] cursor-pointer' : 'bg-slate-100 border-slate-300 cursor-not-allowed'}
                transition-colors
            `}
        >
            {/* Card Header / Background Pattern */}
            <div className={`h-2/3 relative ${!isLocked ? 'bg-blue-50' : 'bg-slate-200'} flex items-center justify-center overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-10 rounded-full border-[20px] border-current text-blue-200" />

                {!isLocked ? (
                    <div className="w-full h-full">
                        <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
                            <ambientLight intensity={0.8} />
                            <directionalLight position={[5, 5, 5]} intensity={1.2} />
                            <MonsterMini3D color={monster.color} type={monster.type} />
                            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                            <Environment preset="studio" />
                        </Canvas>
                    </div>
                ) : (
                    <Lock className="w-16 h-16 text-slate-400" strokeWidth={2.5} />
                )}

                {/* Type Badge */}
                {!isLocked && (
                    <div
                        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black text-white shadow-sm uppercase tracking-wider"
                        style={{ backgroundColor: monster.color }}
                    >
                        {monster.type}
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className="flex-1 p-4 flex flex-col justify-center items-center text-center bg-white relative z-10">
                <h3 className={`font-black text-2xl ${!isLocked ? 'text-slate-800' : 'text-slate-400'}`}>
                    {!isLocked ? monster.name : '???'}
                </h3>

                {!isLocked && (
                    <div className="flex items-center gap-1 mt-1">
                        <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sound Monster</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
