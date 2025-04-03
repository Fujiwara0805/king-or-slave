"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Trophy, Frown, RotateCcw } from 'lucide-react';

export default function ResultContent() {
  const router = useRouter();
  const [finalPoints, setFinalPoints] = useState<number>(0);
  const [isGameClear, setIsGameClear] = useState<boolean>(false);

  useEffect(() => {
    // セッションストレージから最終ポイントを取得
    const savedPoints = sessionStorage.getItem('points');
    
    if (savedPoints) {
      const points = parseInt(savedPoints);
      
      setFinalPoints(points);
      setIsGameClear(points >= 100000);
      
      // 確認のため、状態更新後に再度ログ出力
      setTimeout(() => {
      }, 100);
    }
  }, []);

  const handlePlayAgain = () => {
    // ゲームをリセットして最初の画面に戻る
    sessionStorage.removeItem('points');
    sessionStorage.removeItem('team');
    sessionStorage.removeItem('cardStates');
    sessionStorage.removeItem('round');
    router.push('/rules');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 md:space-y-12 sm:space-y-10 xs:space-y-6 text-center px-4 py-6 min-h-[100vh] flex flex-col justify-center"
    >
      {isGameClear ? (
        // ゲームクリア画面
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex flex-col items-center"
          >
            <Trophy className="w-20 h-20 md:w-32 md:h-32 sm:w-24 sm:h-24 xs:w-16 xs:h-16 text-yellow-500 mb-2 md:mb-4 sm:mb-3 xs:mb-2" />
            <h1 className="text-3xl md:text-6xl sm:text-5xl xs:text-4xl font-bold text-yellow-500 mb-2 md:mb-4 sm:mb-3 xs:mb-2">CONGRATULATION!!</h1>
            <p className="text-lg md:text-2xl sm:text-xl xs:text-base text-gray-300 mb-4 md:mb-8 sm:mb-6 xs:mb-4">
              目標の100,000ポイントを達成しました！
            </p>
            <div className="bg-black/50 p-4 md:p-6 sm:p-5 xs:p-3 rounded-lg border border-yellow-500 mb-4 md:mb-8 sm:mb-6 xs:mb-4 w-full max-w-sm">
              <p className="text-base md:text-xl sm:text-lg xs:text-base text-gray-400">最終スコア</p>
              <p className="text-3xl md:text-5xl sm:text-4xl xs:text-3xl font-bold text-yellow-500">{finalPoints.toLocaleString()} ポイント</p>
            </div>
          </motion.div>
        </>
      ) : (
        // ゲームオーバー画面
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex flex-col items-center"
          >
            <Frown className="w-20 h-20 md:w-32 md:h-32 sm:w-24 sm:h-24 xs:w-16 xs:h-16 text-red-500 mb-2 md:mb-4 sm:mb-3 xs:mb-2" />
            <h1 className="text-3xl md:text-6xl sm:text-5xl xs:text-4xl font-bold text-red-500 mb-2 md:mb-4 sm:mb-3 xs:mb-2">GAME OVER</h1>
            <p className="text-lg md:text-2xl sm:text-xl xs:text-base text-gray-300 mb-4 md:mb-8 sm:mb-6 xs:mb-4">
              残念ながらポイントがなくなりました
            </p>
            <div className="bg-black/50 p-4 md:p-6 sm:p-5 xs:p-3 rounded-lg border border-red-500 mb-4 md:mb-8 sm:mb-6 xs:mb-4 w-full max-w-sm">
              <p className="text-base md:text-xl sm:text-lg xs:text-base text-gray-400">最終スコア</p>
              <p className="text-3xl md:text-5xl sm:text-4xl xs:text-3xl font-bold text-red-500">{finalPoints.toLocaleString()} ポイント</p>
            </div>
          </motion.div>
        </>
      )}

      <div className="flex justify-center mt-4">
        <Button
          onClick={handlePlayAgain}
          className="w-48 md:w-64 sm:w-56 xs:w-40 h-12 md:h-16 sm:h-14 xs:h-10 text-base md:text-xl sm:text-lg xs:text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 md:w-6 md:h-6 sm:w-5 sm:h-5 xs:w-4 xs:h-4" />
          再度プレイする
        </Button>
      </div>
    </motion.div>
  );
} 