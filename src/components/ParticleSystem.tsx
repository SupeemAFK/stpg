import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ParticleProps {
    x: number;
    y: number;
    color: string;
    delay: number;
}

function Particle({ x, y, color, delay }: ParticleProps) {
    return (
        <motion.div
            initial={{ opacity: 1, scale: 1, x, y }}
            animate={{
                opacity: 0,
                scale: 0.3,
                y: y - 100,
            }}
            transition={{
                duration: 2,
                delay,
                ease: 'easeOut',
            }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
                background: `radial-gradient(circle, ${color}, transparent)`,
                boxShadow: `0 0 10px ${color}`,
            }}
        />
    );
}

interface ParticleSystemProps {
    isActive: boolean;
    color?: string;
    count?: number;
}

export default function ParticleSystem({ isActive, color = '#FBBF24', count = 20 }: ParticleSystemProps) {
    const [particles, setParticles] = useState<ParticleProps[]>([]);

    useEffect(() => {
        if (!isActive) {
            setParticles([]);
            return;
        }

        const interval = setInterval(() => {
            const newParticles: ParticleProps[] = [];
            for (let i = 0; i < count; i++) {
                newParticles.push({
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 50,
                    color,
                    delay: Math.random() * 0.5,
                });
            }
            setParticles(newParticles);
        }, 500);

        return () => clearInterval(interval);
    }, [isActive, color, count]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle, index) => (
                <Particle key={`${index}-${Date.now()}`} {...particle} />
            ))}
        </div>
    );
}
