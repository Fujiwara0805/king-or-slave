"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

export default function AudioPermissionModal() {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // モバイルデバイスかどうかを検出
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // モバイルデバイスの場合のみモーダルを表示
    if (isMobile) {
      // 既に許可されているかチェック
      const hasPermission = localStorage.getItem('audioPermissionGranted');
      if (hasPermission !== 'true') {
        setOpen(true);
      }
    }
  }, []);
  
  const enableAudio = () => {
    // ダミーの音声を作成して再生（即座に停止）
    try {
      const audio = new Audio('https://res.cloudinary.com/dz9trbwma/video/upload/v1743650451/background-music_tztdzf.mp3');
      audio.volume = 0.1;
      audio.play()
        .then(() => {
          audio.pause();
          // 許可を記録
          localStorage.setItem('audioPermissionGranted', 'true');
          setOpen(false);
        })
        .catch(e => {
          console.error('音声許可エラー:', e);
          setOpen(false);
        });
    } catch (error) {
      console.error('音声初期化エラー:', error);
      setOpen(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black/90 border-2 border-yellow-500 text-center p-4 max-w-sm mx-auto">
        <DialogTitle className="text-xl font-bold text-yellow-500">
          音楽を有効にしますか？
        </DialogTitle>
        <DialogDescription className="text-gray-300 mt-2">
          ゲーム体験を向上させるためにBGMを再生します。
        </DialogDescription>
        <div className="flex justify-center mt-4 space-x-4">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="border-gray-600"
          >
            あとで
          </Button>
          <Button
            onClick={enableAudio}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400"
          >
            <Music className="mr-2 h-4 w-4" />
            音楽を有効化
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 