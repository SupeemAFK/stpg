import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, FlaskConical, Sparkles, Plus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MonsterMini3D from '../components/MonsterMini3D';
import Modal from '../components/Modal';

export default function Lab() {
    const navigate = useNavigate();
    const { allMonsters, fuseMonsters } = useGame();
    const [slot1, setSlot1] = useState<string | null>(null);
    const [slot2, setSlot2] = useState<string | null>(null);
    const [result, setResult] = useState<{ success: boolean; result: any } | null>(null);
    const [showResult, setShowResult] = useState(false);

    const unlockedMonsters = allMonsters.filter(m => m.isUnlocked);
    const monster1 = slot1 ? allMonsters.find(m => m.id === slot1) : null;
    const monster2 = slot2 ? allMonsters.find(m => m.id === slot2) : null;

    const handleFusion = () => {
        if (slot1 && slot2) {
            const fusionResult = fuseMonsters(slot1, slot2);
            setResult(fusionResult);
            setShowResult(true);

            if (fusionResult.success) {
                // Clear slots on success
                setTimeout(() => {
                    setSlot1(null);
                    setSlot2(null);
                }, 2000);
            }
        }
    };

    const handleCloseResult = () => {
        setShowResult(false);
        setResult(null);
    };

    return (
        <div className="h-full bg-purple-50 flex flex-col p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-[0_4px_0_#cbd5e1] border-b-4 border-slate-300 active:shadow-none active:translate-y-1 transition-all"
                >
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">The Lab</h1>
                    <p className="text-slate-500 font-bold">Mix monsters to create new sounds!</p>
                </div>
            </div>

            {/* Fusion Chamber */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Fusion Slots */}
                <div className="flex items-center justify-center gap-4">
                    {/* Slot 1 */}
                    <div className="flex-1 max-w-[200px]">
                        <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-[0_8px_0_#c084fc] p-4 h-48 flex flex-col items-center justify-center">
                            {monster1 ? (
                                <>
                                    <div className="w-full h-24 mb-2">
                                        <Canvas camera={{ position: [0, 0.5, 2], fov: 45 }}>
                                            <ambientLight intensity={0.8} />
                                            <directionalLight position={[2, 2, 2]} intensity={1} />
                                            <MonsterMini3D
                                                color={monster1.color}
                                                type={monster1.type}
                                                scale={0.6}
                                            />
                                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                                        </Canvas>
                                    </div>
                                    <p className="font-black text-slate-800 text-sm">{monster1.name}</p>
                                    <button
                                        onClick={() => setSlot1(null)}
                                        className="mt-1 text-xs text-purple-500 hover:text-purple-700"
                                    >
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <FlaskConical size={40} className="text-purple-300 mb-2 mx-auto" />
                                    <p className="text-sm text-slate-400 font-bold">Select Monster</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Plus Icon */}
                    <div className="flex items-center justify-center">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <Plus size={32} className="text-white" strokeWidth={3} />
                        </div>
                    </div>

                    {/* Slot 2 */}
                    <div className="flex-1 max-w-[200px]">
                        <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-[0_8px_0_#c084fc] p-4 h-48 flex flex-col items-center justify-center">
                            {monster2 ? (
                                <>
                                    <div className="w-full h-24 mb-2">
                                        <Canvas camera={{ position: [0, 0.5, 2], fov: 45 }}>
                                            <ambientLight intensity={0.8} />
                                            <directionalLight position={[2, 2, 2]} intensity={1} />
                                            <MonsterMini3D
                                                color={monster2.color}
                                                type={monster2.type}
                                                scale={0.6}
                                            />
                                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                                        </Canvas>
                                    </div>
                                    <p className="font-black text-slate-800 text-sm">{monster2.name}</p>
                                    <button
                                        onClick={() => setSlot2(null)}
                                        className="mt-1 text-xs text-purple-500 hover:text-purple-700"
                                    >
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <FlaskConical size={40} className="text-purple-300 mb-2 mx-auto" />
                                    <p className="text-sm text-slate-400 font-bold">Select Monster</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fuse Button */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: slot1 && slot2 ? 1.05 : 1 }}
                        whileTap={{ scale: slot1 && slot2 ? 0.95 : 1 }}
                        onClick={handleFusion}
                        disabled={!slot1 || !slot2}
                        className={`
                            px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-3 mx-auto
                            transition-all shadow-[0_6px_0_rgba(0,0,0,0.2)] border-b-4
                            ${slot1 && slot2
                                ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-600 cursor-pointer'
                                : 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed opacity-50'
                            }
                        `}
                    >
                        <Zap className="w-6 h-6" fill="currentColor" />
                        FUSE MONSTERS!
                    </motion.button>
                </div>

                {/* Monster Selection Grid */}
                <div className="flex-1 overflow-y-auto">
                    <h3 className="text-lg font-black text-slate-700 mb-3">Your Monsters:</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {unlockedMonsters.map(monster => (
                            <button
                                key={monster.id}
                                onClick={() => {
                                    if (!slot1) {
                                        setSlot1(monster.id);
                                    } else if (!slot2 && monster.id !== slot1) {
                                        setSlot2(monster.id);
                                    }
                                }}
                                disabled={monster.id === slot1 || monster.id === slot2}
                                className={`
                                    bg-white rounded-xl border-3 p-3 transition-all
                                    ${(monster.id === slot1 || monster.id === slot2)
                                        ? 'opacity-40 cursor-not-allowed border-slate-200'
                                        : 'hover:scale-105 border-purple-200 shadow-md cursor-pointer'
                                    }
                                `}
                            >
                                <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: monster.color + '20' }}>
                                    <div className="text-2xl">{monster.type === 'bass' ? '🥁' : monster.type === 'rhythm' ? '🎵' : '🎹'}</div>
                                </div>
                                <p className="text-xs font-black text-slate-700 truncate">{monster.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            <Modal open={showResult} onClose={handleCloseResult}>
                {result && (
                    <div className="text-center py-8 relative overflow-hidden">
                        {result.success && result.result ? (
                            <>
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", duration: 0.8 }}
                                    className="mb-6"
                                >
                                    <div className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center mb-4" style={{ backgroundColor: result.result.color + '40' }}>
                                        <Sparkles size={64} className="text-yellow-400 fill-yellow-400" />
                                    </div>
                                </motion.div>
                                <h2 className="text-3xl font-black text-slate-800 mb-2">Fusion Success!</h2>
                                <p className="text-xl font-bold text-purple-600 mb-4">You created {result.result.name}!</p>
                                <p className="text-slate-500">A new {result.result.type} monster has been unlocked!</p>
                            </>
                        ) : (
                            <>
                                <div className="text-6xl mb-4">❌</div>
                                <h2 className="text-2xl font-black text-slate-800 mb-2">Fusion Failed</h2>
                                <p className="text-slate-500">These monsters can't be combined. Try a different pair!</p>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
