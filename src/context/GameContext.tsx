import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Monster, StageSlot } from '../types';
import { initialMonsters, fusionRecipes } from '../data/monsters';

interface GameContextType {
    allMonsters: Monster[];
    selectedMonster: Monster | null;
    stageSlots: StageSlot[];
    unlockMonster: (id: string, recordedAudio?: string) => void;
    scanForSound: () => Promise<Monster | null>;
    selectMonster: (id: string) => void;
    addToStage: (monsterId: string, slotIndex: number) => void;
    removeFromStage: (slotIndex: number) => void;
    toggleMute: (slotIndex: number) => void;
    clearStage: () => void;
    fuseMonsters: (id1: string, id2: string) => { success: boolean; result: Monster | null };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [allMonsters, setAllMonsters] = useState<Monster[]>(initialMonsters);
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [stageSlots, setStageSlots] = useState<StageSlot[]>(
        Array(5).fill(null).map(() => ({ monster: null, isMuted: false }))
    );

    const unlockMonster = useCallback((id: string, recordedAudio?: string) => {
        setAllMonsters(prev =>
            prev.map(m => m.id === id ? { ...m, isUnlocked: true, ...(recordedAudio && { recordedAudio }) } : m)
        );
    }, []);

    const scanForSound = useCallback(async (): Promise<Monster | null> => {
        // Simulate scanning delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Find all locked monsters
        const lockedMonsters = allMonsters.filter(m => !m.isUnlocked);

        if (lockedMonsters.length === 0) {
            return null; // All monsters unlocked
        }

        // Randomly select one to unlock
        const randomIndex = Math.floor(Math.random() * lockedMonsters.length);
        const monsterToUnlock = lockedMonsters[randomIndex];

        // Unlock it
        unlockMonster(monsterToUnlock.id);

        return monsterToUnlock;
    }, [allMonsters, unlockMonster]);

    const selectMonster = useCallback((id: string) => {
        const monster = allMonsters.find(m => m.id === id);
        setSelectedMonster(monster || null);
    }, [allMonsters]);

    const addToStage = useCallback((monsterId: string, slotIndex: number) => {
        const monster = allMonsters.find(m => m.id === monsterId);
        if (!monster || !monster.isUnlocked) return;

        setStageSlots(prev => {
            const newSlots = [...prev];
            newSlots[slotIndex] = { monster, isMuted: false };
            return newSlots;
        });
    }, [allMonsters]);

    const removeFromStage = useCallback((slotIndex: number) => {
        setStageSlots(prev => {
            const newSlots = [...prev];
            newSlots[slotIndex] = { monster: null, isMuted: false };
            return newSlots;
        });
    }, []);

    const toggleMute = useCallback((slotIndex: number) => {
        setStageSlots(prev => {
            const newSlots = [...prev];
            newSlots[slotIndex] = {
                ...newSlots[slotIndex],
                isMuted: !newSlots[slotIndex].isMuted
            };
            return newSlots;
        });
    }, []);

    const clearStage = useCallback(() => {
        setStageSlots(Array(5).fill(null).map(() => ({ monster: null, isMuted: false })));
    }, []);

    const fuseMonsters = useCallback((id1: string, id2: string) => {
        // Check fusion recipes
        const recipeKey1 = `${id1}+${id2}`;
        const recipeKey2 = `${id2}+${id1}`;

        const resultId = fusionRecipes[recipeKey1] || fusionRecipes[recipeKey2];

        if (resultId) {
            const resultMonster = allMonsters.find(m => m.id === resultId);
            if (resultMonster && !resultMonster.isUnlocked) {
                unlockMonster(resultId);
                return { success: true, result: resultMonster };
            }
        }

        return { success: false, result: null };
    }, [allMonsters, unlockMonster]);

    const value = {
        allMonsters,
        selectedMonster,
        stageSlots,
        unlockMonster,
        scanForSound,
        selectMonster,
        addToStage,
        removeFromStage,
        toggleMute,
        clearStage,
        fuseMonsters,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
