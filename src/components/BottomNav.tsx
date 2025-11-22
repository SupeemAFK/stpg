import { Radar, BookOpen, FlaskConical, Music, Scan } from 'lucide-react';
import type { ViewType } from '../types';

interface BottomNavProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

const navItems = [
    { id: 'scanner' as ViewType, icon: Scan, label: 'Scanner' },
    { id: 'pokedex' as ViewType, icon: BookOpen, label: 'Pokédex' },
    { id: 'detail' as ViewType, icon: Radar, label: 'Detail' },
    { id: 'lab' as ViewType, icon: FlaskConical, label: 'Lab' },
    { id: 'jam' as ViewType, icon: Music, label: 'Jam' },
];

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t-4 border-red-500 shadow-2xl z-50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                className={`
                  flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl
                  transition-all duration-300 min-w-[64px] relative
                  ${isActive
                                        ? 'bg-gradient-to-br from-red-600 to-red-700 text-white scale-110 glow-red animate-bounce-in'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'
                                    }
                `}
                            >
                                <Icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2.5} />
                                <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'animate-neon-pulse' : ''}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
