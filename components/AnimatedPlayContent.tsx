"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Team, Card as GameCard, CardType, GameState } from '@/app/types/game';
import { INITIAL_POINTS, WIN_THRESHOLD, SLAVE_WIN_MULTIPLIER, SLAVE_LOSE_MULTIPLIER, CARD_IMAGES } from '@/app/constants/game';

export default function AnimatedPlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const team = searchParams.get('team') as Team;
  const [gameState, setGameState] = useState<GameState>({
    points: INITIAL_POINTS,
    team,
    betAmount: 100,
    round: 1,
    cards: [],
    gameOver: false
  });

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const cards: GameCard[] = [];
    if (team === 'king') {
      cards.push({ id: '1', type: 'king', image: CARD_IMAGES.king });
      for (let i = 0; i < 4; i++) {
        cards.push({ id: `${i + 2}`, type: 'citizen', image: CARD_IMAGES.citizen });
      }
    } else {
      cards.push({ id: '1', type: 'slave', image: CARD_IMAGES.slave });
      for (let i = 0; i < 4; i++) {
        cards.push({ id: `${i + 2}`, type: 'citizen', image: CARD_IMAGES.citizen });
      }
    }
    setGameState(prev => ({ ...prev, cards: shuffleCards(cards) }));
  };

  const shuffleCards = (cards: GameCard[]) => {
    return [...cards].sort(() => Math.random() - 0.5);
  };

  const selectCard = (card: GameCard) => {
    if (gameState.selectedCard || gameState.result) return;
    
    const updatedCards = gameState.cards.map(c => 
      c.id === card.id ? { ...c, selected: true } : { ...c, selected: false }
    );
    
    setGameState(prev => ({ ...prev, selectedCard: card, cards: updatedCards }));
  };

  const determineWinner = (playerCard: CardType, cpuCard: CardType): 'win' | 'lose' | 'draw' => {
    if (playerCard === cpuCard) return 'draw';
    if (
      (playerCard === 'king' && cpuCard === 'citizen') ||
      (playerCard === 'citizen' && cpuCard === 'slave') ||
      (playerCard === 'slave' && cpuCard === 'king')
    ) return 'win';
    return 'lose';
  };

  const playTurn = () => {
    if (!gameState.selectedCard || gameState.betAmount <= 0) return;

    const cpuCards: CardType[] = ['king', 'citizen', 'slave'];
    const cpuCard: GameCard = {
      id: 'cpu',
      type: cpuCards[Math.floor(Math.random() * cpuCards.length)],
      image: CARD_IMAGES[cpuCards[Math.floor(Math.random() * cpuCards.length)]]
    };

    const result = determineWinner(gameState.selectedCard.type, cpuCard.type);
    let pointsChange = gameState.betAmount;

    if (result === 'win') {
      if (team === 'slave') pointsChange *= SLAVE_WIN_MULTIPLIER;
      toast.success(`勝利！ +${pointsChange}ポイント`);
    } else if (result === 'lose') {
      if (team === 'slave') pointsChange *= SLAVE_LOSE_MULTIPLIER;
      pointsChange *= -1;
      toast.error(`敗北... ${pointsChange}ポイント`);
    } else {
      pointsChange = 0;
      toast.info('引き分け');
    }

    const newPoints = gameState.points + pointsChange;
    const gameOver = newPoints <= 0 || newPoints >= WIN_THRESHOLD;

    setGameState(prev => ({
      ...prev,
      points: newPoints,
      cpuCard,
      result,
      round: prev.round + 1,
      gameOver
    }));
  };

  const nextRound = () => {
    if (gameState.gameOver) {
      router.push('/');
      return;
    }

    setGameState(prev => ({
      ...prev,
      selectedCard: undefined,
      cpuCard: undefined,
      result: undefined,
      cards: shuffleCards(prev.cards.map(c => ({ ...c, selected: false })))
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">
        {team === 'king' ? '王様' : '奴隷'}チーム - {gameState.points}ポイント
      </h1>
      
      <div className="flex justify-center items-center gap-4 mb-8">
        <Input
          type="number"
          min={100}
          max={gameState.points}
          value={gameState.betAmount}
          onChange={(e) => setGameState(prev => ({ ...prev, betAmount: parseInt(e.target.value) || 0 }))}
          className="w-32 text-center"
        />
        <Button
          onClick={playTurn}
          disabled={!gameState.selectedCard || gameState.result !== undefined}
          className="bg-yellow-500 hover:bg-yellow-600"
        >
          賭ける
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {gameState.cards.map((card) => (
          <Card
            key={card.id}
            className={`p-4 cursor-pointer transition-all ${
              card.selected ? 'border-yellow-500' : 'border-gray-700'
            }`}
            onClick={() => selectCard(card)}
          >
            <img
              src={card.selected || gameState.result ? card.image : CARD_IMAGES.back}
              alt="card"
              className="w-full h-40 object-cover rounded"
            />
          </Card>
        ))}
      </div>

      {gameState.result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            {gameState.result === 'win' && '勝利！'}
            {gameState.result === 'lose' && '敗北...'}
            {gameState.result === 'draw' && '引き分け'}
          </h2>
          <div className="flex justify-center gap-8 mb-4">
            <div>
              <p className="text-gray-400 mb-2">あなたのカード</p>
              <img
                src={gameState.selectedCard?.image}
                alt="your card"
                className="w-32 h-40 object-cover rounded"
              />
            </div>
            <div>
              <p className="text-gray-400 mb-2">相手のカード</p>
              <img
                src={gameState.cpuCard?.image}
                alt="cpu card"
                className="w-32 h-40 object-cover rounded"
              />
            </div>
          </div>
          <Button
            onClick={nextRound}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            {gameState.gameOver ? 'ゲーム終了' : '次のラウンド'}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}