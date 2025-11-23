import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import MonsterCard from '../components/MonsterCard';
import { Trophy, FlaskConical } from 'lucide-react';

export default function Pokedex() {
  const navigate = useNavigate();
  const { allMonsters, selectMonster } = useGame();
  const unlockedCount = allMonsters.filter(m => m.isUnlocked).length;

  const handleMonsterClick = (monsterId: string) => {
    selectMonster(monsterId);
    navigate(`/monster/${monsterId}`);
  };

  return (
    <div className="h-full bg-blue-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-[0_6px_0_#ca8a04] border-4 border-yellow-500">
            <Trophy className="w-8 h-8 text-white drop-shadow-md" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">My Collection</h1>
            <p className="text-slate-500 font-bold text-lg">
              <span className="text-blue-500">{unlockedCount}</span> / {allMonsters.length} Monsters
            </p>
          </div>
        </div>

        {/* Lab Button */}
        <button
          onClick={() => navigate('/lab')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-2xl font-black text-xl flex items-center gap-3 btn-toy shadow-[0_6px_0_#7e22ce] border-b-4 border-purple-700 transition-all"
        >
          <FlaskConical size={28} strokeWidth={3} />
          LAB
        </button>
      </div>

      {/* Monster Grid - 2 Column Vertical Scroll */}
      <div className="w-full h-10">
        <div className="grid grid-cols-2 gap-4 pb-4">
          {allMonsters.map((monster) => (
            <MonsterCard
              key={monster.id}
              monster={monster}
              onClick={() => {
                if (monster.isUnlocked) {
                  handleMonsterClick(monster.id);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
