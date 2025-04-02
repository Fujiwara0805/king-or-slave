"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, XCircle } from 'lucide-react';
import Link from 'next/link';
import { WIN_THRESHOLD } from '@/app/constants/game';

export default function AnimatedResultContent() {
  const points = parseInt(sessionStorage.getItem('points') || '0');
  const isWin = points >= WIN_THRESHOLD;
  const isLose = points <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      >
        {isWin && <Trophy className="w-32 h-32 mx-auto text-yellow-500" />}
        {isLose && <XCircle className="w-32 h-32 mx-auto text-red-500" />}
        {!isWin && !isLose && <Crown className="w-32 h-32 mx-auto text-yellow-500" />}
      </motion.div>

      <h1 className="text-6xl font-bold mb-8">
        {isWin && <span className="text-yellow-500">勝利！</span>}
        {isLose && <span className="text-red-500">敗北...</span>}
        {!isWin && !isLose && <span className="text-yellow-500">ゲーム終了</span>}
      </h1>

      <p className="text-2xl mb-8">
        最終ポイント: <span className="font-bold text-yellow-500">{points.toLocaleString()}</span>
      </p>

      <Link href="/">
        <Button
          size="lg"
          className="w-64 h-16 text-xl bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white border-2 border-yellow-300"
        >
          タイトルへ戻る
        </Button>
      </Link>
    </motion.div>
  );
}