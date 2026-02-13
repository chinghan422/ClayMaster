
import React from 'react';
import { Round, Participant, Submission } from '../types';

interface PastHighlightsProps {
  rounds: Round[];
  participants: Participant[];
  submissions: Submission[];
  onImageClick: (url: string, title: string) => void;
}

export const PastHighlights: React.FC<PastHighlightsProps> = ({ 
  rounds, 
  participants, 
  submissions, 
  onImageClick 
}) => {
  const pastRounds = rounds.filter(r => r.status === 'COMPLETED').reverse();

  if (pastRounds.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="text-6xl grayscale opacity-20">📼</div>
        <h2 className="text-2xl font-black text-amber-900/30 italic">尚無已完成的賽事記錄</h2>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-amber-950 italic">✨ 精彩賽事回顧</h2>
        <p className="text-sm text-amber-700 font-medium">重溫每一場創意激盪的巔峰時刻</p>
      </div>

      <div className="space-y-16">
        {pastRounds.map(round => (
          <div key={round.id} className="clay-card overflow-hidden border-2 border-amber-50 shadow-lg">
            <div className="bg-amber-50/50 px-8 py-4 border-b border-amber-100 flex justify-between items-center">
              <span className="text-xs font-black bg-amber-900 text-white px-3 py-1 rounded-full uppercase tracking-tighter">Round {round.roundNumber}</span>
              <span className="text-[10px] text-amber-400 font-black uppercase">Official Record</span>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest text-center">比賽題目</p>
                  <img 
                    src={round.topicImage} 
                    className="w-full h-48 object-contain bg-white rounded-[32px] p-4 shadow-inner border border-amber-50 cursor-pointer hover:scale-105 transition-transform" 
                    alt="Topic"
                    onClick={() => onImageClick(round.topicImage, `Round ${round.roundNumber} 題目回顧`)}
                  />
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">選手表現與嘉賓評價</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {round.participantIds.map(pid => {
                      const p = participants.find(part => part.id === pid);
                      const sub = submissions.find(s => s.roundId === round.id && s.participantId === pid);
                      const scoreEntries = sub ? Object.entries(sub.scores) : [];
                      const avgScore = scoreEntries.length > 0 
                          ? (scoreEntries.reduce((a,b) => a + b[1], 0) / scoreEntries.length).toFixed(1)
                          : "0";
                      
                      return (
                        <div key={pid} className="bg-amber-50/30 rounded-3xl p-6 border border-amber-100 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={p?.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={p?.name} />
                              <span className="font-black text-amber-900">{p?.name}</span>
                            </div>
                            <span className="text-lg font-black text-amber-600">🏆 {avgScore}</span>
                          </div>
                          <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                            {scoreEntries.map(([voter, score]) => (
                              <div key={voter} className="flex justify-between items-center bg-white/60 p-2 rounded-xl text-[10px] border border-white">
                                <span className="font-bold text-amber-800">👤 {voter}</span>
                                <span className="font-black text-amber-500">{'⭐'.repeat(score)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
