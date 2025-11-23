import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface MonitorFrameProps {
    children: ReactNode;
}

export default function MonitorFrame({ children }: MonitorFrameProps) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4 overflow-hidden font-sans">
            {/* Toy Box Device Casing */}
            <div className="relative w-full max-w-[1000px] aspect-[4/3] bg-orange-400 rounded-[3rem] shadow-2xl p-6 flex flex-col overflow-hidden border-b-8 border-r-8 border-orange-600">

                {/* Blue Rubber Corners */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-800 rounded-br-[3rem] shadow-inner" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-800 rounded-bl-[3rem] shadow-inner" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-800 rounded-tr-[3rem] shadow-inner" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-800 rounded-tl-[3rem] shadow-inner" />

                {/* Top Section: Speaker */}
                <div className="h-32 flex justify-center items-start relative z-10 -mt-4">
                    <div className="w-40 h-40 bg-orange-300 rounded-full flex items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)] border-4 border-orange-500">
                        {/* RGB Ring */}
                        <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center relative overflow-hidden animate-spin-slow">
                            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,red,yellow,green,cyan,blue,magenta,red)] opacity-50 blur-xl" />
                            {/* Speaker Grill */}
                            <div className="absolute inset-2 bg-gray-200 rounded-full bg-[radial-gradient(circle,black_2px,transparent_2.5px)] bg-[length:8px_8px] shadow-inner" />
                        </div>
                    </div>
                </div>

                {/* Main Body */}
                <div className="flex-1 flex gap-8 relative z-10">

                    {/* Left: Screen */}
                    <div className="flex-1 bg-orange-500 rounded-[2rem] p-4 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] border-b-4 border-white/20">
                        <div className="w-full h-full bg-black rounded-xl overflow-hidden relative border-4 border-gray-800 shadow-inner">
                            {/* Screen Content */}
                            <div className="relative w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide bg-gray-900">
                                {children}
                            </div>
                            {/* Screen Glare */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="w-1/3 flex flex-col gap-6 py-4">

                        {/* Sliders Area */}
                        <div className="flex-1 bg-orange-300/50 rounded-2xl p-4 flex justify-between items-center shadow-inner">
                            {['BEAT', 'BASS', 'MELODY', 'FX'].map((label, i) => (
                                <div key={label} className="flex flex-col items-center gap-2 h-full">
                                    <div className="flex-1 w-4 bg-gray-800 rounded-full relative shadow-inner">
                                        <motion.div
                                            drag="y"
                                            dragConstraints={{ top: 0, bottom: 100 }}
                                            className="w-8 h-6 bg-orange-500 absolute top-1/2 -left-2 rounded shadow-md border-t border-orange-300 cursor-grab active:cursor-grabbing"
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-orange-900/60">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Buttons Area - 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-4 justify-items-center">
                            <motion.button
                                whileTap={{ scale: 0.9, y: 4 }}
                                onClick={() => navigate('/scanner')}
                                className={`
                                    w-20 h-20 rounded-full bg-red-500 shadow-[0_6px_0_#991b1b,0_10px_10px_rgba(0,0,0,0.2)]
                                    active:shadow-none active:translate-y-1.5 border-b-4 border-red-700
                                    flex items-center justify-center text-white font-black text-xl tracking-wider
                                    ${location.pathname === '/scanner' ? 'ring-4 ring-white' : ''}
                                `}
                            >
                                REC
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.9, y: 4 }}
                                onClick={() => navigate('/jam')}
                                className={`
                                    w-20 h-20 rounded-full bg-green-500 shadow-[0_6px_0_#166534,0_10px_10px_rgba(0,0,0,0.2)]
                                    active:shadow-none active:translate-y-1.5 border-b-4 border-green-700
                                    flex items-center justify-center text-white font-black text-xl tracking-wider
                                    ${location.pathname === '/jam' ? 'ring-4 ring-white' : ''}
                                `}
                            >
                                JAM
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.9, y: 4 }}
                                onClick={() => navigate('/lab')}
                                className={`
                                    w-20 h-20 rounded-full bg-purple-500 shadow-[0_6px_0_#7e22ce,0_10px_10px_rgba(0,0,0,0.2)]
                                    active:shadow-none active:translate-y-1.5 border-b-4 border-purple-700
                                    flex items-center justify-center text-white font-black text-xl tracking-wider
                                    ${location.pathname === '/lab' ? 'ring-4 ring-white' : ''}
                                `}
                            >
                                LAB
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.9, y: 4 }}
                                onClick={() => navigate('/')}
                                className={`
                                    w-20 h-20 rounded-full bg-blue-500 shadow-[0_6px_0_#1e40af,0_10px_10px_rgba(0,0,0,0.2)]
                                    active:shadow-none active:translate-y-1.5 border-b-4 border-blue-700
                                    flex items-center justify-center text-white font-black text-xl tracking-wider
                                    ${location.pathname === '/' ? 'ring-4 ring-white' : ''}
                                `}
                            >
                                DEX
                            </motion.button>
                        </div>

                    </div>
                </div>

                {/* Ribbed Sides Texture (Visual only) */}
                <div className="absolute left-0 top-1/4 bottom-1/4 w-4 flex flex-col justify-between py-4 opacity-20">
                    {[...Array(10)].map((_, i) => <div key={i} className="h-1 bg-black w-full" />)}
                </div>
                <div className="absolute right-0 top-1/4 bottom-1/4 w-4 flex flex-col justify-between py-4 opacity-20">
                    {[...Array(10)].map((_, i) => <div key={i} className="h-1 bg-black w-full" />)}
                </div>

            </div>
        </div>
    );
}
