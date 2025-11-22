import { useGame } from '../context/GameContext';
import MonsterCard from '../components/MonsterCard';
import type { ViewType } from '../types';
import { Trophy } from 'lucide-react';

interface PokedexProps {
  onNavigateToDetail: (monsterId: string, view: ViewType) => void;
}

export default function Pokedex({ onNavigateToDetail }: PokedexProps) {
  const { allMonsters } = useGame();
  const unlockedCount = allMonsters.filter(m => m.isUnlocked).length;
  const progress = (unlockedCount / allMonsters.length) * 100;

  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
      {/* Header with glass effect - Centered */}
      <div className="glass-dark rounded-2xl p-6 mb-8 border border-white/20 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Trophy className="w-12 h-12 text-yellow-400 glow-yellow animate-float" />
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 animate-neon-pulse">
              Pokédex
            </h1>
            <p className="text-lg text-white/80 font-semibold">
              Collected <span className="text-yellow-400 font-black">{unlockedCount}</span> / {allMonsters.length} Sound Monsters
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000 glow-yellow"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Monster Grid - Centered with max width */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
        {allMonsters.map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
            onClick={() => {
              if (monster.isUnlocked) {
                onNavigateToDetail(monster.id, 'detail');
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
