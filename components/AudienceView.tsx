
import React from 'react';
import { Participant, Round, Submission } from '../types';

interface AudienceViewProps {
  rounds: Round[];
  participants: Participant[];
  submissions: Submission[];
  nickname: string | null;
  setNickname: (name: string | null) => void;
  onRate: (submissionId: string, score: number, nickname: string) => void;
  onImageClick: (url: string, title: string) => void;
}

const NICKNAMES = [
  '黏土大師', '不土會死', '揉捏專家', '陶藝學徒', '色彩魔術師', 
  '泥土守護者', '塑形工兵', '靈巧雙手', '土之呼吸', '創意泥巴人'
];

export const AudienceView: React.FC<AudienceViewProps> = ({ 
  rounds, 
  participants, 
  submissions, 
  nickname,
  setNickname,
  onRate, 
  onImageClick 
}) => {
  const activeRound = rounds.find(r => r.status === 'ACTIVE');
  const pastRounds = rounds.filter(r => r.status === 'COMPLETED').reverse();

  const handleJoin = () => {
    const randomName = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
    setNickname(randomName);
  };

  if (!nickname) {
    return (
      <div className="clay-card p-10 max-w-md mx-auto text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="text-5xl">👀</div>
        <h2 className="text-2xl font-black text-amber-900">準備進入評分席</h2>
        <p className="text-sm text-amber-700 font-medium leading-relaxed">
          歡迎觀賽！我們將為您分配一個隨機稱號，讓您參與即時作品評分。進入後為確保公平性，無法自行更換暱稱。
        </p>
        <button 
          onClick={handleJoin}
          className="w-full bg-amber-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition active:scale-95 text-lg"
        >
          取得隨機稱號並進入
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-amber-100/30 p-4 rounded-3xl border border-amber-200/50 shadow-inner">
        <span className="text-sm font-black text-amber-900 flex items-center gap-2">
            <span className="text-xl">👤</span> {nickname} <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-black">評分嘉賓</span>
        </span>
        {/* 已根據要求隱藏更換暱稱按鈕 */}
      </div>

      {activeRound ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-amber-900 italic">🔥 第 {activeRound.roundNumber} 輪 現場直播</h2>
            <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black animate-pulse shadow-md">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
            </div>
          </div>

          <div className="clay-card p-8 text-center bg-white border-4 border-amber-100 group relative cursor-pointer overflow-hidden" 
               onClick={() => onImageClick(activeRound.topicImage, `第 ${activeRound.roundNumber} 輪題目`)}>
            <p className="text-[10px] text-amber-400 mb-2 font-black uppercase tracking-[0.2em]">當前挑戰題目 (點擊放大)</p>
            <img src={activeRound.topicImage} className="mx-auto max-h-56 object-contain rounded-3xl shadow-lg border-2 border-amber-50 transition-transform group-hover:scale-105" alt="題目" />
            <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/5 transition-colors flex items-center justify-center">
              <span className="bg-white/90 text-amber-900 px-4 py-2 rounded-full font-black opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">🔍 點擊看大圖</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {activeRound.participantIds.map(pid => {
              const participant = participants.find(p => p.id === pid);
              const submission = submissions.find(s => s.participantId === pid && s.roundId === activeRound.id);
              
              const userScore = submission?.scores[nickname] || 0;
              const totalVoters = submission ? Object.keys(submission.scores).length : 0;

              return (
                <div key={pid} className="clay-card p-6 bg-white flex flex-col items-center text-center border-b-8 border-amber-300">
                  <div className="relative mb-4">
                    <img src={participant?.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-amber-50" alt="avatar" />
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-900 text-white text-[10px] px-2 py-0.5 rounded-full font-black whitespace-nowrap">
                        選手: {participant?.name || '未知選手'}
                    </span>
                  </div>

                  {submission ? (
                    <div className="w-full bg-amber-50/50 p-5 rounded-3xl space-y-4 border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                        {userScore > 0 ? `您已評分: ${userScore} 星` : '點擊星號進行評分'}
                      </p>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button 
                            key={star}
                            onClick={() => onRate(submission.id, star, nickname)}
                            className={`text-3xl transition-all hover:scale-125 active:scale-90 ${
                              star <= userScore ? 'grayscale-0 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'grayscale opacity-30'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-amber-400 font-black">已有 {totalVoters} 位嘉賓評分</p>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-300 font-bold bg-amber-50/20 w-full py-8 rounded-3xl border-2 border-dashed border-amber-100">
                      等待作品上傳中...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="clay-card p-16 text-center shadow-inner bg-amber-50/20">
           <div className="text-5xl mb-6 grayscale">⏳</div>
           <p className="text-amber-900/30 text-lg font-black italic leading-relaxed">下一場比賽即將開始<br/>請密切關注！</p>
        </div>
      )}
    </div>
  );
};
