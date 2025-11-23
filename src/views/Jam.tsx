import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Play, Square, Settings, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import MonsterMini3D from '../components/MonsterMini3D';
import useSoundPlayer, { type SoundParams } from '../hooks/useSoundPlayer';
import Oscilloscope from '../components/Oscilloscope';

type Channel = 'BEAT' | 'BASS' | 'MELODY' | 'FX';

export default function Jam() {
    const { allMonsters } = useGame();
    const { playMonsterSound, stopAllSounds } = useSoundPlayer();
    const unlockedMonsters = allMonsters.filter(m => m.isUnlocked);

    const [activeMonsters, setActiveMonsters] = useState<Set<string>>(new Set());
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<Channel>('BEAT');

    // Per-monster settings
    const [monsterSettings, setMonsterSettings] = useState<Record<string, Partial<SoundParams>>>({});
    const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);

    const toggleMonster = (monsterId: string) => {
        setActiveMonsters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(monsterId)) {
                newSet.delete(monsterId);
                if (selectedMonsterId === monsterId) setSelectedMonsterId(null);
            } else {
                newSet.add(monsterId);
                // Initialize settings
                if (!monsterSettings[monsterId]) {
                    setMonsterSettings(prevS => ({
                        ...prevS,
                        [monsterId]: {
                            waveform: 'sine',
                            pitchShift: 0,
                            speed: 1,
                            hasCrackle: false,
                            loop: true,
                            delay: 0,
                            filterFreq: 20000
                        }
                    }));
                }
            }
            return newSet;
        });
    };

    const updateSetting = (id: string, key: keyof SoundParams, value: any) => {
        setMonsterSettings(prev => ({
            ...prev,
            [id]: { ...prev[id], [key]: value }
        }));

        // If currently playing, restart the sound with new settings
        if (isPlaying && activeMonsters.has(id)) {
            const monster = unlockedMonsters.find(m => m.id === id);
            if (monster) {
                // Stop current sound
                stopAllSounds();

                // Restart all active monsters with updated settings
                setTimeout(() => {
                    activeMonsters.forEach(monsterId => {
                        const m = unlockedMonsters.find(mon => mon.id === monsterId);
                        if (m) {
                            const settings = monsterId === id
                                ? { ...monsterSettings[id], [key]: value }
                                : (monsterSettings[monsterId] || {});

                            playMonsterSound(m, {
                                waveform: settings.waveform || 'sine',
                                pitchShift: settings.pitchShift || 0,
                                speed: settings.speed || 1,
                                hasCrackle: settings.hasCrackle || false,
                                loop: settings.loop !== false,
                                delay: settings.delay || 0,
                                filterFreq: settings.filterFreq || 20000
                            });
                        }
                    });
                }, 50);
            }
        }
    };

    // Play/stop all active monster sounds
    useEffect(() => {
        if (isPlaying && activeMonsters.size > 0) {
            // Play all active monsters with their settings
            activeMonsters.forEach(monsterId => {
                const monster = unlockedMonsters.find(m => m.id === monsterId);
                if (monster) {
                    const settings = monsterSettings[monsterId] || {};
                    playMonsterSound(monster, {
                        waveform: settings.waveform || 'sine',
                        pitchShift: settings.pitchShift || 0,
                        speed: settings.speed || 1,
                        hasCrackle: settings.hasCrackle || false,
                        loop: settings.loop !== false,
                        delay: settings.delay || 0,
                        filterFreq: settings.filterFreq || 20000
                    });
                }
            });
        } else {
            stopAllSounds();
        }
    }, [isPlaying, activeMonsters]);

    const handlePlayToggle = () => {
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        setIsPlaying(false);
        setActiveMonsters(new Set());
        stopAllSounds();
    };

    return (
        <div className="h-full flex flex-col p-4 gap-4">
            {/* Header Controls */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border-4 border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                        <Activity className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">JAM STATION</h1>
                        <p className="text-slate-500 font-bold text-sm">Mix & Match Beats</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePlayToggle}
                        className={`
                            px-6 py-3 rounded-xl font-black text-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)] flex items-center gap-2
                            ${isPlaying ? 'bg-red-500' : 'bg-green-500'}
                        `}
                    >
                        {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        {isPlaying ? 'STOP' : 'PLAY'}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStop}
                        disabled={activeMonsters.size === 0}
                        className="bg-slate-200 text-slate-600 px-4 py-3 rounded-xl font-bold hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        CLEAR
                    </motion.button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Main Stage - Active Monsters */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-min content-start overflow-y-auto">
                    {unlockedMonsters.map(monster => {
                        const isActive = activeMonsters.has(monster.id);
                        const isSelected = selectedMonsterId === monster.id;

                        return (
                            <motion.div
                                key={monster.id}
                                layout
                                onClick={() => toggleMonster(monster.id)}
                                className={`
                            relative rounded-xl overflow-hidden cursor-pointer transition-all border-2
                            ${isActive
                                        ? 'bg-gray-800/80 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-500'
                                    }
                            ${isSelected ? 'ring-2 ring-white scale-[1.02]' : ''}
                        `}
                            >
                                {/* 3D View */}
                                <div className="h-32 w-full bg-gradient-to-b from-gray-800 to-gray-900 relative">
                                    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                                        <ambientLight intensity={0.7} />
                                        <directionalLight position={[5, 5, 5]} intensity={1} />
                                        <MonsterMini3D
                                            color={monster.color}
                                            type={monster.type}
                                            scale={isActive && isPlaying ? 1.2 : 1}
                                        />
                                        <OrbitControls enableZoom={false} autoRotate={isActive && isPlaying} autoRotateSpeed={4} />
                                        <Environment preset="city" />
                                    </Canvas>

                                    {/* Status LED */}
                                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${isActive && isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-gray-600'}`} />

                                    {/* Recorded Audio Indicator */}
                                    {monster.recordedAudio && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 rounded text-xs font-black text-white">
                                            🎤 REC
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3 flex items-center justify-between bg-black/40">
                                    <span className="font-bold text-white text-sm">{monster.name}</span>
                                    {isActive && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMonsterId(isSelected ? null : monster.id);
                                            }}
                                            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                        >
                                            <Settings size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Sidebar - Settings & Visualizer */}
                <div className="space-y-6 overflow-y-auto">
                    {/* Oscilloscope Panel */}
                    <div className="glass-dark rounded-xl p-4 border border-white/10 space-y-4">
                        <div className="flex items-center gap-2 text-green-400">
                            <Activity size={18} />
                            <h3 className="font-bold font-mono text-sm">OSCILLOSCOPE</h3>
                        </div>

                        {/* Main Oscilloscope Display */}
                        <Oscilloscope
                            analyser={null}
                            isActive={isPlaying && activeMonsters.size > 0}
                            color={
                                selectedChannel === 'BEAT' ? '#ef4444' :
                                    selectedChannel === 'BASS' ? '#f97316' :
                                        selectedChannel === 'MELODY' ? '#3b82f6' :
                                            '#8b5cf6'
                            }
                        />

                        {/* Per-Monster Waveform Monitor */}
                        {selectedMonsterId && (
                            <div className="bg-black/50 rounded-lg p-3 border border-gray-700">
                                <div className="text-xs font-bold text-gray-400 mb-2 uppercase">
                                    {unlockedMonsters.find(m => m.id === selectedMonsterId)?.name} Waveform
                                </div>
                                <Oscilloscope
                                    analyser={null}
                                    isActive={isPlaying && activeMonsters.has(selectedMonsterId)}
                                    color={unlockedMonsters.find(m => m.id === selectedMonsterId)?.color || '#3b82f6'}
                                />
                            </div>
                        )}

                        {/* Channel Selector */}
                        <div className="grid grid-cols-4 gap-2">
                            {(['BEAT', 'BASS', 'MELODY', 'FX'] as Channel[]).map((channel) => (
                                <button
                                    key={channel}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={`
                                        px-2 py-2 rounded-lg text-xs font-black transition-all
                                        ${selectedChannel === channel
                                            ? 'bg-blue-600 text-white shadow-lg scale-105 shadow-blue-500/50'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    {channel}
                                </button>
                            ))}
                        </div>

                        <div className="text-xs text-gray-500 font-mono text-center pt-2 border-t border-white/10">
                            Monitoring: {selectedChannel}
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <AnimatePresence mode="wait">
                        {selectedMonsterId && monsterSettings[selectedMonsterId] ? (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-dark rounded-xl p-5 border border-white/10 space-y-4"
                            >
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h3 className="font-black text-white text-sm">
                                        {unlockedMonsters.find(m => m.id === selectedMonsterId)?.name} SETTINGS
                                    </h3>
                                </div>

                                {/* Waveform Type Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Waveform Type</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map((wave) => (
                                            <button
                                                key={wave}
                                                onClick={() => updateSetting(selectedMonsterId, 'waveform', wave)}
                                                className={`
                                                    px-2 py-2 rounded-lg text-xs font-black transition-all capitalize
                                                    ${monsterSettings[selectedMonsterId]?.waveform === wave
                                                        ? 'bg-cyan-600 text-white shadow-lg'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                    }
                                                `}
                                            >
                                                {wave[0].toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pitch Shift */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Pitch</label>
                                        <span className="text-xs font-mono text-blue-400">
                                            {monsterSettings[selectedMonsterId]?.pitchShift || 0} st
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-12"
                                        max="12"
                                        step="1"
                                        value={monsterSettings[selectedMonsterId]?.pitchShift || 0}
                                        onChange={(e) => updateSetting(selectedMonsterId, 'pitchShift', parseInt(e.target.value))}
                                        className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Speed */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Speed</label>
                                        <span className="text-xs font-mono text-yellow-400">
                                            {monsterSettings[selectedMonsterId]?.speed || 1}x
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={monsterSettings[selectedMonsterId]?.speed || 1}
                                        onChange={(e) => updateSetting(selectedMonsterId, 'speed', parseFloat(e.target.value))}
                                        className="w-full accent-yellow-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Bass/Filter Control */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Bass/Filter</label>
                                        <span className="text-xs font-mono text-orange-400">
                                            {Math.round((monsterSettings[selectedMonsterId]?.filterFreq || 20000) / 100)} Hz
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="200"
                                        max="20000"
                                        step="100"
                                        value={monsterSettings[selectedMonsterId]?.filterFreq || 20000}
                                        onChange={(e) => updateSetting(selectedMonsterId, 'filterFreq', parseInt(e.target.value))}
                                        className="w-full accent-orange-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Delay/Echo */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Delay/Echo</label>
                                        <span className="text-xs font-mono text-purple-400">
                                            {monsterSettings[selectedMonsterId]?.delay || 0}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={monsterSettings[selectedMonsterId]?.delay || 0}
                                        onChange={(e) => updateSetting(selectedMonsterId, 'delay', parseInt(e.target.value))}
                                        className="w-full accent-purple-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Toggles Row */}
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                                    {/* Loop Toggle */}
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Loop</label>
                                        <button
                                            onClick={() => updateSetting(selectedMonsterId, 'loop', !monsterSettings[selectedMonsterId]?.loop)}
                                            className={`
                                                w-12 h-6 rounded-full relative transition-colors duration-300
                                                ${monsterSettings[selectedMonsterId]?.loop !== false ? 'bg-green-500' : 'bg-gray-700'}
                                            `}
                                        >
                                            <div className={`
                                                absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300
                                                ${monsterSettings[selectedMonsterId]?.loop !== false ? 'left-7' : 'left-1'}
                                            `} />
                                        </button>
                                    </div>

                                    {/* Noise/Crackle Toggle */}
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Noise</label>
                                        <button
                                            onClick={() => updateSetting(selectedMonsterId, 'hasCrackle', !monsterSettings[selectedMonsterId]?.hasCrackle)}
                                            className={`
                                                w-12 h-6 rounded-full relative transition-colors duration-300
                                                ${monsterSettings[selectedMonsterId]?.hasCrackle ? 'bg-red-500' : 'bg-gray-700'}
                                            `}
                                        >
                                            <div className={`
                                                absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300
                                                ${monsterSettings[selectedMonsterId]?.hasCrackle ? 'left-7' : 'left-1'}
                                            `} />
                                        </button>
                                    </div>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="glass-dark rounded-xl p-8 border border-white/10 flex flex-col items-center justify-center text-center opacity-50">
                                <Settings size={48} className="text-gray-500 mb-4" />
                                <p className="text-gray-400 font-bold text-sm">Select an active monster to configure</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
}
