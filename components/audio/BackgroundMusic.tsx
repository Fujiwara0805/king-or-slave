"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Music2 } from 'lucide-react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 音声の初期化（ただし再生はしない）
  useEffect(() => {
    // モバイルデバイスかどうかを検出
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    try {
      const audio = new Audio('https://res.cloudinary.com/dz9trbwma/video/upload/v1743650451/background-music_tztdzf.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      
      // 音声ファイルの読み込みが完了したらステートを更新
      audio.oncanplaythrough = () => {
        setAudioLoaded(true);
        console.log('音声ファイルの読み込みが完了しました');
      };
      
      audio.onerror = (e) => {
        console.error('音声ファイルの読み込みエラー:', e);
      };
      
      audioRef.current = audio;
      setAudioInitialized(true);
    } catch (error) {
      console.error('音声の初期化エラー:', error);
    }

    // コンポーネントのアンマウント時に音楽を停止
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 画面タップ時に音声を有効化する（モバイル向け）
  useEffect(() => {
    const enableAudio = () => {
      if (audioRef.current && !isPlaying) {
        // 一度再生して即座に停止することで、後続の再生を可能にする
        audioRef.current.play()
          .then(() => {
            audioRef.current?.pause();
            console.log('音声が有効化されました');
          })
          .catch(e => console.error('音声有効化エラー:', e));
      }
    };

    // 画面全体のタップイベントをリッスン
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('click', enableAudio, { once: true });

    return () => {
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
    };
  }, [audioInitialized, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !audioLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
      console.log('音楽を停止しました');
    } else {
      // ユーザーインタラクションに応じて再生（ブラウザポリシー対応）
      audioRef.current.play()
        .then(() => {
          console.log('音楽の再生を開始しました');
        })
        .catch(e => {
          console.error("音声再生エラー:", e);
          // iOSの場合、ミュート状態でも再生を試みる
          if (audioRef.current) {
            audioRef.current.muted = true;
            audioRef.current.play()
              .then(() => {
                // 少し遅延してからミュートを解除
                setTimeout(() => {
                  if (audioRef.current) audioRef.current.muted = false;
                }, 1000);
                console.log('ミュート状態で再生を開始しました');
              })
              .catch(e2 => console.error("ミュート状態での再生にも失敗:", e2));
          }
        });
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