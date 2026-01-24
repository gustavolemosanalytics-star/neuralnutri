'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, ClipboardList, User, Award, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
    { icon: ClipboardList, label: 'Portal', href: '/nutri-portal' },
    { icon: User, label: 'Perfil', href: '/perfil' },
    { icon: Award, label: 'Rank', href: '/ranking' },
];

export function BottomNav() {
    const pathname = usePathname();

    // Don't show on onboarding
    if (pathname === '/anamnese' || pathname === '/') return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t border-white/5 px-6 pb-2 z-40 flex items-center justify-between max-w-lg mx-auto rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-1 min-w-[64px] relative">
                        {isActive && (
                            <motion.div
                                layoutId="nav-active"
                                className="absolute -top-3 w-12 h-1 bg-neon-green rounded-full shadow-[0_0_10px_#39FF14]"
                            />
                        )}
                        <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-neon-green' : 'text-muted-foreground'}`} />
                        <span className={`text-[10px] font-medium uppercase tracking-tighter ${isActive ? 'text-neon-green' : 'text-muted-foreground'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
