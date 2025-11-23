import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Waves, Sparkles, X } from 'lucide-react';
import Modal from '../components/Modal';
import MonsterMini3D from '../components/MonsterMini3D';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

type ScanState = 'idle' | 'requesting-mic' | 'recording' | 'processing' | 'found';

export default function Scanner() {
    const { allMonsters, unlockMonster } = useGame();
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [foundMonster, setFoundMonster] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [recordedAudioData, setRecordedAudioData] = useState<string | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    const handleScan = async () => {
        if (scanState !== 'idle') return;

        try {
            // Request microphone access
            setScanState('requesting-mic');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Start recording
            setScanState('recording');
            const recorder = new MediaRecorder(stream);
            const audioChunks: Blob[] = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Audio = reader.result as string;
                    setRecordedAudioData(base64Audio);

                    // Process and find monster
                    setScanState('processing');
                    setTimeout(() => {
                        const lockedMonsters = allMonsters.filter(m => !m.isUnlocked);
                        const targetMonster = lockedMonsters.length > 0
                            ? lockedMonsters[Math.floor(Math.random() * lockedMonsters.length)]
                            : allMonsters[Math.floor(Math.random() * allMonsters.length)];

                        if (targetMonster) {
                            // Attach recorded audio to monster
                            unlockMonster(targetMonster.id, base64Audio);
                            const monsterWithAudio = { ...targetMonster, recordedAudio: base64Audio };
                            setFoundMonster(monsterWithAudio);
                            setScanState('found');
                            setShowModal(true);
                        } else {
                            setScanState('idle');
                        }
                    }, 1500);

                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                };
                reader.readAsDataURL(audioBlob);
            };

            setMediaRecorder(recorder);
            recorder.start();

            // Record for 2.5 seconds
            setTimeout(() => {
                recorder.stop();
            }, 2500);

        } catch (error) {
            console.error('Microphone access denied or error:', error);
            setScanState('idle');
            alert('Microphone access is required to scan monsters!');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setScanState('idle');
        setFoundMonster(null);
    };

    return (
        <div className="h-full relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Viewfinder Overlay */}
            <div className="absolute inset-4 border-4 border-slate-500/30 rounded-3xl pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-white rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-white rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-white rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-white rounded-br-2xl" />
            </div>

            {/* Scanning Rings */}
            <div className="relative">
                {(scanState === 'recording' || scanState === 'requesting-mic') && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="absolute w-64 h-64 rounded-full border-4 border-red-400"
                            animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                            className="absolute w-64 h-64 rounded-full border-4 border-red-400"
                            animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                        />
                    </div>
                )}

                {/* Scan Button */}
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
                            ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-[0_10px_40px_rgba(239,68,68,0.5)] border-8 border-white'
                            : scanState === 'recording'
                                ? 'bg-gradient-to-br from-red-600 to-red-800 border-8 border-red-400 animate-pulse'
                                : 'bg-slate-800 border-8 border-slate-700'
                        }
                    `}
                >
                    {scanState === 'idle' ? (
                        <Radio className="w-24 h-24 text-white" strokeWidth={2} />
                    ) : scanState === 'requesting-mic' ? (
                        <Radio className="w-24 h-24 text-yellow-400 animate-pulse" strokeWidth={2} />
                    ) : scanState === 'recording' ? (
                        <>
                            <div className="w-6 h-6 bg-red-400 rounded-full animate-pulse" />
                            <span className="text-sm font-black text-red-200">RECORDING...</span>
                        </>
                    ) : scanState === 'processing' ? (
                        <Sparkles className="w-24 h-24 text-purple-400 animate-spin-slow" strokeWidth={2} />
                    ) : (
                        <Sparkles className="w-24 h-24 text-green-400" strokeWidth={2} />
                    )}

                    <div className="text-center">
                        <p className={`text-2xl font-black uppercase tracking-wider ${scanState === 'idle' ? 'text-white' : 'text-slate-400'}`}>
                            {scanState === 'idle' && 'TAP TO SCAN'}
                            {scanState === 'listening' && 'LISTENING...'}
                            {scanState === 'analyzing' && 'ANALYZING...'}
                            {scanState === 'found' && 'MATCH FOUND!'}
                        </p>
                    </div>
                </motion.button>
            </div>

            {/* Capture Modal */}
            <Modal open={showModal} onClose={handleCloseModal}>
                {foundMonster && (
                    <div className="text-center py-8 relative overflow-hidden">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-black text-slate-800 mb-2">MONSTER CAUGHT!</h2>
                            <p className="text-slate-500 font-bold text-lg mb-8">Added to your collection</p>

                            <div className="relative w-64 h-64 mx-auto mb-8 bg-gradient-to-b from-slate-100 to-white rounded-3xl border-4 border-slate-100 shadow-inner overflow-hidden">
                                <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                                    <ambientLight intensity={0.7} />
                                    <directionalLight position={[5, 5, 5]} intensity={1} />
                                    <MonsterMini3D color={foundMonster.color} type={foundMonster.type} scale={1.5} />
                                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
                                    <Environment preset="city" />
                                </Canvas>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-3xl font-black text-slate-800">{foundMonster.name}</h3>
                                <span className="inline-block px-4 py-1 bg-slate-200 rounded-full font-bold text-slate-600 uppercase mt-2">
                                    {foundMonster.type} TYPE
                                </span>
                            </div>

                            <button
                                onClick={handleCloseModal}
                                className="w-full bg-green-500 hover:bg-green-400 text-white font-black py-4 px-6 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] transition-all active:translate-y-1 active:shadow-none"
                            >
                                AWESOME!
                            </button>
                        </motion.div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
