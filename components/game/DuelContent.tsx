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

// カードタイプを拡張
type ExtendedCardType = 'king' | 'slave' | 'citizen1' | 'citizen2' | 'citizen3' | 'citizen4';

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
    const selectedCardParam = searchParams.get('selectedCard');
    
    // selectedCardがnullまたはundefinedの場合のデフォルト値を設定
    const selectedCardType = selectedCardParam as CardType || 'citizen';
    
    // 表示用のタイプを設定（citizen1-4はすべてcitizenとして表示）
    const displayType = selectedCardType.startsWith('citizen') ? 'citizen' : selectedCardType;
    
    const savedCardStates = sessionStorage.getItem('cardStates');
    const savedPoints = sessionStorage.getItem('points');
    const initialCardStates = savedCardStates ? JSON.parse(savedCardStates) : [];
    const initialPoints = savedPoints ? parseInt(savedPoints) : INITIAL_POINTS;

    setCardStates(initialCardStates);
    setPoints(initialPoints);
    
    setPlayerCard({
      id: 'player',
      type: displayType,
      image: CARD_IMAGES[displayType as keyof typeof CARD_IMAGES],
      originalType: selectedCardType  // 元のタイプを保存
    });

    // CPU側の使用済みカード情報を取得
    let usedCpuCards: ExtendedCardType[] = [];
    const savedUsedCpuCards = sessionStorage.getItem('usedCpuCards');
    if (savedUsedCpuCards) {
      usedCpuCards = JSON.parse(savedUsedCpuCards);
    }

    // CPU card selection based on player's team
    let cpuType: ExtendedCardType;
    
    if (team === 'king') {
      // If player is king, CPU is from slave team
      const slaveTeamCards: ExtendedCardType[] = ['slave', 'citizen1', 'citizen2', 'citizen3', 'citizen4'];
      
      // 使用済みでないカードのみをフィルタリング
      const availableCards = slaveTeamCards.filter(card => !usedCpuCards.includes(card));
      
      // 使用可能なカードがない場合は全てのカードを再度使用可能にする
      if (availableCards.length === 0) {
        cpuType = slaveTeamCards[Math.floor(Math.random() * slaveTeamCards.length)];
        // 使用済みカードをリセット
        usedCpuCards = [];
      } else {
        // 使用可能なカードからランダムに選択
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        cpuType = availableCards[randomIndex];
      }
      
    } else {
      // If player is slave, CPU is from king team
      const kingTeamCards: ExtendedCardType[] = ['king', 'citizen1', 'citizen2', 'citizen3', 'citizen4'];
      
      // 使用済みでないカードのみをフィルタリング
      const availableCards = kingTeamCards.filter(card => !usedCpuCards.includes(card));
      
      // 使用可能なカードがない場合は全てのカードを再度使用可能にする
      if (availableCards.length === 0) {
        cpuType = kingTeamCards[Math.floor(Math.random() * kingTeamCards.length)];
        // 使用済みカードをリセット
        usedCpuCards = [];
      } else {
        // 使用可能なカードからランダムに選択
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        cpuType = availableCards[randomIndex];
      }
    }
    
    // 使用したカードを記録
    usedCpuCards.push(cpuType);
    sessionStorage.setItem('usedCpuCards', JSON.stringify(usedCpuCards));
    
    // CPUカード用の変数名を変更
    const cpuDisplayType: CardType = cpuType.startsWith('citizen') ? 'citizen' : cpuType as CardType;
    
    setCpuCard({
      id: 'cpu',
      type: cpuDisplayType,
      image: CARD_IMAGES[cpuDisplayType as keyof typeof CARD_IMAGES]
    });

    // Show CPU card after 5 seconds
    const timer = setTimeout(() => {
      setShowCpuCard(true);
      // 勝敗判定用のカードタイプ（citizen1-4はすべてcitizenとして扱う）
      const playerTypeForComparison: CardType = displayType;
      const cpuTypeForComparison: CardType = cpuDisplayType;
      
      const battleResult = determineWinner(playerTypeForComparison, cpuTypeForComparison);
      const change = calculatePointChange(battleResult);
      const newPoints = initialPoints + change;
      
      setPointChange(change);
      setPoints(newPoints);
      
      // 確実にセッションストレージに保存
      sessionStorage.setItem('points', newPoints.toString());
      
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
      sessionStorage.removeItem('usedCpuCards'); // CPU側の使用済みカード情報もリセット
      router.push('/game/result');
    } else if (isSpecialCardSelected || isRound5Completed) {
      // 特殊カードが選択された場合、またはラウンド5が終了した場合は、チーム選択画面へ
      // ポイントは保持したままチーム選択画面へ
      sessionStorage.removeItem('cardStates'); // カード状態はリセット
      sessionStorage.removeItem('team'); // チーム情報もリセット
      sessionStorage.removeItem('usedCpuCards'); // CPU側の使用済みカード情報もリセット
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
      className="space-y-8 px-4 py-4 min-h-[100vh] flex flex-col"
    >
      <div className="bg-gray-500/50 p-4 rounded-lg border border-yellow-900 sticky top-0 z-10 backdrop-blur-sm mt-4" >
        <h2 className="text-2xl md:text-2xl sm:text-xl xs:text-lg font-bold text-center text-yellow-500">
          賭け金: {betAmount.toLocaleString()} ポイント
        </h2>
      </div>

      <div className="flex justify-center items-center gap-4 md:gap-8 sm:gap-4 xs:gap-2 flex-grow ">
        <AnimatePresence>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-32 h-48 md:w-48 md:h-72 sm:w-36 sm:h-54 xs:w-28 xs:h-42"
          >
            <Card className="w-full h-full p-2 md:p-4 sm:p-3 xs:p-2 bg-black/50 border-yellow-900">
              <img
                src={playerCard?.image}
                alt="player card"
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 p-1 md:p-2 sm:p-1 xs:p-1 text-center">
                <p className="text-sm md:text-lg sm:text-base xs:text-xs font-bold text-white">プレイヤー</p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="text-center text-2xl md:text-3xl sm:text-2xl xs:text-xl font-bold text-yellow-500">VS</div>

        {showCpuCard ? (
          <AnimatePresence>
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-48 md:w-48 md:h-72 sm:w-36 sm:h-54 xs:w-28 xs:h-42"
            >
              <Card className="w-full h-full p-2 md:p-4 sm:p-3 xs:p-2 bg-black/50 border-yellow-900">
                <img
                  src={cpuCard?.image}
                  alt="cpu card"
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black/50 p-1 md:p-2 sm:p-1 xs:p-1 text-center">
                  <p className="text-sm md:text-lg sm:text-base xs:text-xs font-bold text-white">CPU</p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="relative w-32 h-48 md:w-48 md:h-72 sm:w-36 sm:h-54 xs:w-28 xs:h-42">
            <Card className="w-full h-full p-2 md:p-4 sm:p-3 xs:p-2 bg-black/50 border-yellow-900 flex items-center justify-center">
              <div className="text-center text-lg md:text-2xl sm:text-xl xs:text-base font-bold text-yellow-500 animate-pulse">
                ?
              </div>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-black/90 border-2 border-yellow-500 text-center p-4 md:p-8 sm:p-6 xs:p-4 max-w-md mx-auto w-[calc(100%-32px)] xs:w-[calc(100%-16px)] flex flex-col items-center justify-start">
          <DialogTitle asChild>
            <h2 className="text-4xl md:text-6xl sm:text-5xl xs:text-3xl font-bold mb-4 md:mb-6 sm:mb-4 xs:mb-3 tracking-wider mt-2">
            {result === 'win' ? '勝利' : result === 'lose' ? '敗北' : '引き分け'}
            </h2>
          </DialogTitle>
          {result !== 'draw' && (
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xl md:text-2xl sm:text-xl xs:text-lg mb-2 md:mb-3 sm:mb-2 xs:mb-2 ${pointChange > 0 ? 'text-green-500' : 'text-red-500'}`}
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
            className="w-full flex flex-col items-center justify-center mt-0"
          >
            <div className="text-5xl md:text-8xl sm:text-6xl xs:text-4xl font-bold mb-4 md:mb-6 sm:mb-4 xs:mb-3">
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
              className="w-36 md:w-48 sm:w-40 xs:w-32 h-10 md:h-12 sm:h-11 xs:h-9 text-base md:text-lg sm:text-base xs:text-sm bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 mb-4"
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