"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crown, Users, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RulesContent() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">ゲームルール</h1>
      </motion.div>

      <ScrollArea className="h-[60vh] rounded-lg border border-yellow-900 p-6 bg-black/30">
        <div className="space-y-8">
          <Card className="bg-black/50 border-yellow-900 p-6">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <Crown className="w-6 h-6" />
              カードの種類と勝敗関係
            </h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-2 text-white">
                <Crown className="w-5 h-5 text-yellow-500" />
                王様：市民に勝ち、奴隷に負ける
              </li>
              <li className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-blue-500" />
                市民：奴隷に勝ち、王様に負ける
              </li>
              <li className="flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-red-500" />
                奴隷：王様に勝ち、市民に負ける
              </li>
            </ul>
          </Card>
          <Card className="bg-black/50 border-yellow-900 p-6">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">ポイントシステム</h2>
            <ul className="space-y-4 text-lg text-white">
              <li>初期ポイント: 1,000点</li>
              <li>勝利条件: 100,000点達成</li>
              <li>敗北条件: 0点になった時</li>
            </ul>
          </Card>

          <Card className="bg-black/50 border-yellow-900 p-6">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">賭けポイントシステム</h2>
            <ul className="space-y-4 text-lg text-white">
              <li>王様チーム:
                <ul className="ml-6 mt-2">
                  <li>勝利：賭けポイントを獲得</li>
                  <li>敗北：賭けポイントを失う</li>
                </ul>
              </li>
              <li>奴隷チーム:
                <ul className="ml-6 mt-2">
                  <li>勝利：賭けポイントの100倍を獲得</li>
                  <li>敗北：賭けポイントの2倍を失う</li>
                </ul>
              </li>
            </ul>
          </Card>

        </div>
      </ScrollArea>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <Link href="/game">
          <Button
            size="lg"
            className="w-64 h-16 text-xl bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white border-2 border-yellow-300"
          >
            ゲームを始める
          </Button>
        </Link>
      </motion.div>
    </>
  );
} 