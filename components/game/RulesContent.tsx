"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crown, Users, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RulesContent() {
  return (
    <div className="flex flex-col items-center justify-between min-h-[100vh] py-0">
      <div className="w-full flex-grow flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-4 sticky top-0 z-10  backdrop-blur-sm"
        >
          <h1 className="text-4xl md:text-4xl sm:text-3xl xs:text-2xl font-bold text-center text-yellow-500 mb-2">GAME RULES</h1>
        </motion.div>

        <ScrollArea className="flex-grow w-full rounded-lg border-0 p-6 sm:p-4 xs:p-3 ">
          <div className="space-y-8 sm:space-y-6 xs:space-y-4">
            <Card className="bg-amber-900/40 border-amber-800 p-6 sm:p-4 xs:p-3 bg-[url('/paper-texture.png')] bg-blend-multiply">
              <h2 className="text-2xl sm:text-xl xs:text-lg font-bold text-yellow-500 mb-4 sm:mb-3 xs:mb-2 flex items-center gap-2">
                <Crown className="w-6 h-6 sm:w-5 sm:h-5 xs:w-4 xs:h-4" />
                カード種類と勝敗
              </h2>
              <ul className="space-y-4 sm:space-y-3 xs:space-y-2 text-lg sm:text-base xs:text-sm">
                <li className="flex items-center gap-2 text-amber-100">
                  <Crown className="w-5 h-5 sm:w-4 sm:h-4 xs:w-3 xs:h-3 text-yellow-500" />
                  <span className="xs:text-xs sm:text-sm">王様：市民に勝ち、奴隷に負ける</span>
                </li>
                <li className="flex items-center gap-2 text-amber-100">
                  <Users className="w-5 h-5 sm:w-4 sm:h-4 xs:w-3 xs:h-3 text-blue-500" />
                  <span className="xs:text-xs sm:text-sm">市民：奴隷に勝ち、王様に負ける</span>
                </li>
                <li className="flex items-center gap-2 text-amber-100">
                  <User className="w-5 h-5 sm:w-4 sm:h-4 xs:w-3 xs:h-3 text-red-500" />
                  <span className="xs:text-xs sm:text-sm">奴隷：王様に勝ち、市民に負ける</span>
                </li>
              </ul>
            </Card>
            <Card className="bg-amber-900/40 border-amber-800 p-6 sm:p-4 xs:p-3 bg-[url('/paper-texture.png')] bg-blend-multiply">
              <h2 className="text-2xl sm:text-xl xs:text-lg font-bold text-yellow-500 mb-4 sm:mb-3 xs:mb-2">ポイント</h2>
              <ul className="space-y-4 sm:space-y-3 xs:space-y-2 text-lg sm:text-base xs:text-sm text-amber-100">
                <li className="xs:text-xs sm:text-sm">初期ポイント: 1,000点</li>
                <li className="xs:text-xs sm:text-sm">勝利条件: 100,000点達成</li>
                <li className="xs:text-xs sm:text-sm">敗北条件: 0点になった時</li>
              </ul>
            </Card>

            <Card className="bg-amber-900/40 border-amber-800 p-6 sm:p-4 xs:p-3 bg-[url('/paper-texture.png')] bg-blend-multiply">
              <h2 className="text-2xl sm:text-xl xs:text-lg font-bold text-yellow-500 mb-4 sm:mb-3 xs:mb-2">賭けポイント</h2>
              <ul className="space-y-4 sm:space-y-3 xs:space-y-2 text-lg sm:text-base xs:text-sm text-amber-100">
                <li className="xs:text-xs sm:text-sm">
                  王様チーム:
                  <ul className="ml-6 mt-2 sm:ml-4 xs:ml-3 sm:mt-1">
                    <li>勝利：賭けポイント獲得</li>
                    <li>敗北：賭けポイント損失</li>
                  </ul>
                </li>
                <li className="xs:text-xs sm:text-sm">
                  奴隷チーム:
                  <ul className="ml-6 mt-2 sm:ml-4 xs:ml-3 sm:mt-1">
                    <li>勝利：賭けポイント×100倍</li>
                    <li>敗北：賭けポイント×2倍損失</li>
                  </ul>
                </li>
              </ul>
            </Card>
          </div>
        </ScrollArea>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs px-4 mb-2 mt-4"
      >
        <Link href="/game" className="block w-full">
          <Button
            size="lg"
            className="w-full h-16 sm:h-14 xs:h-12 text-xl sm:text-lg xs:text-base bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white border-2 border-yellow-300"
          >
            ゲームを始める
          </Button>
        </Link>
      </motion.div>
    </div>
  );
} 