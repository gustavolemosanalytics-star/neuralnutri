'use client';

import { motion } from 'framer-motion';
import { Flame, Zap, TrendingUp, Minus, Equal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DashboardHeaderProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streakDays: number;
  targetKcal: number;
  exerciseKcal: number;
  eatenKcal: number;
  userName?: string;
}

// XP needed per level (increases exponentially)
export function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function DashboardHeader({
  level,
  currentXP,
  xpToNextLevel,
  streakDays,
  targetKcal,
  exerciseKcal,
  eatenKcal,
  userName = 'Atleta',
}: DashboardHeaderProps) {
  const xpProgress = (currentXP / xpToNextLevel) * 100;
  const totalBudget = targetKcal + exerciseKcal;
  const remaining = totalBudget - eatenKcal;
  const isOverBudget = remaining < 0;

  return (
    <div className="space-y-4">
      {/* Top Row: Level, XP, Streak */}
      <div className="flex items-center justify-between gap-4">
        {/* Level Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <motion.div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center glow-purple"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl font-bold text-white text-glow">{level}</span>
            </motion.div>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
              <TrendingUp className="w-4 h-4 text-neon-green" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Nível</span>
            <span className="font-semibold text-foreground">{userName}</span>
          </div>
        </motion.div>

        {/* XP Progress */}
        <div className="flex-1 max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-neon-green" />
              <span className="text-xs text-muted-foreground">XP</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {currentXP} / {xpToNextLevel}
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={xpProgress} 
              className="h-3 bg-muted"
            />
            <motion.div
              className="absolute inset-0 h-3 rounded-full overflow-hidden"
              initial={false}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full animate-xp-pulse"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
        </div>

        {/* Streak Flame */}
        <StreakFlame days={streakDays} />
      </div>

      {/* Calorie Equation Card */}
      <Card className="p-4 glass border-border/50">
        <div className="flex items-center justify-between gap-2 text-sm">
          {/* Meta Base */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">Meta Base</span>
            <motion.span 
              className="text-lg font-bold text-foreground"
              key={targetKcal}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {targetKcal.toLocaleString()}
            </motion.span>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>

          {/* Plus Sign */}
          <div className="text-neon-blue text-xl font-bold">+</div>

          {/* Exercise Burn */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">Treino</span>
            <motion.span 
              className="text-lg font-bold text-neon-blue"
              key={exerciseKcal}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {exerciseKcal.toLocaleString()}
            </motion.span>
            <span className="text-xs text-neon-blue/70">kcal</span>
          </div>

          {/* Minus Sign */}
          <Minus className="w-5 h-5 text-muted-foreground" />

          {/* Eaten */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">Comido</span>
            <motion.span 
              className={`text-lg font-bold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}
              key={eatenKcal}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {eatenKcal.toLocaleString()}
            </motion.span>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>

          {/* Equals Sign */}
          <Equal className="w-5 h-5 text-muted-foreground" />

          {/* Remaining */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">Disponível</span>
            <motion.span 
              className={`text-xl font-bold ${
                isOverBudget 
                  ? 'text-destructive' 
                  : remaining < 200 
                    ? 'text-neon-orange' 
                    : 'text-neon-green'
              }`}
              key={remaining}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {remaining.toLocaleString()}
            </motion.span>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>
        </div>

        {/* Visual Budget Bar */}
        <div className="mt-4 relative h-4 rounded-full bg-muted overflow-hidden">
          {/* Base target */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: `${(targetKcal / totalBudget) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
          {/* Exercise bonus zone */}
          <motion.div
            className="absolute inset-y-0 bg-gradient-to-r from-neon-blue/40 to-neon-blue/20"
            style={{ left: `${(targetKcal / totalBudget) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(exerciseKcal / totalBudget) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          {/* Eaten progress */}
          <motion.div
            className={`absolute inset-y-0 left-0 ${
              isOverBudget 
                ? 'bg-gradient-to-r from-destructive to-destructive/80' 
                : 'bg-gradient-to-r from-neon-green to-neon-green/80'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((eatenKcal / totalBudget) * 100, 100)}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>0</span>
          <span>Orçamento: {totalBudget.toLocaleString()} kcal</span>
        </div>
      </Card>
    </div>
  );
}

// Streak Flame Component
interface StreakFlameProps {
  days: number;
}

function StreakFlame({ days }: StreakFlameProps) {
  const isActive = days > 0;
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <motion.div
          className={`relative ${isActive ? 'animate-flame' : ''}`}
          whileHover={{ scale: 1.1 }}
        >
          <Flame 
            className={`w-10 h-10 ${
              isActive 
                ? 'text-neon-orange drop-shadow-[0_0_8px_rgba(255,140,0,0.8)]' 
                : 'text-muted-foreground'
            }`}
            fill={isActive ? 'currentColor' : 'none'}
          />
          {isActive && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Flame 
                className="w-10 h-10 text-yellow-400 opacity-50"
                fill="currentColor"
              />
            </motion.div>
          )}
        </motion.div>
        
        {/* Streak count */}
        <Badge 
          variant="secondary"
          className={`absolute -bottom-2 -right-2 min-w-[24px] h-6 flex items-center justify-center text-xs font-bold ${
            isActive 
              ? 'bg-neon-orange text-background' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {days}
        </Badge>
      </div>
      <span className="text-xs text-muted-foreground mt-2">Streak</span>
    </motion.div>
  );
}

export default DashboardHeader;
