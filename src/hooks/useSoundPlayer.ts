import { useRef, useEffect, useState } from 'react';

export interface SoundParams {
    waveform: OscillatorType;
    pitchShift: number; // Semitones
    speed: number; // 0.5 to 2.0
    filterFreq: number; // Hz
    hasCrackle: boolean;
    loop: boolean; // Loop the sound
    delay: number; // Delay/echo amount (0-100)
}

export default function useSoundPlayer() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const activeSourcesRef = useRef<Map<string, { oscillators: OscillatorNode[], gains: GainNode[], effects: AudioNode[] }>>(new Map());
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.6);
    const masterGainRef = useRef<GainNode | null>(null);
    const crackleNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const crackleGainRef = useRef<GainNode | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = ctx;

            masterGainRef.current = ctx.createGain();
            masterGainRef.current.gain.value = volume;
            masterGainRef.current.connect(ctx.destination);

            // Create crackle buffer
            const bufferSize = ctx.sampleRate * 2; // 2 seconds loop
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                if (Math.random() > 0.99) { // Occasional clicks
                    data[i] = (Math.random() * 2 - 1) * 0.5;
                } else {
                    data[i] = (Math.random() * 2 - 1) * 0.005; // Low hiss
                }
            }

            // Store buffer for later use
            (ctx as any).crackleBuffer = buffer;
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

    const startCrackle = () => {
        if (!audioContextRef.current || !masterGainRef.current) return;
        const ctx = audioContextRef.current;

        if (crackleNodeRef.current) return; // Already playing

        const source = ctx.createBufferSource();
        source.buffer = (ctx as any).crackleBuffer;
        source.loop = true;

        const gain = ctx.createGain();
        gain.gain.value = 0.05; // Subtle

        source.connect(gain);
        gain.connect(masterGainRef.current);
        source.start();

        crackleNodeRef.current = source;
        crackleGainRef.current = gain;
    };

    const stopCrackle = () => {
        if (crackleNodeRef.current) {
            try {
                crackleNodeRef.current.stop();
                crackleNodeRef.current.disconnect();
            } catch (e) { }
            crackleNodeRef.current = null;
        }
        if (crackleGainRef.current) {
            crackleGainRef.current.disconnect();
            crackleGainRef.current = null;
        }
    };

    const stopAllSounds = () => {
        activeSourcesRef.current.forEach((sources) => {
            sources.oscillators.forEach(osc => { try { osc.stop(); osc.disconnect(); } catch (e) { } });
            sources.gains.forEach(gain => { try { gain.disconnect(); } catch (e) { } });
            sources.effects.forEach(node => { try { node.disconnect(); } catch (e) { } });
        });

        activeSourcesRef.current.clear();
        stopCrackle();
        setIsPlaying(false);
    };

    const playMonsterSound = async (
        monster: any, // Monster object with recordedAudio
        params: Partial<SoundParams> = {}
    ) => {
        if (!audioContextRef.current || !masterGainRef.current) return;

        const ctx = audioContextRef.current;
        const masterGain = masterGainRef.current;

        // Default params
        const soundParams: SoundParams = {
            waveform: 'sine',
            pitchShift: 0,
            speed: 1,
            filterFreq: 20000,
            hasCrackle: false,
            loop: params.loop ?? false,
            delay: params.delay ?? 0,
            ...params
        };

        if (soundParams.hasCrackle) startCrackle();

        // Stop existing
        const monsterId = typeof monster === 'string' ? monster : monster.id;
        const existing = activeSourcesRef.current.get(monsterId);
        if (existing) {
            existing.oscillators.forEach(o => { try { o.stop(); o.disconnect() } catch (e) { } });
            existing.gains.forEach(g => { try { g.disconnect() } catch (e) { } });
            existing.effects.forEach(n => { try { n.disconnect() } catch (e) { } });
            activeSourcesRef.current.delete(monsterId);
        }

        // Check if monster has recorded audio
        if (monster.recordedAudio) {
            // Play recorded audio
            try {
                const response = await fetch(monster.recordedAudio);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.loop = soundParams.loop;

                // Apply playback rate (speed + pitch shift combined)
                const pitchFactor = Math.pow(2, soundParams.pitchShift / 12);
                source.playbackRate.value = soundParams.speed * pitchFactor;

                // Create delay effect if needed
                let outputNode: AudioNode = source;
                const effects: AudioNode[] = [];

                if (soundParams.delay > 0) {
                    const delayNode = ctx.createDelay(2.0);
                    delayNode.delayTime.value = (soundParams.delay / 100) * 0.5; // Max 0.5s delay

                    const feedback = ctx.createGain();
                    feedback.gain.value = Math.min(soundParams.delay / 100, 0.7); // Feedback based on delay amount

                    const delayGain = ctx.createGain();
                    delayGain.gain.value = 0.6;

                    source.connect(delayGain);
                    delayGain.connect(delayNode);
                    delayNode.connect(feedback);
                    feedback.connect(delayNode);
                    delayNode.connect(masterGain);

                    effects.push(delayNode, feedback, delayGain);
                }

                // Main output
                const gain = ctx.createGain();
                gain.gain.value = 0.7;
                outputNode.connect(gain);
                gain.connect(masterGain);

                source.start(0);

                activeSourcesRef.current.set(monsterId, {
                    oscillators: [source as any],
                    gains: [gain],
                    effects
                });

                setIsPlaying(true);

            } catch (error) {
                console.error('Error playing recorded audio:', error);
                // Fall back to synth if recorded audio fails
                playMonsterSynth(monster.type || 'melody', soundParams);
            }
        } else {
            // No recorded audio, use synth
            playMonsterSynth(monster.type || (typeof monster === 'string' ? monster : 'melody'), soundParams);
        }
    };

    const playMonsterSynth = (type: string, soundParams: SoundParams) => {
        if (!audioContextRef.current || !masterGainRef.current) return;

        const ctx = audioContextRef.current;
        const masterGain = masterGainRef.current;

        // Patterns
        const monsterPatterns: Record<string, { baseNote: number, pattern: number[], harmonics: number[] }> = {
            bass: { baseNote: 110, pattern: [0, 12, 7, 12], harmonics: [1, 0.5, 0.25] },
            rhythm: { baseNote: 220, pattern: [0, 4, 7, 4], harmonics: [1, 0.3, 0.2] },
            melody: { baseNote: 440, pattern: [0, 2, 4, 5, 7, 9, 11, 12], harmonics: [1, 0.4, 0.3] },
            vocals: { baseNote: 523.25, pattern: [0, 3, 7, 10], harmonics: [1, 0.6, 0.4] },
            fx: { baseNote: 659.25, pattern: [0, 5, 7, 12], harmonics: [1, 0.5, 0.3] }
        };

        const config = monsterPatterns[type] || monsterPatterns.melody;
        const beatDuration = (60 / 120) / soundParams.speed;
        const noteDuration = beatDuration / 2;

        const oscillators: OscillatorNode[] = [];
        const gains: GainNode[] = [];
        const effects: AudioNode[] = [];

        // Effect Chain for this monster
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = soundParams.filterFreq;
        filter.connect(masterGain);
        effects.push(filter);

        const playNote = (noteOffset: number, startTime: number) => {
            const pitchMultiplier = Math.pow(2, soundParams.pitchShift / 12);
            const frequency = config.baseNote * Math.pow(2, noteOffset / 12) * pitchMultiplier;

            config.harmonics.forEach((harmonic, i) => {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();
                const panNode = ctx.createStereoPanner();

                // Use param waveform for fundamental, sine for harmonics
                osc.type = i === 0 ? soundParams.waveform : 'sine';

                // Wobble effect (pitch modulation)
                if (soundParams.hasCrackle) {
                    osc.detune.setValueAtTime(0, startTime);
                    osc.detune.linearRampToValueAtTime(Math.random() * 20 - 10, startTime + noteDuration);
                }

                osc.frequency.setValueAtTime(frequency * (i + 1), startTime);

                const attack = 0.02;
                const decay = 0.1;
                const sustain = 0.4 * harmonic;
                const release = 0.3;

                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(harmonic * 0.3, startTime + attack);
                gainNode.gain.exponentialRampToValueAtTime(sustain, startTime + attack + decay);
                gainNode.gain.setValueAtTime(sustain, startTime + noteDuration - release);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

                panNode.pan.value = (i - config.harmonics.length / 2) * 0.1;

                osc.connect(gainNode);
                gainNode.connect(panNode);
                panNode.connect(filter); // Connect to filter instead of master

                osc.start(startTime);
                osc.stop(startTime + noteDuration);

                oscillators.push(osc);
                gains.push(gainNode);
            });
        };

        if (soundParams.loop) {
            const patternDuration = config.pattern.length * noteDuration;
            let currentTime = ctx.currentTime;

            const schedule = () => {
                config.pattern.forEach((n, i) => playNote(n, currentTime + (i * noteDuration)));
            };
            schedule();

            activeSourcesRef.current.set(type, { oscillators, gains, effects });
            setIsPlaying(true);

            const interval = setInterval(() => {
                if (activeSourcesRef.current.has(type)) {
                    currentTime = ctx.currentTime;
                    schedule();
                } else {
                    clearInterval(interval);
                }
            }, patternDuration * 1000);
        } else {
            config.pattern.forEach((n, i) => playNote(n, ctx.currentTime + (i * noteDuration)));
            setTimeout(() => setIsPlaying(false), config.pattern.length * noteDuration * 1000);
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
