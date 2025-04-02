"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GameLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function GameLayout({ children, title }: GameLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {title && (
        <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">
          {title}
        </h1>
      )}
      {children}
    </motion.div>
  );
} 