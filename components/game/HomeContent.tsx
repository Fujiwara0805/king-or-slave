"use client";

import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-between min-h-[90vh] py-8">
      <div className="flex-grow flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Crown className="w-24 h-24 md:w-24 md:h-24 sm:w-20 sm:h-20 xs:w-16 xs:h-16 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-6xl md:text-6xl sm:text-5xl xs:text-4xl font-bold text-yellow-500 mb-4">King or Slave</h1>
          <p className="text-xl md:text-xl sm:text-lg xs:text-base text-yellow-100">運と戦略が織りなす究極の勝負</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs px-4 mt-8"
      >
        <Link href="/rules" className="block w-full">
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