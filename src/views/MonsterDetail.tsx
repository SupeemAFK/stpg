import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import useSoundPlayer from '../hooks/useSoundPlayer';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import MonsterMini3D from '../components/MonsterMini3D';
import { Volume2, Play, ArrowLeft, Zap, Heart, Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MonsterDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { allMonsters } = useGame();
    const { playMonsterSound, isPlaying } = useSoundPlayer();

    const monster = allMonsters.find(m => m.id === id);

    if (!monster) {
        return <div className="p-8 text-center text-2xl font-bold text-slate-500">Monster not found!</div>;
    }

    const handlePlaySound = () => {
        playMonsterSound(monster, {
            pitchShift: 0,
            speed: 1,
            waveform: 'sine'
        });
    };

    const stats = [
        { label: 'HP', value: monster.stats.hp, max: 255, color: 'bg-red-500', icon: Heart },
        { label: 'ATK', value: monster.stats.attack, max: 255, color: 'bg-orange-500', icon: Zap },
        { label: 'DEF', value: monster.stats.defense, max: 255, color: 'bg-blue-500', icon: Shield },
        { label: 'SPD', value: monster.stats.speed, max: 255, color: 'bg-green-500', icon: Activity },
    ];

    return (
        <div className="h-full flex flex-col p-4 gap-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="w-12 h-12 bg-white rounded-xl border-4 border-slate-200 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                    <ArrowLeft size={24} className="text-slate-700" strokeWidth={3} />
                </button>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">{monster.name}</h1>
                <div className="px-3 py-1 bg-slate-200 rounded-lg font-mono font-bold text-slate-600">
                    #{monster.id}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                {/* Left: 3D Viewer */}
                <div className="relative bg-gradient-to-b from-sky-100 to-white rounded-3xl border-4 border-white shadow-inner overflow-hidden flex flex-col">
                    <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/80 backdrop-blur rounded-full font-black text-slate-700 shadow-sm border-2 border-white">
                        TYPE: {monster.type.toUpperCase()}
                    </div>

                    <div className="flex-1 relative">
                        <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
                            <ambientLight intensity={0.7} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />
                            <MonsterMini3D
                                color={monster.color}
                                type={monster.type}
                                scale={1.5}
                            />
                            <OrbitControls enableZoom={false} autoRotate={isPlaying} autoRotateSpeed={4} />
                            <Environment preset="city" />
                        </Canvas>
                    </div>
                </div>

                {/* Right: Stats & Actions */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2">
                    {/* Description Card */}
                    <div className="bg-white p-5 rounded-3xl border-4 border-slate-100 shadow-sm">
                        <p className="text-slate-600 font-bold leading-relaxed">
                            A rare {monster.type} type monster found in the digital wild.
                            Known for its unique sound signature and rhythmic capabilities.
                        </p>
                    </div>

                    {/* Stats Bars */}
                    <div className="bg-white p-6 rounded-3xl border-4 border-slate-100 shadow-sm space-y-4">
                        <h3 className="font-black text-slate-400 uppercase text-sm tracking-wider mb-2">Battle Stats</h3>
                        {stats.map(stat => (
                            <div key={stat.label} className="space-y-1">
                                <div className="flex justify-between text-xs font-black text-slate-500 uppercase">
                                    <div className="flex items-center gap-1">
                                        <stat.icon size={12} />
                                        {stat.label}
                                    </div>
                                    <span>{stat.value}</span>
                                </div>
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full ${stat.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePlaySound}
                        className={`
                            w-full py-4 rounded-2xl font-black text-xl text-white shadow-[0_4px_0_rgba(0,0,0,0.2)]
                            flex items-center justify-center gap-3 transition-colors
                            ${isPlaying ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-400'}
                        `}
                    >
                        {isPlaying ? (
                            <>
                                <Volume2 className="w-8 h-8 animate-pulse" strokeWidth={3} />
                                PLAYING...
                            </>
                        ) : (
                            <>
                                <Play className="w-8 h-8" fill="currentColor" />
                                PLAY CRY
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
