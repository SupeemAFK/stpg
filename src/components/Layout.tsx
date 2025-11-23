import type { ReactNode } from 'react';
import MonitorFrame from './MonitorFrame';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <MonitorFrame>
            <div className="h-full relative overflow-hidden bg-white">
                {/* Content - Centered and constrained */}
                <div className="relative z-10 h-full overflow-y-auto scrollbar-hide">
                    {children}
                </div>
            </div>
        </MonitorFrame>
    );
}
