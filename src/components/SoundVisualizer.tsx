import { useEffect, useRef } from 'react';

interface SoundVisualizerProps {
    isActive: boolean;
    color: string;
    waveformType: 'sine' | 'square' | 'triangle' | 'sawtooth';
    frequency: number;
}

export default function SoundVisualizer({ isActive, color, waveformType, frequency }: SoundVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Grid lines
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            if (!isActive) return;
            ctx.stroke();

            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.stroke();
            ctx.shadowBlur = 0;

            time += 0.5; // Animation speed
            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [isActive, color, waveformType, frequency]);

    return (
        <div className="bg-black/80 rounded-xl border-2 border-gray-700 p-4 relative overflow-hidden">
            <div className="absolute top-2 left-3 text-xs font-mono text-gray-400">
                OSCILLOSCOPE // {waveformType.toUpperCase()} // {frequency}Hz
            </div>
            <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className="w-full h-full"
            />
        </div>
    );
}
