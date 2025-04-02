"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crown, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Team } from '@/app/types/game';

export default function AnimatedGameContent() {
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const router = useRouter();

  const handleGameStart = () => {
    sessionStorage.removeItem('cardStates');
    sessionStorage.removeItem('points');
    
    if (selectedTeam) {
      try {
        router.push(`/game/bet?team=${selectedTeam}&round=1`);
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback navigation
        window.location.href = `/game/bet?team=${selectedTeam}&round=1`;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">チームを選択</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card 
          className={`bg-black/50 border-2 border-yellow-900 p-6 cursor-pointer transition-all hover:border-yellow-500 ${
            selectedTeam === 'king' ? 'border-yellow-500' : ''
          }`}
          onClick={() => setSelectedTeam('king')}
        >
          <div className="flex flex-col items-center space-y-4">
            <Crown className="w-16 h-16 text-yellow-500" />
            <h2 className="text-2xl font-bold text-yellow-500">王様チーム</h2>
            <p className="text-white text-center">王様1枚 + 市民4枚</p>
          </div>
        </Card>

        <Card 
          className={`bg-black/50 border-2 border-yellow-900 p-6 cursor-pointer transition-all hover:border-red-500 ${
            selectedTeam === 'slave' ? 'border-red-500' : ''
          }`}
          onClick={() => setSelectedTeam('slave')}
        >
          <div className="flex flex-col items-center space-y-4">
            <User className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-bold text-red-500">奴隷チーム</h2>
            <p className="text-white text-center">奴隷1枚 + 市民4枚</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          size="lg"
          onClick={handleGameStart}
          disabled={!selectedTeam}
          className="w-64 h-16 text-xl bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white border-2 border-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ゲームスタート
        </Button>
      </div>
    </motion.div>
  );
}