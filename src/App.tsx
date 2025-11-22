import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';
import Scanner from './views/Scanner';
import Pokedex from './views/Pokedex';
import MonsterDetail from './views/MonsterDetail';
import Lab from './views/Lab';
import Jam from './views/Jam';
import type { ViewType } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('scanner');
  const { selectMonster } = useGame();

  const handleNavigateToDetail = (monsterId: string, view: ViewType) => {
    selectMonster(monsterId);
    setCurrentView(view);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <>
      <Layout>
        {currentView === 'scanner' && <Scanner />}
        {currentView === 'pokedex' && (
          <Pokedex onNavigateToDetail={handleNavigateToDetail} />
        )}
        {currentView === 'detail' && (
          <MonsterDetail onNavigate={handleViewChange} />
        )}
        {currentView === 'lab' && <Lab />}
        {currentView === 'jam' && <Jam />}
      </Layout>

      <BottomNav currentView={currentView} onViewChange={handleViewChange} />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}