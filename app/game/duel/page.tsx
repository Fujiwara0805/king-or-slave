import { Suspense } from 'react';
import DuelContent from '@/components/game/DuelContent';

export default function DuelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a0f0f] to-[#2a1f1f] text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-yellow-500 text-2xl font-bold">読み込み中...</div>
          </div>
        }>
          <DuelContent />
        </Suspense>
      </div>
    </main>
  );
}