'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Flame, Zap, ArrowUp, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const RANKING_DATA = [
    { id: 1, name: 'Pedro Silva', level: 42, xp: 8400, streak: 15, avatar: null },
    { id: 2, name: 'Julia Costa', level: 38, xp: 7600, streak: 12, avatar: null },
    { id: 3, name: 'Você', level: 25, xp: 5200, streak: 7, avatar: null, isUser: true },
    { id: 4, name: 'Marcos Braz', level: 22, xp: 4400, streak: 3, avatar: null },
    { id: 5, name: 'Ana Oliveira', level: 19, xp: 3800, streak: 10, avatar: null },
    { id: 6, name: 'Carlos Neto', level: 15, xp: 3200, streak: 0, avatar: null },
];

export default function RankingPage() {
    const top3 = RANKING_DATA.slice(0, 3);
    const others = RANKING_DATA.slice(3);

    return (
        <main className="min-h-screen pb-24 px-4 pt-8 max-w-lg mx-auto bg-gradient-to-b from-background to-background/50">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex p-3 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 mb-4">
                    <Trophy className="w-8 h-8 text-neon-purple" />
                </div>
                <h1 className="text-3xl font-bold">Arena Neural</h1>
                <p className="text-muted-foreground mt-2 text-sm uppercase tracking-widest">Global Leaderboard</p>
            </div>

            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-4 mb-12 h-64">
                {/* 2nd Place */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: '70%', opacity: 1 }} transition={{ delay: 0.2 }}
                    className="flex flex-col items-center flex-1"
                >
                    <div className="relative mb-2">
                        <Avatar className="w-16 h-16 border-2 border-silver shadow-[0_0_15px_rgba(192,192,192,0.3)]">
                            <AvatarFallback>P2</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 bg-silver text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-silver/20 to-silver/5 rounded-t-2xl border-x border-t border-silver/20 flex flex-col items-center pt-4">
                        <span className="text-[10px] font-bold text-silver uppercase tracking-wider">Julia</span>
                        <span className="text-sm font-bold mt-1">Lvl 38</span>
                    </div>
                </motion.div>

                {/* 1st Place */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: '90%', opacity: 1 }} transition={{ delay: 0.1 }}
                    className="flex flex-col items-center flex-1"
                >
                    <div className="relative mb-2">
                        <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-neon-orange drop-shadow-[0_0_10px_#FFAC33]" />
                        <Avatar className="w-20 h-20 border-4 border-neon-orange shadow-[0_0_25px_rgba(255,172,51,0.4)]">
                            <AvatarFallback>P1</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-neon-orange text-black px-2 py-0.5 rounded-full text-[10px] font-black italic">ELITE</div>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-neon-orange/20 to-neon-orange/5 rounded-t-2xl border-x border-t border-neon-orange/20 flex flex-col items-center pt-4">
                        <span className="text-[10px] font-bold text-neon-orange uppercase tracking-wider">Pedro</span>
                        <span className="text-lg font-black mt-1">Lvl 42</span>
                    </div>
                </motion.div>

                {/* 3rd Place - YOU */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: '60%', opacity: 1 }} transition={{ delay: 0.3 }}
                    className="flex flex-col items-center flex-1"
                >
                    <div className="relative mb-2">
                        <Avatar className="w-16 h-16 border-2 border-bronze shadow-[0_0_15px_rgba(205,127,50,0.3)]">
                            <AvatarFallback>P3</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 bg-bronze text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-bronze/20 to-bronze/5 rounded-t-2xl border-x border-t border-bronze/20 flex flex-col items-center pt-4">
                        <span className="text-[10px] font-bold text-neon-purple uppercase tracking-wider italic">Você</span>
                        <span className="text-sm font-bold mt-1">Lvl 25</span>
                    </div>
                </motion.div>
            </div>

            {/* Others List */}
            <div className="space-y-3">
                {others.map((player) => (
                    <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className={`p-4 flex items-center justify-between glass border-white/5 ${player.isUser ? 'border-neon-green/20 bg-neon-green/5' : ''}`}>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-muted-foreground w-4">{player.id}</span>
                                <Avatar className="w-10 h-10 border border-white/10">
                                    <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="text-sm font-bold flex items-center gap-2">
                                        {player.name}
                                        {player.streak > 5 && <Flame className="w-3 h-3 text-neon-orange" />}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Level {player.level} • {player.xp} XP</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1 text-neon-green text-xs font-bold">
                                    <ArrowUp className="w-3 h-3" /> 2 pos
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">{player.streak}d streak</div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* My Performance Card */}
            <Card className="mt-8 p-6 bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 border-neon-purple/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-neon-purple flex items-center justify-center">
                        <Zap className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                        <h4 className="font-bold">Sua Performance</h4>
                        <p className="text-xs text-muted-foreground">Top 15% dos usuários esta semana</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black text-neon-purple">+450 XP</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Hoje</div>
                </div>
            </Card>
        </main>
    );
}
