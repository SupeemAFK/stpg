import { useEffect, useRef } from 'react';

interface OscilloscopeProps {
    analyser: AnalyserNode | null;
    isActive?: boolean;
    color?: string;
}

export default function Oscilloscope({ analyser, isActive = false, color = '#3B82F6' }: OscilloscopeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            // Clear canvas
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, width, height);

            // Draw grid lines
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // Horizontal centerline
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            // Vertical divisions
            for (let i = 0; i <= 4; i++) {
                const x = (width / 4) * i;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            ctx.stroke();

            // Draw waveform
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.beginPath();

            if (analyser && isActive) {
                // Real audio data
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteTimeDomainData(dataArray);

                const sliceWidth = width / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * height) / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }
            } else {
                // Animated sine wave when no audio
                const time = Date.now() / 1000;
                const amplitude = 20;
                const frequency = 2;

                for (let x = 0; x < width; x++) {
                    const y = height / 2 + Math.sin((x / width) * Math.PI * frequency + time * 2) * amplitude;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            }

            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [analyser, isActive, color]);

    return (
        <div className="bg-black rounded-2xl border-4 border-slate-700 p-3 relative shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div className="absolute top-2 left-3 text-xs font-mono font-black text-slate-400 tracking-wider">
                OSCILLOSCOPE
            </div>
            <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full h-full"
            />
        </div>
    );
}
