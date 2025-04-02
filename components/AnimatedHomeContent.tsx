"use client";

import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AnimatedHomeContent() {
  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Crown className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
        <h1 className="text-6xl font-bold text-yellow-500 mb-4">King or Slave</h1>
        <p className="text-xl text-yellow-100 mb-8">運と戦略が織りなす究極の勝負</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8"
      >
        <Link href="/rules">
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