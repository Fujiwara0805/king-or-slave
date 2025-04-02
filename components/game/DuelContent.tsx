"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Crown, Users, User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Team, Card as GameCard, CardType, CardState } from '@/app/types/game';
import { CARD_IMAGES, INITIAL_POINTS, WIN_THRESHOLD, SLAVE_WIN_MULTIPLIER, SLAVE_LOSE_MULTIPLIER } from '@/app/constants/game';

export default function DuelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const team = searchParams.get('team') as Team;
  const betAmount = parseInt(searchParams.get('bet') || '0');
  const round = parseInt(searchParams.get('round') || '1');
  const [playerCard, setPlayerCard] = useState<GameCard>();
  const [cpuCard, setCpuCard] = useState<GameCard>();
  const [showCpuCard, setShowCpuCard] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | 'draw'>();
  const [showModal, setShowModal] = useState(false);
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [pointChange, setPointChange] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedCardType = searchParams.get('selectedCard') as CardType;
    const savedCardStates = sessionStorage.getItem('cardStates');
    const savedPoints = sessionStorage.getItem('points');
    const initialCardStates = savedCardStates ? JSON.parse(savedCardStates) : [];
    const initialPoints = savedPoints ? parseInt(savedPoints) : INITIAL_POINTS;
    
    console.log('DuelContent - 初期ポイント:', initialPoints); // デバッグ用
    
    setCardStates(initialCardStates);
    setPoints(initialPoints);
    
    setPlayerCard({
      id: 'player',
      type: selectedCardType,
      image: CARD_IMAGES[selectedCardType]
    });

    // CPU card selection based on player's team
    let cpuType: CardType;
    if (team === 'king') {
      // If player is king, CPU is from slave team
      const slaveTeamCards = Array(5).fill(null).map((_, index) => ({
        type: index === 0 ? 'slave' : 'citizen'
      }));
      const randomIndex = Math.floor(Math.random() * slaveTeamCards.length);
      cpuType = slaveTeamCards[randomIndex].type as CardType;
    } else {
      // If player is slave, CPU is from king team
      const kingTeamCards = Array(5).fill(null).map((_, index) => ({
        type: index === 0 ? 'king' : 'citizen'
      }));
      const randomIndex = Math.floor(Math.random() * kingTeamCards.length);
      cpuType = kingTeamCards[randomIndex].type as CardType;
    }
    
    setCpuCard({
      id: 'cpu',
      type: cpuType,
      image: CARD_IMAGES[cpuType]
    });

    // Show CPU card after 5 seconds
    const timer = setTimeout(() => {
      setShowCpuCard(true);
      const battleResult = determineWinner(selectedCardType, cpuType);
      const change = calculatePointChange(battleResult);
      const newPoints = initialPoints + change;
      
      setPointChange(change);
      setPoints(newPoints);
      
      // 確実にセッションストレージに保存
      sessionStorage.setItem('points', newPoints.toString());
      console.log('DuelContent - セッションストレージに保存したポイント:', sessionStorage.getItem('points')); // デバッグ用
      
      setResult(battleResult);
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [team, betAmount]);

  const calculatePointChange = (result: 'win' | 'lose' | 'draw'): number => {
    if (result === 'draw') return 0;
    
    let change = betAmount;
    if (result === 'win') {
      if (team === 'slave') change *= SLAVE_WIN_MULTIPLIER;
    } else {
      if (team === 'slave') change *= SLAVE_LOSE_MULTIPLIER;
      change *= -1;
    }
    
    console.log(`DuelContent - ポイント変更: ${change} (元の掛け金: ${betAmount})`);
    return change;
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

  const handleNextRound = () => {
    // 王様または奴隷が選択された場合
    const isSpecialCardSelected = playerCard?.type === 'king' || playerCard?.type === 'slave' || cpuCard?.type === 'king' || cpuCard?.type === 'slave';
    const isPointsExhausted = points <= 0 || points >= 100000; // 持ち点が0以下または100,000以上の場合
    const isRound5Completed = round >= 5;
    
    
    if (isPointsExhausted) {
      // 持ち点が0以下または100,000以上の場合のみゲーム終了
      // 最終ポイントを確実に保存
      sessionStorage.setItem('points', points.toString());
      
      // カード状態はリセットするが、ポイントは保持したままリザルト画面へ
      sessionStorage.removeItem('cardStates');
      router.push('/game/result');
    } else if (isSpecialCardSelected || isRound5Completed) {
      // 特殊カードが選択された場合、またはラウンド5が終了した場合は、チーム選択画面へ
      // ポイントは保持したままチーム選択画面へ
      sessionStorage.removeItem('cardStates'); // カード状態はリセット
      sessionStorage.removeItem('team'); // チーム情報もリセット
      router.push('/game');
    } else if (result === 'draw') {
      // 引き分けの場合は直接Play画面へ
      router.push(`/game/play?team=${team}&bet=${betAmount}&round=${round + 1}`);
    } else {
      // 市民カード同士の対決で勝敗がついた場合は次のラウンドへ
      router.push(`/game/bet?team=${team}&round=${round + 1}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="bg-black/50 p-4 rounded-lg border border-yellow-900">
        <h2 className="text-2xl font-bold text-center text-yellow-500">
          賭け金: {betAmount.toLocaleString()} ポイント
        </h2>
      </div>

      <div className="flex justify-center gap-16 min-h-[500px] items-center">
        <AnimatePresence>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-64 h-96"
          >
            <Card className="w-full h-full p-4 bg-black/50 border-yellow-900">
              <img
                src={playerCard?.image}
                alt="player card"
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2 text-center">
                <p className="text-lg font-bold text-white">プレイヤー</p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {showCpuCard && (
          <AnimatePresence>
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-64 h-96"
            >
              <Card className="w-full h-full p-4 bg-black/50 border-yellow-900">
                <img
                  src={cpuCard?.image}
                  alt="cpu card"
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2 text-center">
                  <p className="text-lg font-bold text-white">CPU</p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-black/90 border-2 border-yellow-500 text-center p-8 max-w-md">
          <DialogTitle asChild>
            <h2 className="text-6xl font-bold mb-8 tracking-wider">
            {result === 'win' ? '勝利' : result === 'lose' ? '敗北' : '引き分け'}
            </h2>
          </DialogTitle>
          {result !== 'draw' && (
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-2xl mb-4 ${pointChange > 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {pointChange > 0 ? '+' : ''}{pointChange.toLocaleString()} ポイント
            </motion.p>
          )}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <div className="text-8xl font-bold mb-8">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className={`
                  ${result === 'win' ? 'text-green-500' : ''}
                  ${result === 'lose' ? 'text-red-500' : ''}
                  ${result === 'draw' ? 'text-yellow-500' : ''}
                `}
              >
                {result === 'win' && 'WIN'}
                {result === 'lose' && 'LOSE'}
                {result === 'draw' && 'DRAW'}
              </motion.div>
            </div>
            <Button
              onClick={handleNextRound}
              className="w-48 h-12 text-lg bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400"
            >
              {(() => {
                const isPointsExhausted = points <= 0 || points >= 100000;
                return isPointsExhausted ? 'ゲーム終了' : '次のラウンド';
              })()}
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}