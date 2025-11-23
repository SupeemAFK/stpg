export type MonsterType = 'rhythm' | 'melody' | 'bass' | 'vocals' | 'fx';

export interface Stats {
    hp: number;        // Durability (0-255)
    attack: number;    // Loudness (0-255)
    defense: number;   // Noise Reduction (0-255)
    spAtk: number;     // Pitch Range (0-255)
    spDef: number;     // Clarity (0-255)
    speed: number;     // BPM/Tempo (0-255)
}

export interface Monster {
    id: string;
    name: string;
    type: MonsterType;
    image: string;
    color: string;
    isUnlocked: boolean;
    soundSrc: string;
    stats: Stats;
    recordedAudio?: string; // Base64 encoded audio data or Blob URL
}

export interface StageSlot {
    monster: Monster | null;
    isMuted: boolean;
}

export type ViewType = 'scanner' | 'pokedex' | 'detail' | 'lab' | 'jam';
