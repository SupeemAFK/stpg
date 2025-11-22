import { useGame } from '../context/GameContext';
import { ArrowLeft, Play, Volume2 } from 'lucide-react';
import type { ViewType } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Monster3D from '../components/Monster3D';
import useSoundPlayer from '../hooks/useSoundPlayer';

interface MonsterDetailProps {
    onNavigate: (view: ViewType) => void;
}

export default function MonsterDetail({ onNavigate }: MonsterDetailProps) {
    const { selectedMonster } = useGame();
    const { playMonsterSound, isPlaying } = useSoundPlayer();

    if (!selectedMonster) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="glass-dark rounded-2xl p-8 text-center">
                    <p className="text-white/80 mb-4 text-lg">No monster selected</p>
                    <button
                        onClick={() => onNavigate('pokedex')}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl transition-all glow-red"
                    >
                        Go to Pokédex
                    </button>
                </div>
            </div>
        );
    }

    const statsData = [
        { stat: 'HP', value: selectedMonster.stats.hp, fullMark: 255 },
        { stat: 'Attack', value: selectedMonster.stats.attack, fullMark: 255 },
        { stat: 'Defense', value: selectedMonster.stats.defense, fullMark: 255 },
        { stat: 'Sp. Atk', value: selectedMonster.stats.spAtk, fullMark: 255 },
        { stat: 'Sp. Def', value: selectedMonster.stats.spDef, fullMark: 255 },
        { stat: 'Speed', value: selectedMonster.stats.speed, fullMark: 255 },
    ];

    const handlePlaySound = () => {
        playMonsterSound(selectedMonster.type);
    };

    return (
        <div className="py-6">
            {/* Back Button */}
            <button
                onClick={() => onNavigate('pokedex')}
                className="flex items-center gap-2 text-white/80 hover:text-white mb-6 font-bold transition-colors glass-dark px-4 py-2 rounded-lg"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Pokédex
            </button>

            {/* Monster Detail Layout */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Left: 3D Model */}
                <div className="flex items-center justify-center">
                    <div className="w-full aspect-square max-w-md glass-dark rounded-2xl p-6 border border-white/20 relative overflow-hidden">
                        {/* 3D Canvas */}
                        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />
                            <pointLight position={[-10, -10, -5]} intensity={0.5} />
                            <Monster3D color={selectedMonster.color} type={selectedMonster.type} />
                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                            <Environment preset="city" />
                        </Canvas>

                        {/* Type indicator */}
                        <div
                            className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-black uppercase text-white shadow-lg"
                            style={{ backgroundColor: selectedMonster.color, boxShadow: `0 0 20px ${selectedMonster.color}` }}
                        >
                            {selectedMonster.type}
                        </div>
                    </div>
                </div>

                {/* Right: Stats Panel */}
                <div className="space-y-6">
                    {/* Header */}
                    <div className="glass-dark rounded-2xl p-6 border border-white/20">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 animate-neon-pulse">
                            {selectedMonster.name}
                        </h1>
                        <p className="text-white/70 text-lg font-semibold">Level 50 • Sound Monster</p>
                    </div>

                    {/* Stats Radar Chart */}
                    <div className="glass-dark rounded-2xl p-6 border border-white/20">
                        <h2 className="text-2xl font-black text-white mb-4">Base Stats</h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={statsData}>
                                <PolarGrid stroke="#ffffff40" />
                                <PolarAngleAxis
                                    dataKey="stat"
                                    tick={{ fill: '#fff', fontWeight: 'bold', fontSize: 12 }}
                                />
                                <Radar
                                    name={selectedMonster.name}
                                    dataKey="value"
                                    stroke={selectedMonster.color}
                                    fill={selectedMonster.color}
                                    fillOpacity={0.6}
                                    strokeWidth={3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>

                        {/* Stats List */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {statsData.map((stat) => (
                                <div key={stat.stat} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur">
                                    <span className="font-bold text-white/90">{stat.stat}</span>
                                    <span className="font-black text-xl" style={{ color: selectedMonster.color }}>
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Play Sound Button */}
                    <button
                        onClick={handlePlaySound}
                        disabled={isPlaying}
                        className={`
              w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
              text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 
              transition-all shadow-lg hover:shadow-xl diagonal-cut-tl glow-red
              ${isPlaying ? 'animate-pulse-glow' : ''}
            `}
                    >
                        {isPlaying ? (
                            <>
                                <Volume2 className="w-6 h-6 animate-pulse" fill="currentColor" />
                                Playing Sound...
                            </>
                        ) : (
                            <>
                                <Play className="w-6 h-6" fill="currentColor" />
                                Play Sound Sample
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
