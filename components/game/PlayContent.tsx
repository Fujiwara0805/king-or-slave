"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_POINTS, CARD_IMAGES } from '@/app/constants/game';
import { Card } from '@/components/ui/card';
import { Team, Card as GameCard, CardType, CardState } from '@/app/types/game';
import { toast } from 'sonner';

export default function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const team = searchParams.get('team');
  const betAmount = parseInt(searchParams.get('bet') || '100');
  const round = parseInt(searchParams.get('round') || '1');
  const [selectedCard, setSelectedCard] = useState<GameCard>();
  const [timeLeft, setTimeLeft] = useState(60);
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [cards, setCards] = useState<GameCard[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 時間切れの場合、自動的に遷移
  useEffect(() => {
    if (timeLeft === 0) {
      // ランダムにカードを選択して決闘画面へ
      const randomIndex = Math.floor(Math.random() * cards.length);
      const randomCard = cards[randomIndex];
      
      if (randomCard) {
        // カード状態を更新
        const updatedCardStates = cardStates.map(state => 
          state.index.toString() === randomCard.id 
            ? { ...state, used: true }
            : state
        );
        sessionStorage.setItem('cardStates', JSON.stringify(updatedCardStates));
        
        // 決闘画面へ遷移
        router.push(`/game/duel?team=${team}&bet=${betAmount}&selectedCard=${randomCard.type}&round=${round}`);
      }
    }
  }, [timeLeft, cards, cardStates, team, betAmount, round, router]);

  useEffect(() => {
    initializeCards();
  }, []);

  const initializeCards = () => {
    let initialCardStates: CardState[] = [];
    const savedCardStates = sessionStorage.getItem('cardStates');
    const savedTeam = sessionStorage.getItem('team') as Team;
    
    // チームの取得を確実にする
    const currentTeam = team || savedTeam || 'king';

    if (savedCardStates) {
      // 既存のカード状態を使用
      initialCardStates = JSON.parse(savedCardStates);
    } else {
      // 新しいゲームまたは新しいチーム選択後は、カードを5枚にリセット
      // 市民カードに具体的な番号を割り当てる
      initialCardStates = [
        { index: 0, type: currentTeam === 'king' ? 'king' : 'slave', used: false },
        { index: 1, type: 'citizen1', used: false },
        { index: 2, type: 'citizen2', used: false },
        { index: 3, type: 'citizen3', used: false },
        { index: 4, type: 'citizen4', used: false }
      ];
    
      sessionStorage.setItem('cardStates', JSON.stringify(initialCardStates));
    }

    setCardStates(initialCardStates);

    const availableCards: GameCard[] = [];
    initialCardStates
      .filter(state => !state.used)  // 使用済みでないカードのみをフィルタリング
      .forEach(state => {
        // 表示用のタイプを設定（citizen1-4はすべてcitizenとして表示）
        const displayType = state.type.startsWith('citizen') ? 'citizen' : state.type;
        availableCards.push({
          id: state.index.toString(),
          type: displayType,
          image: CARD_IMAGES[displayType as keyof typeof CARD_IMAGES],
          originalType: state.type  // 元のタイプを保存
        });
      });
    
    setCards(shuffleCards(availableCards));
  };

  const shuffleCards = (cards: GameCard[]) => {
    return [...cards].sort(() => Math.random() - 0.5);
  };

  const selectCard = (card: GameCard) => {
    setCards(prev => 
      prev.map(c => ({
        ...c,
        selected: c.id === card.id ? !c.selected : false
      }))
    );
    setSelectedCard(card);
  };

  const handleConfirm = () => {
    if (!selectedCard) {
      toast.error('カードを選択してください');
      return;
    }

    // 選択したカードを使用済みにマーク
    const updatedCardStates = cardStates.map(state => {
      if (state.index.toString() === selectedCard.id) {
        return { ...state, used: true };
      }
      return state;
    });
    
    // 更新したカード状態を保存
    sessionStorage.setItem('cardStates', JSON.stringify(updatedCardStates));
    
    // 選択したカードの実際のタイプ（citizen1-4など）をURLパラメータとして渡す
    const originalType = selectedCard.originalType || selectedCard.type;
    
    router.push(`/game/duel?team=${team}&bet=${betAmount}&round=${round}&selectedCard=${originalType}`);
  };

  // 残り時間に応じたテキストカラーを決定
  const getTimeTextColor = () => {
    if (timeLeft <= 5) return "text-red-600 animate-pulse";
    if (timeLeft <= 10) return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-[100vh] py-0"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 sticky top-0 z-10  backdrop-blur-sm"
      >
        <h1 className="text-4xl md:text-4xl sm:text-3xl xs:text-2xl font-bold text-center text-yellow-500 mb-2">
          {`ROUND ${round}`}
        </h1>
      </motion.div>

      <div className="flex-grow flex flex-col justify-between px-4 md:px-8 lg:px-12 py-4">
        <div className="space-y-6 sm:space-y-4 xs:space-y-3">
          <div className="bg-amber-900/40 border-amber-800 rounded-lg p-6 sm:p-4 xs:p-3 bg-[url('/paper-texture.png')] bg-blend-multiply">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base sm:text-sm xs:text-xs text-amber-100">賭けポイント</p>
                <p className="text-2xl sm:text-xl xs:text-lg font-bold text-yellow-500">{betAmount.toLocaleString()} px</p>
              </div>
              <div>
                <p className="text-base sm:text-sm xs:text-xs text-amber-100">残り時間</p>
                <p className={`text-2xl sm:text-xl xs:text-lg font-bold ${getTimeTextColor()}`}>{timeLeft}秒</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-2">
            <p className="text-xl md:text-xl sm:text-lg xs:text-base font-bold text-amber-100">カードを選択してください</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 gap-4 sm:gap-3 xs:gap-2 max-w-2xl mx-auto">
            {cards.map((card) => (
              <Card
                key={card.id}
                className={`p-3 sm:p-2 xs:p-1 cursor-pointer transition-all ${
                  card.selected 
                    ? 'border-4 border-yellow-500 scale-105 bg-yellow-700/30' 
                    : 'border border-gray-700 hover:border-gray-500'
                } relative`}
                onClick={() => selectCard(card)}
              >
                <div className="relative">
                  <img
                    src={card.image}
                    alt="card"
                    className="w-full h-auto sm:h-auto xs:h-auto object-cover rounded shadow-lg"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2 sm:p-1 xs:p-1 text-center">
                    <p className="text-lg sm:text-base xs:text-sm font-bold text-white">
                      {card.type === 'king' && '王様'}
                      {card.type === 'citizen' && '市民'}
                      {card.type === 'slave' && '奴隷'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 mb-4">
          <Button
            onClick={handleConfirm}
            disabled={!selectedCard}
            className={`w-64 sm:w-full max-w-xs h-16 sm:h-14 xs:h-12 text-xl sm:text-lg xs:text-base transition-all ${
              selectedCard 
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white border-2 border-yellow-300' 
                : 'bg-gradient-to-r from-gray-600 to-gray-500 text-gray-300'
            }`}
          >
            決闘開始
          </Button>
        </div>
      </div>
    </motion.div>
  );
}