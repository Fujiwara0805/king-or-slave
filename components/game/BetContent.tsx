"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_POINTS } from '@/app/constants/game';

export default function BetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const team = searchParams.get('team');
  const round = parseInt(searchParams.get('round') || '1');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [currentPoints, setCurrentPoints] = useState<number>(INITIAL_POINTS);

  useEffect(() => {
    // セッションストレージから現在のポイントを取得
    const savedPoints = sessionStorage.getItem('points');
    if (savedPoints) {
      setCurrentPoints(parseInt(savedPoints));
    }
  }, []);

  const handleBet = () => {
    const currentTeam = team || sessionStorage.getItem('team') as string;
    console.log('BetContent - 次の画面に渡すチーム:', currentTeam); // デバッグ用
    
    router.push(`/game/play?team=${currentTeam}&bet=${betAmount}&round=${round}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">
        賭けポイントを設定
      </h1>

      <div className="max-w-md mx-auto bg-gray-800/50 border border-yellow-900 rounded-lg p-8">
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg mb-2">現在のポイント</p>
            <p className="text-3xl font-bold text-yellow-500">{currentPoints.toLocaleString()}</p>
            <p className="text-2xl font-bold text-yellow-500 mt-4">
              {betAmount.toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              賭けポイント
            </label>
            <Slider
              defaultValue={[100]}
              max={currentPoints}
              min={100}
              step={100}
              className="w-full [&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-600 [&_[role=track]]:bg-yellow-500 [&_[role=track].[data-state=inactive]]:bg-yellow-500/20"
              onValueChange={(value) => setBetAmount(value[0])}
              value={[betAmount]}
            />
          </div>

          <Button
            onClick={handleBet}
            disabled={!betAmount || betAmount > currentPoints}
            className="w-full h-12 text-lg bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400"
          >
            決定
          </Button>
        </div>
      </div>
    </motion.div>
  );
}