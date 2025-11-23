import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Layout from './components/Layout';
import Scanner from './views/Scanner';
import Pokedex from './views/Pokedex';
import MonsterDetail from './views/MonsterDetail';
import Lab from './views/Lab';
import Jam from './views/Jam';

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/monster/:id" element={<MonsterDetail />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/jam" element={<Jam />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}