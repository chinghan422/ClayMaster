
import React, { useState } from 'react';
import { Participant } from '../types';

interface ParticipantLoginProps {
  participants: Participant[];
  onLogin: (participantId: string) => void;
}

export const ParticipantLogin: React.FC<ParticipantLoginProps> = ({ participants, onLogin }) => {
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = participants.find(p => p.id.toLowerCase() === inputId.toLowerCase().trim());
    if (found) {
      onLogin(found.id);
      setError('');
    } else {
      setError('找不到此 ID，請向管理員確認您的參賽編號。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="clay-card p-10 w-full max-w-md space-y-8 border-t-8 border-amber-600">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
            🔑
          </div>
          <h2 className="text-2xl font-black text-amber-900">參賽者登入</h2>
          <p className="mt-2 text-sm text-amber-700 font-medium">請輸入管理員提供的 Chat ID</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="id-input" className="sr-only">參賽者 Chat ID</label>
              <input
                id="id-input"
                name="id"
                type="text"
                required
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                // 優化：顏色對比度提升至 text-slate-950 以確保清晰
                className="appearance-none relative block w-full px-4 py-4 border-2 border-amber-200 placeholder-amber-400 text-slate-950 rounded-2xl focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm font-black tracking-widest bg-white"
                placeholder="Chat ID (例如: luciahuang)"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-700 text-xs text-center font-bold bg-red-50 py-2 rounded-lg border border-red-200 animate-pulse">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg transition-all active:scale-95"
            >
              進入大賽系統
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-amber-50">
          <p className="text-[10px] text-center text-amber-500 font-bold uppercase tracking-widest">
            Secure Entry for ClayMaster Participants Only
          </p>
        </div>
      </div>
    </div>
  );
};
