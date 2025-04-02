"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, User, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { INITIAL_POINTS } from '@/app/constants/game';

// チームの型を明示的に定義
type Team = 'king' | 'slave';

export default function TeamSelectContent() {
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const router = useRouter();
  const [currentPoints, setCurrentPoints] = useState<number>(INITIAL_POINTS);

  useEffect(() => {
    // セッションストレージから現在のポイントを取得
    const savedPoints = sessionStorage.getItem('points');
    if (savedPoints) {
      setCurrentPoints(parseInt(savedPoints));
    }
  }, []);

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
  };

  const handleGameStart = () => {
    if (!selectedTeam) return;
    // チーム情報を保存
    sessionStorage.setItem('team', selectedTeam);
    // 現在のポイントを保持
    if (!sessionStorage.getItem('points')) {
      sessionStorage.setItem('points', INITIAL_POINTS.toString());
    }
    
    // ラウンドを1に設定
    sessionStorage.setItem('round', '1');
    
    // カード状態を明示的にリセット
    sessionStorage.removeItem('cardStates');
    
    router.push('/game/bet');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">チームを選択</h1>
      
      <div className="text-center mb-6">
        <p className="text-lg mb-2">現在のポイント</p>
        <p className="text-3xl font-bold text-yellow-500">{currentPoints.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Card
          className={`p-6 cursor-pointer transition-all ${
            selectedTeam === 'king' 
              ? 'border-4 border-yellow-500 scale-105 bg-yellow-900/30' 
              : 'border border-gray-700 hover:border-gray-500'
          }`}
          onClick={() => handleTeamSelect('king')}
        >
          <div className="flex flex-col items-center space-y-4">
            {selectedTeam === 'king' && (
              <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                <Check className="w-5 h-5 text-black" />
              </div>
            )}
            <Crown className="w-24 h-24 text-yellow-500" />
            <h2 className="text-2xl font-bold">王様チーム</h2>
            <p className="text-gray-400 text-center">
              王様カードを持ち、市民を従えるチーム
            </p>
            <div className="mt-4 bg-black/30 p-3 rounded-lg w-full">
              <p className="text-center text-yellow-200 font-semibold">手札構成</p>
              <p className="text-center text-white">王様カード × 1</p>
              <p className="text-center text-white">市民カード × 4</p>
            </div>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all ${
            selectedTeam === 'slave' 
              ? 'border-4 border-blue-500 scale-105 bg-blue-900/30' 
              : 'border border-gray-700 hover:border-gray-500'
          }`}
          onClick={() => handleTeamSelect('slave')}
        >
          <div className="flex flex-col items-center space-y-4">
            {selectedTeam === 'slave' && (
              <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                <Check className="w-5 h-5 text-black" />
              </div>
            )}
            <User className="w-24 h-24 text-blue-500" />
            <h2 className="text-2xl font-bold">奴隷チーム</h2>
            <p className="text-gray-400 text-center">
              奴隷カードを持ち、王様に挑むチーム
            </p>
            <div className="mt-4 bg-black/30 p-3 rounded-lg w-full">
              <p className="text-center text-blue-200 font-semibold">手札構成</p>
              <p className="text-center text-white">奴隷カード × 1</p>
              <p className="text-center text-white">市民カード × 4</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleGameStart}
          disabled={!selectedTeam}
          className={`w-64 h-16 text-xl transition-all ${
            selectedTeam === 'king' 
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400' 
              : selectedTeam === 'slave'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
                : 'bg-gradient-to-r from-gray-600 to-gray-500'
          }`}
        >
          ゲーム開始
        </Button>
      </div>
    </motion.div>
  );
} 