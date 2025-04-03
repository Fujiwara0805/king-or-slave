"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check, Shovel } from 'lucide-react';
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
      className="flex flex-col min-h-[100vh] py-0 overflow-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 sticky top-0 z-10 backdrop-blur-sm bg-[#1a0f0f]/80"
      >
        <h1 className="text-4xl md:text-4xl sm:text-3xl xs:text-2xl font-bold text-center text-yellow-500 mb-2">SELECT TEAM</h1>
        
        <div className="text-center mb-4 mt-4">
          <p className="text-lg md:text-lg sm:text-base xs:text-sm mb-2">現在のポイント</p>
          <p className="text-3xl md:text-3xl sm:text-2xl xs:text-xl font-bold text-yellow-500">{currentPoints.toLocaleString()} px</p>
        </div>
      </motion.div>
      
      <div className="flex-grow flex flex-col justify-between py-4 px-4 md:px-8 lg:px-12 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-6 md:gap-8 sm:gap-6 max-w-2xl mx-auto">
          <Card
            className={`p-6 sm:p-4 xs:p-3 cursor-pointer transition-all ${
              selectedTeam === 'king' 
                ? 'border-4 border-yellow-500 scale-105 bg-yellow-700/30' 
                : 'border border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handleTeamSelect('king')}
          >
            <div className="flex flex-col items-center space-y-4 sm:space-y-3 xs:space-y-2">
              {selectedTeam === 'king' && (
                <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                  <Check className="w-5 h-5 sm:w-4 sm:h-4 xs:w-3 xs:h-3 text-gray-400" />
                </div>
              )}
              <Crown className="w-24 h-24 md:w-24 md:h-24 sm:w-20 sm:h-20 xs:w-16 xs:h-16 text-yellow-500" />
              <h2 className="text-2xl md:text-2xl sm:text-xl xs:text-lg font-bold">KING TEAM</h2>
              <p className="text-gray-400 text-center text-base sm:text-sm xs:text-xs">
                王様カードを持ち、市民を従える
              </p>
              <div className="mt-4 bg-black/30 p-3 sm:p-2 xs:p-2 rounded-lg w-full">
                <p className="text-center text-yellow-200 font-semibold text-base sm:text-sm xs:text-xs">手札構成</p>
                <p className="text-center text-white text-base sm:text-sm xs:text-xs">王様カード × 1</p>
                <p className="text-center text-white text-base sm:text-sm xs:text-xs">市民カード × 4</p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 sm:p-4 xs:p-3 cursor-pointer transition-all ${
              selectedTeam === 'slave' 
                ? 'border-4 border-blue-500 scale-105 bg-blue-700/30' 
                : 'border border-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handleTeamSelect('slave')}
          >
            <div className="flex flex-col items-center space-y-4 sm:space-y-3 xs:space-y-2">
              {selectedTeam === 'slave' && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <Check className="w-5 h-5 sm:w-4 sm:h-4 xs:w-3 xs:h-3 text-gray-400" />
                </div>
              )}
              <Shovel className="w-24 h-24 md:w-24 md:h-24 sm:w-20 sm:h-20 xs:w-16 xs:h-16 text-blue-500" />
              <h2 className="text-2xl md:text-2xl sm:text-xl xs:text-lg font-bold">SLAVE TEAM</h2>
              <p className="text-gray-400 text-center text-base sm:text-sm xs:text-xs">
                奴隷カードを持ち、革命を起こせ
              </p>
              <div className="mt-4 bg-black/30 p-3 sm:p-2 xs:p-2 rounded-lg w-full">
                <p className="text-center text-blue-200 font-semibold text-base sm:text-sm xs:text-xs">手札構成</p>
                <p className="text-center text-white text-base sm:text-sm xs:text-xs">奴隷カード × 1</p>
                <p className="text-center text-white text-base sm:text-sm xs:text-xs">市民カード × 4</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-center mt-8 mb-4">
          <Button
            onClick={handleGameStart}
            disabled={!selectedTeam}
            className={`w-64 sm:w-full max-w-xs h-16 sm:h-14 xs:h-12 text-xl sm:text-lg xs:text-base transition-all ${
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
      </div>
    </motion.div>
  );
} 