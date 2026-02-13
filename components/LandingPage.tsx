
import React from 'react';
import { UserRole, Round, Participant, Submission } from '../types';

interface LandingPageProps {
  activeRound: Round | undefined;
  participants: Participant[];
  rounds: Round[];
  submissions: Submission[];
  onSelectRole: (role: UserRole) => void;
  onImageClick: (url: string, title: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  activeRound, 
  participants, 
  rounds,
  submissions,
  onSelectRole,
  onImageClick 
}) => {
  const leaderboard = participants.map(p => {
    const pSubmissions = submissions.filter(s => s.participantId === p.id);
    const totalScore = pSubmissions.reduce((acc, curr) => {
      const scoreValues = Object.values(curr.scores);
      const avg = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 0;
      return acc + avg;
    }, 0);
    return { ...p, totalScore: parseFloat(totalScore.toFixed(1)) };
  }).sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-16 py-8">
      {/* 1. 當前賽事區 */}
      <section className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
          Live Match Status
        </div>
        {activeRound ? (
          <div className="clay-card p-10 border-t-8 border-amber-600 max-w-3xl mx-auto shadow-2xl">
            <h2 className="text-3xl font-black text-amber-950 mb-10 italic">第 {activeRound.roundNumber} 輪 熱烈進行中</h2>
            <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-10">
               <div className="flex flex-col items-center gap-4">
                  <div className="flex -space-x-4">
                    {activeRound.participantIds.map(id => {
                      const p = participants.find(part => part.id === id);
                      return (
                        <div key={id} className="group relative">
                          <img src={p?.avatar} className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-white transition-transform group-hover:scale-110 group-hover:z-10" alt={p?.name} />
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-2xl font-black text-amber-900 leading-tight">
                    {activeRound.participantIds.map(id => participants.find(p => p.id === id)?.name).join(' vs ')}
                  </p>
               </div>
               <div className="text-amber-900/20 font-black text-4xl italic">VS</div>
               <div className="group relative cursor-pointer" onClick={() => activeRound.isTopicRevealed && onImageClick(activeRound.topicImage, `第 ${activeRound.roundNumber} 輪題目`)}>
                  <div className="bg-amber-50 p-4 rounded-[32px] border-4 border-amber-100 shadow-inner w-48 aspect-square flex items-center justify-center overflow-hidden transition-all group-hover:border-amber-300">
                    {activeRound.isTopicRevealed ? (
                      <img src={activeRound.topicImage} className="w-full h-full object-contain transition-transform group-hover:scale-110" alt="topic" />
                    ) : (
                      <div className="flex flex-col items-center"><span className="text-5xl animate-pulse">?</span></div>
                    )}
                  </div>
               </div>
            </div>
            <button 
              onClick={() => onSelectRole(UserRole.AUDIENCE)}
              className="bg-red-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-xl active:scale-95 animate-bounce"
            >
               進入賽場評分
            </button>
          </div>
        ) : (
          <div className="clay-card p-12 max-w-2xl mx-auto border-2 border-dashed border-amber-200 bg-amber-50/20">
             <div className="text-6xl mb-6 grayscale opacity-30">⏳</div>
             <h2 className="text-2xl font-black text-amber-900/40 italic">目前沒有進行中的賽事</h2>
          </div>
        )}
      </section>

      {/* 2. 總積分排行榜 */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-amber-100"></div>
          <h2 className="text-2xl font-black text-amber-950 flex items-center gap-2 italic">
            <span className="text-3xl">🏆</span> 積分總榜
          </h2>
          <div className="h-px flex-1 bg-amber-100"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaderboard.map((p, idx) => (
            <div key={p.id} className="clay-card p-5 flex items-center justify-between group transition-all hover:translate-x-2">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-orange-300 text-orange-900' : 'bg-amber-50 text-amber-400'}`}>
                  {idx + 1}
                </div>
                <img src={p.avatar} className="w-12 h-12 rounded-full border-2 border-amber-100 shadow-sm" alt={p.name} />
                <h4 className="font-black text-amber-950">{p.name}</h4>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-amber-900">{p.totalScore}</p>
                <p className="text-[10px] font-black text-amber-400 uppercase">Points</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
