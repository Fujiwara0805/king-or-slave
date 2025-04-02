import AnimatedPlayContent from '@/components/AnimatedPlayContent';

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a0f0f] to-[#2a1f1f] text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <AnimatedPlayContent />
      </div>
    </main>
  );
}