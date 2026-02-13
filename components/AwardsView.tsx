
import React from 'react';
import { Participant, Submission } from '../types';

interface AwardsViewProps {
  participants: Participant[];
  submissions: Submission[];
}

export const AwardsView: React.FC<AwardsViewProps> = ({ participants, submissions }) => {
  const leaderboard = participants.map(p => {
    const pSubmissions = submissions.filter(s => s.participantId === p.id);
    const totalScore = pSubmissions.reduce((acc, curr) => {
      const scoreValues = Object.values(curr.scores);
      const avg = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 0;
      return acc + avg;
    }, 0);
    return { ...p, totalScore: parseFloat(totalScore.toFixed(1)) };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const topThree = leaderboard.slice(0, 3);

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="text-6xl grayscale opacity-20">👑</div>
        <h2 className="text-2xl font-black text-amber-900/30 italic">典禮籌備中，期待冠軍誕生</h2>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in zoom-in-95 duration-700 py-10">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-amber-950 italic drop-shadow-sm">🏆 頒獎榮耀時刻</h2>
        <p className="text-lg text-amber-700 font-bold uppercase tracking-widest">Congratulations to all participants!</p>
      </div>

      <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-0 pt-20">
        {/* 第二名 */}
        {topThree[1] && (
          <div className="flex flex-col items-center group order-2 md:order-1">
            <img src={topThree[1].avatar} className="w-24 h-24 rounded-full border-4 border-slate-300 shadow-xl mb-4 bg-white transition-transform group-hover:scale-110" alt="2nd" />
            <div className="w-40 h-48 bg-slate-300 rounded-t-3xl flex flex-col items-center justify-center shadow-lg border-x-4 border-slate-200">
               <span className="text-5xl font-black text-slate-100">2</span>
               <p className="mt-4 font-black text-slate-800 text-center px-2">{topThree[1].name}</p>
               <p className="text-xs font-bold text-slate-500">{topThree[1].totalScore} pts</p>
            </div>
          </div>
        )}

        {/* 第一名 */}
        {topThree[0] && (
          <div className="flex flex-col items-center group z-10 order-1 md:order-2">
            <div className="relative">
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-5xl animate-bounce">👑</span>
              <img src={topThree[0].avatar} className="w-32 h-32 rounded-full border-8 border-amber-400 shadow-2xl mb-4 bg-white transition-transform group-hover:scale-110" alt="1st" />
            </div>
            <div className="w-48 h-64 bg-amber-400 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl border-x-4 border-amber-300">
               <span className="text-7xl font-black text-amber-100">1</span>
               <p className="mt-4 font-black text-amber-950 text-xl text-center px-2">{topThree[0].name}</p>
               <p className="text-sm font-bold text-amber-800">{topThree[0].totalScore} pts</p>
            </div>
          </div>
        )}

        {/* 第三名 */}
        {topThree[2] && (
          <div className="flex flex-col items-center group order-3">
            <img src={topThree[2].avatar} className="w-20 h-20 rounded-full border-4 border-orange-400 shadow-xl mb-4 bg-white transition-transform group-hover:scale-110" alt="3rd" />
            <div className="w-36 h-36 bg-orange-300 rounded-t-3xl flex flex-col items-center justify-center shadow-lg border-x-4 border-orange-200">
               <span className="text-4xl font-black text-orange-100">3</span>
               <p className="mt-4 font-black text-orange-950 text-center px-2 text-sm">{topThree[2].name}</p>
               <p className="text-[10px] font-bold text-orange-700">{topThree[2].totalScore} pts</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto space-y-4 pt-10">
        <h3 className="text-xl font-black text-amber-900 text-center italic">其他傑出創作者</h3>
        <div className="grid grid-cols-2 gap-3">
          {leaderboard.slice(3).map((p) => (
            <div key={p.id} className="bg-white/50 p-3 rounded-2xl flex items-center justify-between border border-amber-100">
              <div className="flex items-center gap-2">
                <img src={p.avatar} className="w-8 h-8 rounded-full bg-white" alt="p" />
                <span className="text-sm font-black text-amber-950">{p.name}</span>
              </div>
              <span className="text-xs font-bold text-amber-700">{p.totalScore}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
