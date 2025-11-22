import { useState } from 'react';
import { useGame } from '../context/GameContext';
import Modal from '../components/Modal';
import type { Monster } from '../types';
import { Plus, X, Sparkles, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import MonsterMini3D from '../components/MonsterMini3D';

export default function Lab() {
    const { allMonsters, fuseMonsters } = useGame();
    const [slotA, setSlotA] = useState<Monster | null>(null);
    const [slotB, setSlotB] = useState<Monster | null>(null);
    const [showSelectModal, setShowSelectModal] = useState<'A' | 'B' | null>(null);
    const [fusionResult, setFusionResult] = useState<{ success: boolean; monster: Monster | null } | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const unlockedMonsters = allMonsters.filter(m => m.isUnlocked);

    const handleSelectMonster = (monster: Monster) => {
        if (showSelectModal === 'A') {
            setSlotA(monster);
        } else if (showSelectModal === 'B') {
            setSlotB(monster);
        }
        setShowSelectModal(null);
    };

    const handleFuse = () => {
        if (!slotA || !slotB) return;

        setIsAnimating(true);

        setTimeout(() => {
            const result = fuseMonsters(slotA.id, slotB.id);
            setFusionResult({ success: result.success, monster: result.result });
            setIsAnimating(false);
        }, 2000);
    };

    const handleReset = () => {
        setSlotA(null);
        setSlotB(null);
        setFusionResult(null);
        setIsAnimating(false);
    };

    return (
        <div className="py-6 min-h-[calc(100vh-200px)]">
            {/* Header */}
            <div className="glass-dark rounded-2xl p-6 mb-8 border border-white/20">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 animate-neon-pulse">
                    Fusion Lab
                </h1>
                <p className="text-lg text-white/80 font-semibold">
                    Combine two monsters to create something new!
                </p>
            </div>

            {/* Lab Interface */}
            <div className="max-w-4xl mx-auto">
                {/* Fusion Slots */}
                <div className="grid md:grid-cols-3 gap-6 items-center mb-8">
                    {/* Slot A */}
                    <div>
                        <label className="block text-sm font-bold text-white/80 mb-2 uppercase">
                            Monster A
                        </label>
                        <button
                            onClick={() => setShowSelectModal('A')}
                            disabled={isAnimating}
                            className={`
                relative w-full aspect-square rounded-xl border-4 border-dashed
                flex flex-col items-center justify-center gap-3
                transition-all hover:scale-105
                ${slotA ? 'border-red-500 glass-dark' : 'border-white/30 glass-dark hover:border-white/50'}
                ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            {slotA ? (
                                <>
                                    <div className="w-full h-3/4">
                                        <Canvas camera={{ position: [0, 0, 3], fov: 50 }} className="w-full h-full">
                                            <ambientLight intensity={0.5} />
                                            <directionalLight position={[5, 5, 5]} intensity={1} />
                                            <MonsterMini3D color={slotA.color} type={slotA.type} scale={1.2} />
                                            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                                            <Environment preset="city" />
                                        </Canvas>
                                    </div>
                                    <span className="font-bold text-white">{slotA.name}</span>
                                    <X className="absolute top-2 right-2 w-5 h-5 text-red-400 hover:text-red-600" />
                                </>
                            ) : (
                                <>
                                    <Plus className="w-12 h-12 text-white/40" />
                                    <span className="text-white/60">Select Monster</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Plus Icon */}
                    <div className="flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center glow-red">
                            <Plus className="w-8 h-8 text-white" strokeWidth={3} />
                        </div>
                    </div>

                    {/* Slot B */}
                    <div>
                        <label className="block text-sm font-bold text-white/80 mb-2 uppercase">
                            Monster B
                        </label>
                        <button
                            onClick={() => setShowSelectModal('B')}
                            disabled={isAnimating}
                            className={`
                relative w-full aspect-square rounded-xl border-4 border-dashed
                flex flex-col items-center justify-center gap-3
                transition-all hover:scale-105
                ${slotB ? 'border-red-500 glass-dark' : 'border-white/30 glass-dark hover:border-white/50'}
                ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            {slotB ? (
                                <>
                                    <div className="w-full h-3/4">
                                        <Canvas camera={{ position: [0, 0, 3], fov: 50 }} className="w-full h-full">
                                            <ambientLight intensity={0.5} />
                                            <directionalLight position={[5, 5, 5]} intensity={1} />
                                            <MonsterMini3D color={slotB.color} type={slotB.type} scale={1.2} />
                                            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                                            <Environment preset="city" />
                                        </Canvas>
                                    </div>
                                    <span className="font-bold text-white">{slotB.name}</span>
                                    <X className="absolute top-2 right-2 w-5 h-5 text-red-400 hover:text-red-600" />
                                </>
                            ) : (
                                <>
                                    <Plus className="w-12 h-12 text-white/40" />
                                    <span className="text-white/60">Select Monster</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Fusion Button */}
                <div className="text-center mb-8">
                    <motion.button
                        whileHover={{ scale: slotA && slotB && !isAnimating ? 1.05 : 1 }}
                        whileTap={{ scale: slotA && slotB && !isAnimating ? 0.95 : 1 }}
                        onClick={handleFuse}
                        disabled={!slotA || !slotB || isAnimating}
                        className={`
              px-12 py-4 rounded-xl font-black text-xl uppercase
              flex items-center gap-3 mx-auto
              transition-all shadow-lg
              ${slotA && slotB && !isAnimating
                                ? 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white cursor-pointer glow-red'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }
              ${isAnimating ? 'animate-pulse-scale' : ''}
            `}
                    >
                        <Flame className="w-6 h-6" />
                        {isAnimating ? 'Fusing...' : 'Fuse Monsters'}
                    </motion.button>
                </div>

                {/* Fusion Result */}
                <AnimatePresence>
                    {fusionResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`
                p-8 rounded-2xl text-center border-4
                ${fusionResult.success
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400'
                                    : 'bg-gradient-to-br from-gray-600 to-gray-700 animate-shake border-red-400'
                                }
              `}
                        >
                            {fusionResult.success && fusionResult.monster ? (
                                <>
                                    <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4 animate-spin-slow glow-yellow" />
                                    <h2 className="text-3xl font-black text-white mb-4">
                                        Fusion Successful!
                                    </h2>
                                    <div className="bg-white/20 backdrop-blur rounded-xl p-6 mb-4">
                                        <div className="w-40 h-40 mx-auto mb-4">
                                            <Canvas camera={{ position: [0, 0, 3], fov: 50 }} className="w-full h-full">
                                                <ambientLight intensity={0.5} />
                                                <directionalLight position={[5, 5, 5]} intensity={1.5} />
                                                <MonsterMini3D color={fusionResult.monster.color} type={fusionResult.monster.type} scale={1.5} />
                                                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={3} />
                                                <Environment preset="sunset" />
                                            </Canvas>
                                        </div>
                                        <h3 className="text-2xl font-black text-white">
                                            {fusionResult.monster.name}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                                    >
                                        Fuse Again
                                    </button>
                                </>
                            ) : (
                                <>
                                    <X className="w-16 h-16 text-red-300 mx-auto mb-4" />
                                    <h2 className="text-3xl font-black text-white mb-4">
                                        Fusion Failed
                                    </h2>
                                    <p className="text-white/80 mb-4 text-lg">
                                        These monsters can't be fused together.
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="bg-white text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Monster Selection Modal */}
            <Modal open={showSelectModal !== null} onClose={() => setShowSelectModal(null)}>
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                    Select a Monster for Slot {showSelectModal}
                </h2>

                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {unlockedMonsters.map((monster) => (
                        <button
                            key={monster.id}
                            onClick={() => handleSelectMonster(monster)}
                            className="p-4 rounded-lg border-2 border-gray-200 hover:border-red-600 transition-all hover:bg-red-50 hover:scale-105"
                        >
                            <div className="w-20 h-20 mx-auto mb-2">
                                <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} className="w-full h-full">
                                    <ambientLight intensity={0.6} />
                                    <directionalLight position={[3, 3, 3]} intensity={1} />
                                    <MonsterMini3D color={monster.color} type={monster.type} scale={0.7} />
                                    <OrbitControls enableZoom={false} enablePan={false} autoRotate />
                                    <Environment preset="city" />
                                </Canvas>
                            </div>
                            <p className="font-bold text-sm">{monster.name}</p>
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
}
