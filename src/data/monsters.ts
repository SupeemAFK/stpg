import type { Monster } from '../types';

export const initialMonsters: Monster[] = [
    // UNLOCKED STARTERS
    {
        id: 'kick-bot',
        name: 'KickBot',
        type: 'bass',
        image: 'https://placehold.co/400x400/1a1a1a/ffffff?text=KickBot',
        color: '#DC2626', // Red
        isUnlocked: true,
        soundSrc: '/sounds/kickbot.mp3',
        stats: {
            hp: 180,
            attack: 220,
            defense: 140,
            spAtk: 100,
            spDef: 120,
            speed: 95
        }
    },
    {
        id: 'snare-snake',
        name: 'SnareSnake',
        type: 'rhythm',
        image: 'https://placehold.co/400x400/1a1a1a/ffffff?text=SnareSnake',
        color: '#F59E0B', // Amber
        isUnlocked: true,
        soundSrc: '/sounds/snaresnake.mp3',
        stats: {
            hp: 150,
            attack: 180,
            defense: 110,
            spAtk: 130,
            spDef: 100,
            speed: 200
        }
    },

    // LOCKED MONSTERS
    {
        id: 'synth-cat',
        name: 'SynthCat',
        type: 'melody',
        image: 'https://placehold.co/400x400/1a1a1a/ffffff?text=SynthCat',
        color: '#8B5CF6', // Violet
        isUnlocked: false,
        soundSrc: '/sounds/synthcat.mp3',
        stats: {
            hp: 140,
            attack: 120,
            defense: 90,
            spAtk: 240,
            spDef: 180,
            speed: 160
        }
    },
    {
        id: 'vocal-viper',
        name: 'VocalViper',
        type: 'vocals',
        image: 'https://placehold.co/400x400/1a1a1a/ffffff?text=VocalViper',
        color: '#EC4899', // Pink
        isUnlocked: false,
        soundSrc: '/sounds/vocalviper.mp3',
        stats: {
            hp: 160,
            attack: 130,
            defense: 100,
            spAtk: 210,
            spDef: 190,
            speed: 140
        }
    },
    {
        id: 'fx-falcon',
        name: 'FXFalcon',
        type: 'fx',
        image: 'https://placehold.co/400x400/1a1a1a/ffffff?text=FXFalcon',
        color: '#06B6D4', // Cyan
        isUnlocked: false,
        soundSrc: '/sounds/fxfalcon.mp3',
        stats: {
            hp: 130,
            attack: 150,
            defense: 110,
            spAtk: 200,
            spDef: 160,
            speed: 220
        }
    },
    {
        id: 'techno-beast',
        name: 'TechnoBeast',
        type: 'bass',
        image: 'https://placehold.co/400x400/1a1a1a/ffffff?text=TechnoBeast',
        color: '#EF4444', // Bright Red
        isUnlocked: false,
        soundSrc: '/sounds/technobeast.mp3',
        stats: {
            hp: 220,
            attack: 250,
            defense: 180,
            spAtk: 140,
            spDef: 150,
            speed: 110
        }
    },
    {
        id: 'loop-lord',
        name: 'LoopLord',
        type: 'rhythm',
        image: 'https://placehold.co/400x400/1a1a1a/ffffff?text=LoopLord',
        color: '#10B981', // Emerald
        isUnlocked: false,
        soundSrc: '/sounds/looplord.mp3',
        stats: {
            hp: 200,
            attack: 190,
            defense: 160,
            spAtk: 170,
            spDef: 140,
            speed: 180
        }
    },
    {
        id: 'harmony-hawk',
        name: 'HarmonyHawk',
        type: 'melody',
        image: 'https://placehold.co/400x400/1a1a1a/ffffff?text=HarmonyHawk',
        color: '#3B82F6', // Blue
        isUnlocked: false,
        soundSrc: '/sounds/harmonyhawk.mp3',
        stats: {
            hp: 170,
            attack: 140,
            defense: 120,
            spAtk: 230,
            spDef: 200,
            speed: 170
        }
    }
];

// Fusion recipes: [monster1 + monster2] = result monster
export const fusionRecipes: Record<string, string> = {
    'kick-bot+snare-snake': 'techno-beast',
    'snare-snake+kick-bot': 'techno-beast',
    'synth-cat+vocal-viper': 'harmony-hawk',
    'vocal-viper+synth-cat': 'harmony-hawk',
};
