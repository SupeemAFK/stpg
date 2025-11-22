import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import MonsterMini3D from '../components/MonsterMini3D';
import useSoundPlayer from '../hooks/useSoundPlayer';

export default function Jam() {
    const { allMonsters } = useGame();
    const { playMonsterSound, stopAllSounds } = useSoundPlayer();
    const unlockedMonsters = allMonsters.filter(m => m.isUnlocked);

    const [activeMonsters, setActiveMonsters] = useState<Set<string>>(new Set());
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleMonster = (monsterId: string) => {
        setActiveMonsters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(monsterId)) {
                newSet.delete(monsterId);
            } else {
                newSet.add(monsterId);
            }
            return newSet;
        });
    };

    // Play/stop all active monster sounds
    useEffect(() => {
        if (isPlaying && activeMonsters.size > 0) {
            // Play all active monsters
            activeMonsters.forEach(monsterId => {
                const monster = unlockedMonsters.find(m => m.id === monsterId);
                if (monster) {
                    playMonsterSound(monster.type, true); // true = loop
                }
            });
        } else {
            stopAllSounds();
        }
    }, [isPlaying, activeMonsters]);

    const handlePlayPause = () => {
        if (activeMonsters.size === 0) return;
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        setIsPlaying(false);
        stopAllSounds();
        setActiveMonsters(new Set());
    };

    return (
        <div className="py-6 max-w-7xl mx-auto px-4">
            {/* Header - Centered */}
            <div className="glass-dark rounded-2xl p-6 mb-8 border border-white/20 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 text-center animate-neon-pulse">
                    Jam Studio
                </h1>
                <p className="text-lg text-white/80 font-semibold text-center">
                    Mix your monsters and create epic soundscapes!
                </p>
            </div>

            {/* Controls - Centered */}
            <div className="glass-dark rounded-2xl p-6 mb-8 border border-white/20 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePlayPause}
                        disabled={activeMonsters.size === 0}
                        className={`
              flex items-center gap-3 px-8 py-4 rounded-xl font-black text-lg
              transition-all shadow-lg
              ${activeMonsters.size > 0
                                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white glow-red'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        {isPlaying ? (
                            <>
                                <Square className="w-6 h-6" fill="currentColor" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="w-6 h-6" fill="currentColor" />
                                Play ({activeMonsters.size})
                            </>
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStop}
                        disabled={activeMonsters.size === 0 && !isPlaying}
                        className={`
              flex items-center gap-3 px-8 py-4 rounded-xl font-black text-lg
              transition-all shadow-lg
              ${activeMonsters.size > 0 || isPlaying
                                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white glow-red'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        <Square className="w-6 h-6" />
                        Stop & Clear
                    </motion.button>
                </div>

                {activeMonsters.size > 0 && (
                    <div className="mt-4 text-center">
                        <p className="text-white/80 font-semibold">
                            {activeMonsters.size} monster{activeMonsters.size > 1 ? 's' : ''} selected
                        </p>
                    </div>
                )}
            </div>

            {/* Monster Selection - Centered Grid */}
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-black text-white mb-6 text-center">
                    Select Monsters to Mix
                </h2>

                {unlockedMonsters.length === 0 ? (
                    <div className="glass-dark rounded-2xl p-12 text-center border border-white/20">
                        <p className="text-white/80 text-lg font-semibold">
                            No monsters unlocked yet. Scan to capture some first!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {unlockedMonsters.map((monster) => {
                            const isActive = activeMonsters.has(monster.id);

                            return (
                                <motion.div
                                    key={monster.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleMonster(monster.id)}
                                    className={`
                    relative overflow-hidden rounded-xl cursor-pointer
                    transition-all duration-300 border-4
                    ${isActive
                                            ? 'border-green-500 glow-red shadow-2xl'
                                            : 'border-gray-700 hover:border-gray-500'
                                        }
                    ${isActive ? 'bg-gradient-to-br from-green-900/50 to-green-800/50' : 'glass-dark'}
                  `}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute top-2 right-2 z-20">
                                            {isPlaying ? (
                                                <Volume2 className="w-6 h-6 text-green-400 animate-pulse" />
                                            ) : (
                                                <VolumeX className="w-6 h-6 text-green-400" />
                                            )}
                                        </div>
                                    )}

                                    {/* Type Badge */}
                                    <div
                                        className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold uppercase text-white z-10 shadow-lg"
                                        style={{ backgroundColor: monster.color, boxShadow: `0 0 20px ${monster.color}80` }}
                                    >
                                        {monster.type}
                                    </div>

                                    {/* 3D Model */}
                                    <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                                        <Canvas camera={{ position: [0, 0, 3], fov: 50 }} className="w-full h-full">
                                            <ambientLight intensity={0.5} />
                                            <directionalLight position={[5, 5, 5]} intensity={1} />
                                            <pointLight position={[-5, -5, -3]} intensity={0.3} color={monster.color} />
                                            <MonsterMini3D
                                                color={monster.color}
                                                type={monster.type}
                                                scale={isActive ? 1.2 : 1}
                                            />
                                            <OrbitControls
                                                enableZoom={false}
                                                enablePan={false}
                                                autoRotate
                                                autoRotateSpeed={isActive ? 3 : 1}
                                            />
                                            <Environment preset="city" />
                                        </Canvas>

                                        {/* Pulse overlay when active */}
                                        {isActive && isPlaying && (
                                            <div
                                                className="absolute inset-0 animate-pulse-scale opacity-20"
                                                style={{ background: `radial-gradient(circle, ${monster.color}, transparent)` }}
                                            />
                                        )}
                                    </div>

                                    {/*Monster Info */}
                                    <div className={`p-4 ${isActive ? 'bg-green-900/30' : 'bg-gray-900/50'}`}>
                                        <h3 className="font-black text-lg text-white mb-1">
                                            {monster.name}
                                        </h3>
                                        <p className="text-sm text-white/70 font-semibold">
                                            {isActive ? (isPlaying ? '🔊 Playing' : '✓ Selected') : 'Click to add'}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="glass-dark rounded-2xl p-6 mt-8 border border-white/20 max-w-2xl mx-auto">
                <h3 className="text-xl font-black text-white mb-3 text-center">How to Jam</h3>
                <ul className="text-white/80 space-y-2 text-center">
                    <li className="font-semibold">🎵 Click monsters to add them to your mix</li>
                    <li className="font-semibold">▶️ Press Play to hear all selected monsters together</li>
                    <li className="font-semibold">⏹️ Stop & Clear to reset your mix</li>
                </ul>
            </div>
        </div>
    );
}
