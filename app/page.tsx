import HomeContent from '@/components/game/HomeContent';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a0f0f] to-[#2a1f1f] text-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <HomeContent />
      </div>
    </main>
  );
}