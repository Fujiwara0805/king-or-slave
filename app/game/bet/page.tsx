import BetContent from '@/components/game/BetContent';

export default function BetPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a0f0f] to-[#2a1f1f] text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <BetContent />
      </div>
    </main>
  );
}