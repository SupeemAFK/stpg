import { useState } from 'react';
import { useGame } from '../context/GameContext';
import Modal from '../components/Modal';
import ParticleSystem from '../components/ParticleSystem';
import { Sparkles, Radio, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import MonsterMini3D from '../components/MonsterMini3D';

type ScanState = 'idle' | 'listening' | 'analyzing' | 'found';

export default function Scanner() {
    const { scanForSound } = useGame();
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [foundMonster, setFoundMonster] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const handleScan = async () => {
        setScanState('listening');

        setTimeout(() => {
            setScanState('analyzing');
        }, 3000);

        const result = await scanForSound();

        if (result) {
            setScanState('found');
            setFoundMonster(result);
            setShowModal(true);
        } else {
            setScanState('idle');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setScanState('idle');
        setFoundMonster(null);
    };

    const isScanning = scanState === 'listening' || scanState === 'analyzing';

    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center relative px-4">
            <ParticleSystem isActive={isScanning} color="#DC2626" count={30} />

            {/* Header - Centered */}
            <div className="text-center mb-12 relative z-10 max-w-2xl mx-auto">
                <motion.h1
                    className="text-5xl md:text-6xl font-black text-white mb-4 animate-neon-pulse drop-shadow-lg"
                    animate={isScanning ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    Sound Scanner
                </motion.h1>
                <p className="text-xl text-white/90 font-bold">
                    Listen to the world and capture sound monsters!
                </p>
            </div>

            {/* Scanner Display - Centered */}
            <div className="relative w-full max-w-lg mx-auto z-10">
                {/* Circular scan area with rings */}
                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="absolute w-64 h-64 rounded-full border-4 border-red-500"
                            animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute w-64 h-64 rounded-full border-4 border-yellow-400"
                            animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        />
                        <motion.div
                            className="absolute w-64 h-64 rounded-full border-4 border-purple-500"
                            animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                        />
                    </div>
                )}

                {/* Waveform Visualizer - Centered */}
                {isScanning && (
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex items-end gap-2 justify-center z-20">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 bg-gradient-to-t from-red-600 to-yellow-400 rounded-full glow-red"
                                initial={{ height: '40px' }}
                                animate={{
                                    height: ['40px', '80px', '40px'],
                                    opacity: [0.6, 1, 0.6]
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Scan Button - Centered */}
                <motion.button
                    whileHover={{ scale: scanState === 'idle' ? 1.05 : 1 }}
                    whileTap={{ scale: scanState === 'idle' ? 0.95 : 1 }}
                    onClick={handleScan}
                    disabled={scanState !== 'idle'}
                    className={`
            relative w-72 h-72 mx-auto rounded-full
            flex flex-col items-center justify-center gap-4
            transition-all duration-500 shadow-2xl
            ${scanState === 'idle'
                            ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 glow-red'
                            : 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 animate-gradient-shift'
                        }
            ${scanState === 'idle' ? 'cursor-pointer' : 'cursor-not-allowed'}
            border-8 border-white/30
          `}
                >
                    {scanState !== 'idle' && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-white animate-pulse-scale opacity-20" />
                            <div className="scan-line" />
                        </>
                    )}

                    {scanState === 'idle' ? (
                        <Radio className="w-24 h-24 text-white drop-shadow-lg" strokeWidth={2.5} />
                    ) : scanState === 'listening' ? (
                        <Waves className="w-24 h-24 text-white drop-shadow-lg animate-pulse" strokeWidth={2.5} />
                    ) : (
                        <Sparkles className="w-24 h-24 text-yellow-300 drop-shadow-lg animate-spin-slow" strokeWidth={2.5} />
                    )}

                    <div className="text-center">
                        <p className="text-white text-3xl font-black uppercase tracking-wider drop-shadow-lg">
                            {scanState === 'idle' && 'Scan'}
                            {scanState === 'listening' && 'Listening...'}
                            {scanState === 'analyzing' && 'Analyzing...'}
                            {scanState === 'found' && 'Match Found!'}
                        </p>
                        {scanState !== 'idle' && (
                            <motion.div
                                className="mt-2 flex gap-1 justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 bg-white rounded-full"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </motion.button>

                {/* Status Text - Centered */}
                <div className="mt-12 text-center">
                    {scanState === 'idle' && (
                        <p className="text-white/80 text-lg font-semibold">Tap to scan for sound monsters</p>
                    )}
                    {scanState === 'listening' && (
                        <motion.p
                            className="text-yellow-400 text-xl font-black animate-pulse"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            Capturing audio signature...
                        </motion.p>
                    )}
                    {scanState === 'analyzing' && (
                        <motion.p
                            className="text-red-400 text-xl font-black animate-pulse"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            Processing sound data...
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Capture Modal */}
            <Modal open={showModal} onClose={handleCloseModal}>
                {foundMonster && (
                    <div className="text-center py-4 relative overflow-hidden">
                        {/* Explosion particles background */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-3 h-3 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle, ${foundMonster.color}, transparent)`,
                                        left: '50%',
                                        top: '50%',
                                    }}
                                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                    animate={{
                                        scale: [0, 1, 0.5],
                                        x: (Math.random() - 0.5) * 400,
                                        y: (Math.random() - 0.5) * 400,
                                        opacity: [1, 0.8, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: i * 0.05,
                                        ease: 'easeOut',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Header with excitement */}
                        <motion.div
                            className="mb-6 relative z-10"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', duration: 0.8, bounce: 0.5 }}
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 1.1, 1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                }}
                            >
                                <Sparkles className="w-20 h-20 text-yellow-500 mx-auto mb-4 drop-shadow-lg glow-yellow" />
                            </motion.div>

                            <motion.h2
                                className="text-4xl font-black text-gray-900 mb-2"
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                }}
                            >
                                🎉 NEW MONSTER CAPTURED! 🎉
                            </motion.h2>
                            <p className="text-gray-600 font-semibold text-lg">A wild sound monster appeared!</p>
                        </motion.div>

                        {/* 3D Model Display */}
                        <motion.div
                            className="relative mb-6 mx-auto max-w-md"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                        >
                            {/* Glow background */}
                            <div
                                className="absolute inset-0 blur-3xl rounded-full opacity-50 animate-pulse-scale"
                                style={{ background: `radial-gradient(circle, ${foundMonster.color}, transparent)` }}
                            />

                            {/* 3D Container */}
                            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 border-4 border-gray-900 shadow-2xl overflow-hidden">
                                {/* Animated background rays */}
                                <div className="absolute inset-0 opacity-20">
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute top-1/2 left-1/2 w-1 h-full origin-top"
                                            style={{
                                                background: `linear-gradient(to bottom, ${foundMonster.color}, transparent)`,
                                                transform: `rotate(${i * 45}deg)`,
                                            }}
                                            animate={{
                                                opacity: [0.3, 0.8, 0.3],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* 3D Model */}
                                <div className="relative w-64 h-64 mx-auto">
                                    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                                        <ambientLight intensity={0.6} />
                                        <directionalLight position={[10, 10, 5]} intensity={1.5} />
                                        <pointLight position={[-10, -10, -5]} intensity={0.8} color={foundMonster.color} />
                                        <spotLight position={[0, 10, 0]} intensity={1} color="#ffffff" />
                                        <MonsterMini3D color={foundMonster.color} type={foundMonster.type} scale={2} />
                                        <OrbitControls
                                            enableZoom={false}
                                            enablePan={false}
                                            autoRotate
                                            autoRotateSpeed={4}
                                        />
                                        <Environment preset="sunset" />
                                    </Canvas>
                                </div>

                                {/* Floating particles around model */}
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 rounded-full"
                                        style={{
                                            background: foundMonster.color,
                                            boxShadow: `0 0 10px ${foundMonster.color}`,
                                            left: '50%',
                                            top: '50%',
                                        }}
                                        animate={{
                                            x: [0, (Math.random() - 0.5) * 100],
                                            y: [0, (Math.random() - 0.5) * 100],
                                            opacity: [1, 0],
                                            scale: [1, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Monster Name & Type */}
                            <motion.div
                                className="mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h3 className="text-3xl font-black text-gray-900 mb-3">
                                    {foundMonster.name}
                                </h3>
                                <div
                                    className="inline-block px-6 py-2 rounded-full text-sm font-black uppercase text-white shadow-lg animate-bounce-in"
                                    style={{
                                        backgroundColor: foundMonster.color,
                                        boxShadow: `0 0 30px ${foundMonster.color}80, 0 10px 20px rgba(0,0,0,0.3)`
                                    }}
                                >
                                    {foundMonster.type}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.button
                            onClick={handleCloseModal}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black py-4 px-6 rounded-xl transition-all glow-red shadow-xl text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ⚡ View in Pokédex ⚡
                        </motion.button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
