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
        console.log('ResultContent - 状態更新後のisGameClear:', isGameClear);
        console.log('ResultContent - 状態更新後のfinalPoints:', finalPoints);
      }, 100);
    }
  }, []);

  const handlePlayAgain = () => {
    // ゲームをリセットして最初の画面に戻る
    sessionStorage.removeItem('points');
    sessionStorage.removeItem('team');
    sessionStorage.removeItem('cardStates');
    sessionStorage.removeItem('round');
    router.push('/game');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 text-center"
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
            <Trophy className="w-32 h-32 text-yellow-500 mb-4" />
            <h1 className="text-6xl font-bold text-yellow-500 mb-4">コングラチュレーション！</h1>
            <p className="text-2xl text-gray-300 mb-8">
              目標の100,000ポイントを達成しました！
            </p>
            <div className="bg-black/50 p-6 rounded-lg border border-yellow-500 mb-8">
              <p className="text-xl text-gray-400">最終スコア</p>
              <p className="text-5xl font-bold text-yellow-500">{finalPoints.toLocaleString()} ポイント</p>
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
            <Frown className="w-32 h-32 text-red-500 mb-4" />
            <h1 className="text-6xl font-bold text-red-500 mb-4">ゲームオーバー</h1>
            <p className="text-2xl text-gray-300 mb-8">
              残念ながらポイントがなくなりました
            </p>
            <div className="bg-black/50 p-6 rounded-lg border border-red-500 mb-8">
              <p className="text-xl text-gray-400">最終スコア</p>
              <p className="text-5xl font-bold text-red-500">{finalPoints.toLocaleString()} ポイント</p>
            </div>
          </motion.div>
        </>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handlePlayAgain}
          className="w-64 h-16 text-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-6 h-6" />
          再度プレイする
        </Button>
      </div>
    </motion.div>
  );
} 