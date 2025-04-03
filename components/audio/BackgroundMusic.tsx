"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Music2 } from 'lucide-react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const audio = new Audio('https://res.cloudinary.com/dz9trbwma/video/upload/v1743650451/background-music_tztdzf.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    
    // 音声ファイルの読み込みが完了したらステートを更新
    audio.oncanplaythrough = () => setAudioLoaded(true);
    
    audioRef.current = audio;

    // コンポーネントのアンマウント時に音楽を停止
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || !audioLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // ユーザーインタラクションに応じて再生（ブラウザポリシー対応）
      audioRef.current.play().catch(e => console.error("音声再生エラー:", e));
    }
    
    setIsPlaying(!isPlaying);
  };

  // 音声ファイルがまだ読み込まれていない場合は、ボタンを無効化
  if (!audioLoaded) {
    return (
      <Button
        disabled
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 bg-black/70 hover:bg-black/90 rounded-full w-12 h-12 border-2 border-yellow-500/50 opacity-50"
        aria-label="音楽を読み込み中"
      >
        <Music size={22} className="text-white animate-pulse" />
      </Button>
    );
  }

  return (
    <Button
      onClick={togglePlay}
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 z-50 bg-black/70 hover:bg-black/90 rounded-full w-12 h-12 border-2 border-yellow-500/50"
      aria-label={isPlaying ? "音楽を停止" : "音楽を再生"}
    >
      {isPlaying ? 
        <Music2 size={22} className="text-white" /> : 
        <Music size={22} className="text-white" />
      }
    </Button>
  );
} 