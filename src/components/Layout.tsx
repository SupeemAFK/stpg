import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen pb-20 relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />

            {/* Content - Centered and constrained */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
