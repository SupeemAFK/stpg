import { useRef, useEffect, useState } from 'react';

export default function useSoundPlayer() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const activeSourcesRef = useRef<Map<string, { oscillators: OscillatorNode[], gains: GainNode[] }>>(new Map());
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.6);
    const masterGainRef = useRef<GainNode | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = ctx;

            masterGainRef.current = ctx.createGain();
            masterGainRef.current.gain.value = volume;
            masterGainRef.current.connect(ctx.destination);
        }

        return () => {
            stopAllSounds();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (masterGainRef.current && audioContextRef.current) {
            masterGainRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        }
    }, [volume]);

    const stopAllSounds = () => {
        activeSourcesRef.current.forEach((sources) => {
            sources.oscillators.forEach((osc) => {
                try {
                    osc.stop();
                    osc.disconnect();
                } catch (e) { }
            });
            sources.gains.forEach((gain) => {
                try {
                    gain.disconnect();
                } catch (e) { }
            });
        });

        activeSourcesRef.current.clear();
        setIsPlaying(false);
    };

    const playMonsterSound = (type: string, loop: boolean = false, tempo: number = 120) => {
        if (!audioContextRef.current || !masterGainRef.current) return;

        const ctx = audioContextRef.current;
        const masterGain = masterGainRef.current;

        const existingSources = activeSourcesRef.current.get(type);
        if (existingSources) {
            existingSources.oscillators.forEach((osc) => {
                try {
                    osc.stop();
                    osc.disconnect();
                } catch (e) { }
            });
            existingSources.gains.forEach((gain) => {
                try {
                    gain.disconnect();
                } catch (e) { }
            });
            activeSourcesRef.current.delete(type);
        }

        const monsterPatterns: Record<string, { baseNote: number, pattern: number[], harmonics: number[], waveType: OscillatorType }> = {
            bass: {
                baseNote: 110,
                pattern: [0, 12, 7, 12, 0, 12, 7, 12],
                harmonics: [1, 0.5, 0.25],
                waveType: 'triangle'
            },
            rhythm: {
                baseNote: 220,
                pattern: [0, 4, 7, 4, 0, 4, 7, 4],
                harmonics: [1, 0.3, 0.2, 0.1],
                waveType: 'square'
            },
            melody: {
                baseNote: 440,
                pattern: [0, 2, 4, 5, 7, 9, 11, 12],
                harmonics: [1, 0.4, 0.3, 0.2, 0.1],
                waveType: 'sine'
            },
            vocals: {
                baseNote: 523.25,
                pattern: [0, 3, 7, 10, 12, 10, 7, 3],
                harmonics: [1, 0.6, 0.4, 0.3, 0.2],
                waveType: 'sine'
            },
            fx: {
                baseNote: 659.25,
                pattern: [0, 5, 7, 12, 7, 5, 0, -5],
                harmonics: [1, 0.5, 0.3, 0.2, 0.15, 0.1],
                waveType: 'triangle'
            }
        };

        const config = monsterPatterns[type] || monsterPatterns.melody;
        const beatDuration = 60 / tempo;
        const noteDuration = beatDuration / 2;

        const oscillators: OscillatorNode[] = [];
        const gains: GainNode[] = [];

        const playNote = (noteOffset: number, startTime: number) => {
            const frequency = config.baseNote * Math.pow(2, noteOffset / 12);

            config.harmonics.forEach((harmonic, i) => {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();
                const panNode = ctx.createStereoPanner();

                if (i === 0) {
                    osc.type = config.waveType;
                } else {
                    osc.type = 'sine';
                }

                osc.frequency.setValueAtTime(frequency * (i + 1), startTime);

                const attackTime = 0.02;
                const decayTime = 0.1;
                const sustainLevel = 0.4 * harmonic;
                const releaseTime = 0.3;

                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(harmonic * 0.3, startTime + attackTime);
                gainNode.gain.exponentialRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
                gainNode.gain.setValueAtTime(sustainLevel, startTime + noteDuration - releaseTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

                panNode.pan.value = (i - config.harmonics.length / 2) * 0.1;

                osc.connect(gainNode);
                gainNode.connect(panNode);
                panNode.connect(masterGain);

                osc.start(startTime);
                osc.stop(startTime + noteDuration);

                oscillators.push(osc);
                gains.push(gainNode);
            });
        };

        if (loop) {
            const patternDuration = config.pattern.length * noteDuration;
            let currentTime = ctx.currentTime;

            const schedulePattern = () => {
                config.pattern.forEach((noteOffset, i) => {
                    playNote(noteOffset, currentTime + (i * noteDuration));
                });
            };

            schedulePattern();
            activeSourcesRef.current.set(type, { oscillators, gains });
            setIsPlaying(true);

            const intervalId = setInterval(() => {
                if (activeSourcesRef.current.has(type)) {
                    currentTime = ctx.currentTime;
                    schedulePattern();
                } else {
                    clearInterval(intervalId);
                }
            }, patternDuration * 1000);

        } else {
            config.pattern.forEach((noteOffset, i) => {
                playNote(noteOffset, ctx.currentTime + (i * noteDuration));
            });

            setTimeout(() => {
                setIsPlaying(false);
            }, config.pattern.length * noteDuration * 1000);
        }
    };

    return {
        playMonsterSound,
        stopAllSounds,
        isPlaying,
        volume,
        setVolume,
    };
}
