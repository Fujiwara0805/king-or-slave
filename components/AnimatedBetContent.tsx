"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_POINTS, CARD_IMAGES } from '@/app/constants/game';
import { Card } from '@/components/ui/card';
import { Team, Card as GameCard, CardType, CardState } from '@/app/types/game';

export default function AnimatedBetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const team = searchParams.get('team');
  const round = parseInt(searchParams.get('round') || '1');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedCard, setSelectedCard] = useState<GameCard>();
  const [timeLeft, setTimeLeft] = useState(60);
  const [cardStates, setCardStates] = useState<CardState[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    initializeCards();
  }, []);

  const initializeCards = () => {
    let initialCardStates: CardState[] = [];
    const savedCardStates = sessionStorage.getItem('cardStates');

    if (savedCardStates && round > 1) {
      initialCardStates = JSON.parse(savedCardStates);
    } else {
      initialCardStates = Array(5).fill(null).map((_, index) => ({
        index,
        type: index === 0 ? (team === 'king' ? 'king' : 'slave') : 'citizen',
        used: false
      }));
      sessionStorage.setItem('cardStates', JSON.stringify(initialCardStates));
    }

    setCardStates(initialCardStates);

    const availableCards: GameCard[] = [];
    if (team === 'king') {
      initialCardStates
        .filter(state => !state.used)
        .forEach(state => {
          availableCards.push({
            id: state.index.toString(),
            type: state.type,
            image: CARD_IMAGES[state.type]
          });
        });
    } else {
      initialCardStates
        .filter(state => !state.used)
        .forEach(state => {
          availableCards.push({
            id: state.index.toString(),
            type: state.type,
            image: CARD_IMAGES[state.type]
          });
        });
    }
    setCards(shuffleCards(availableCards));
  };

  const shuffleCards = (cards: GameCard[]) => {
    return [...cards].sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState<GameCard[]>([]);

  const selectCard = (card: GameCard) => {
    setCards(prev => 
      prev.map(c => ({
        ...c,
        selected: c.id === card.id ? !c.selected : false
      }))
    );
    setSelectedCard(card);
  };

  const handleBet = () => {
    if (!selectedCard) return;
    
    // Update card states
    const updatedCardStates = cardStates.map(state => 
      state.index.toString() === selectedCard.id 
        ? { ...state, used: true }
        : state
    );
    sessionStorage.setItem('cardStates', JSON.stringify(updatedCardStates));
    
    router.push(`/game/duel?team=${team}&bet=${betAmount}&selectedCard=${selectedCard.type}&round=${round}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">
        {`ラウンド ${round} - カードを選択`}
      </h1>

      <div className="bg-[#2E4F4F] bg-opacity-80 rounded-lg p-6 mb-8 border border-[#0E8388]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">賭けポイント</p>
            <p className="text-2xl font-bold text-yellow-500">{betAmount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">残り時間</p>
            <p className="text-2xl font-bold text-yellow-500">{timeLeft}秒</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`p-4 cursor-pointer transition-all ${
              card.selected ? 'border-yellow-500 scale-105' : 'border-gray-700 hover:border-gray-500'
            } relative`}
            onClick={() => selectCard(card)}
          >
            <div className="relative">
              <img
                src={card.image}
                alt="card"
                className="w-full h-52 object-cover rounded shadow-lg"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2 text-center">
                <p className="text-lg font-bold text-white">
                  {card.type === 'king' && '王様'}
                  {card.type === 'citizen' && '市民'}
                  {card.type === 'slave' && '奴隷'}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleBet}
          disabled={!selectedCard}
          className="w-64 h-16 text-xl bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400"
        >
          決闘開始
        </Button>
      </div>
    </motion.div>
  );
}