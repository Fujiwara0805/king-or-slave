"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_POINTS } from '@/app/constants/game';
import { toast } from 'sonner';
import { Team } from '@/app/types/game';

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
      const points = parseInt(savedPoints);
      setCurrentPoints(points);
      
      // 奴隷チームの場合は最大賭け金を半分に制限
      const savedTeam = sessionStorage.getItem('team') as Team;
      const currentTeam = team || savedTeam;
      
      if (currentTeam === 'slave') {
        const maxBet = Math.floor(points / 2);
        // 現在の賭け金が最大値を超えていたら調整
        if (betAmount > maxBet) {
          setBetAmount(maxBet);
        }
      }
    }
  }, [team]);

  const handleBet = () => {
    const currentTeam = team || sessionStorage.getItem('team') as string;
    
    router.push(`/game/play?team=${currentTeam}&bet=${betAmount}&round=${round}`);
  };

  // スライダーの最大値を計算
  const getMaxBet = () => {
    const savedTeam = sessionStorage.getItem('team') as Team;
    const currentTeam = team || savedTeam;
    
    return currentTeam === 'slave' ? Math.floor(currentPoints / 2) : currentPoints;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-[100vh] py-0"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 sticky top-0 z-10  backdrop-blur-sm"
      >
        <h1 className="text-4xl md:text-4xl sm:text-3xl xs:text-2xl font-bold text-center text-yellow-500  mt-4">
          BET POINTS
        </h1>
      </motion.div>

      <div className="flex-grow flex flex-col justify-center items-center px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-md mx-auto bg-gray-400/40 border-gray-500 rounded-lg p-8 sm:p-6 xs:p-4 bg-[url('/paper-texture.png')] bg-blend-multiply">
          <div className="space-y-8 sm:space-y-6 xs:space-y-4">
            <div className="text-center">
              <p className="text-xl md:text-xl sm:text-lg xs:text-base mb-2 font-bold text-amber-100">現在のポイント</p>
              <p className="text-4xl md:text-4xl sm:text-3xl xs:text-2xl font-bold text-yellow-500">{currentPoints.toLocaleString()} px</p>
              <p className="text-3xl md:text-3xl sm:text-2xl xs:text-xl font-bold text-yellow-500 mt-6 sm:mt-4 xs:mt-3">
                {betAmount.toLocaleString()} px
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-lg md:text-lg sm:text-base xs:text-sm font-bold text-amber-100">
                賭けポイント
              </label>
              <Slider
                defaultValue={[100]}
                max={getMaxBet()}
                min={100}
                step={100}
                className="w-full [&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-600 [&_[role=track]]:bg-yellow-500 [&_[role=track].[data-state=inactive]]:bg-yellow-500/20"
                onValueChange={(value) => setBetAmount(value[0])}
                value={[betAmount]}
              />
            </div>

            {team === 'slave' && (
              <div className="mt-2 p-2 bg-red-900/30 border border-red-800 rounded-md">
                <p className="text-red-300 text-sm">
                  ※奴隷チームは敗北時に賭けポイントの2倍が減少します。
                  最大賭け金は現在のポイントの半分までです。
                </p>
              </div>
            )}

            <Button
              onClick={handleBet}
              disabled={!betAmount || betAmount > currentPoints}
              className="w-full h-16 sm:h-14 xs:h-12 text-xl sm:text-lg xs:text-base bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white border-2 border-yellow-300"
            >
              決定
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}