
import React, { useState, useRef } from 'react';
import { Participant, Round, QuestionPoolItem, AdminAccount } from '../types';

interface AdminPanelProps {
  participants: Participant[];
  admins: AdminAccount[];
  questionPool: QuestionPoolItem[];
  rounds: Round[];
  onAddParticipant: (name: string, id: string) => void;
  onUpdateParticipant: (id: string, newName: string) => void;
  onDeleteParticipant: (id: string) => void;
  onAddAdmin: (username: string, password: string) => void;
  onUpdateAdmin: (username: string, newPassword: string) => void;
  onDeleteAdmin: (username: string) => void;
  onCreateRound: (roundNumber: number, selectedIds: string[]) => void;
  onRevealAndStart: (roundId: string) => void;
  onCompleteRound: (roundId: string) => void;
  onUploadToPool: (imageUrl: string) => void;
  onDeleteFromPool: (itemId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  participants, 
  admins,
  questionPool, 
  rounds, 
  onAddParticipant,
  onUpdateParticipant,
  onDeleteParticipant,
  onAddAdmin,
  onUpdateAdmin,
  onDeleteAdmin,
  onCreateRound,
  onRevealAndStart,
  onCompleteRound,
  onUploadToPool,
  onDeleteFromPool
}) => {
  const [tab, setTab] = useState<'MATCH' | 'ACCOUNTS' | 'POOL'>('MATCH');
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const poolFileRef = useRef<HTMLInputElement>(null);
  
  const currentRoundNum = rounds.length + 1;
  const usedTopicImages = rounds.map(r => r.topicImage);
  const availablePool = questionPool.filter(item => !usedTopicImages.includes(item.imageUrl));

  const handleAddParticipant = () => {
    if (newName.trim() && newId.trim()) {
      if (participants.some(p => p.id === newId.trim())) return alert('ID 已存在');
      onAddParticipant(newName.trim(), newId.trim());
      setNewName(''); setNewId('');
    }
  };

  const handleAddAdmin = () => {
    if (newAdminUser.trim() && newAdminPass.trim()) {
      if (admins.some(a => a.username === newAdminUser.trim())) return alert('管理員帳號已存在');
      onAddAdmin(newAdminUser.trim(), newAdminPass.trim());
      setNewAdminUser(''); setNewAdminPass('');
    }
  };

  const handleCreateRound = () => {
    if (selectedParticipants.length < 2) return alert('至少選擇兩位參賽者');
    if (availablePool.length === 0) return alert('題庫已無不重複題目！');
    onCreateRound(currentRoundNum, selectedParticipants);
    setSelectedParticipants([]);
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUploadToPool(reader.result as string);
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex bg-amber-100/50 p-1.5 rounded-2xl border border-amber-100 shadow-inner max-w-sm mx-auto">
        <button onClick={() => setTab('MATCH')} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${tab === 'MATCH' ? 'bg-white text-amber-950 shadow-sm' : 'text-amber-700/60'}`}>賽程控制</button>
        <button onClick={() => setTab('POOL')} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${tab === 'POOL' ? 'bg-white text-amber-950 shadow-sm' : 'text-amber-700/60'}`}>題庫管理</button>
        <button onClick={() => setTab('ACCOUNTS')} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${tab === 'ACCOUNTS' ? 'bg-white text-amber-950 shadow-sm' : 'text-amber-700/60'}`}>帳號管理</button>
      </div>

      {tab === 'MATCH' && (
        <div className="space-y-8">
          <div className="clay-card p-6 border-l-8 border-emerald-700">
            <h2 className="text-xl font-bold text-amber-950 mb-4">🎮 準備下一場比賽 (Round {currentRoundNum})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <p className="text-sm font-black text-amber-950 mb-2">1. 選取參賽者：</p>
                <div className="bg-white p-2 border-2 border-amber-300 rounded-2xl h-48 overflow-y-auto shadow-inner">
                    {participants.length > 0 ? participants.map(p => (
                      <label key={p.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer mb-1 transition-colors ${selectedParticipants.includes(p.id) ? 'bg-amber-100/70' : 'hover:bg-amber-50'}`}>
                        <input type="checkbox" checked={selectedParticipants.includes(p.id)} onChange={() => toggleParticipant(p.id)} className="w-5 h-5 accent-emerald-700 rounded"/>
                        <span className="text-sm font-black text-amber-950">{p.name}</span>
                      </label>
                    )) : <p className="text-center py-10 text-xs text-amber-300 font-bold italic">尚無參賽者，請先至帳號管理建立</p>}
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-center">
                <p className="text-sm font-black text-amber-950 mb-0">2. 確認就緒：</p>
                <button onClick={handleCreateRound} className="w-full bg-emerald-700 text-white font-black py-8 rounded-2xl hover:bg-emerald-800 transition shadow-lg active:scale-95 text-2xl">啟動新回合</button>
                <div className="text-xs font-black text-amber-900 bg-amber-100/50 p-3 rounded-xl border border-amber-200">
                  📦 可用不重複題目：{availablePool.length} 個
                </div>
              </div>
            </div>
          </div>
          <div className="clay-card p-6 border-l-8 border-amber-50">
            <h2 className="text-xl font-bold text-amber-950 mb-4">📋 即將進行 / 進行中</h2>
            <div className="space-y-4">
              {rounds.filter(r => r.status !== 'COMPLETED').length > 0 ? rounds.filter(r => r.status !== 'COMPLETED').map(round => (
                <div key={round.id} className="p-5 bg-white border-2 border-amber-100 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] font-black bg-amber-950 text-white px-2 py-0.5 rounded-full mb-1 inline-block uppercase">ROUND {round.roundNumber}</span>
                    <p className="text-lg font-black text-amber-950">{round.participantIds.map(id => participants.find(p => p.id === id)?.name || '未知名').join(' vs ')}</p>
                  </div>
                  <div className="flex gap-2">
                    {!round.isTopicRevealed ? (
                      <button onClick={() => onRevealAndStart(round.id)} className="bg-amber-600 text-white text-xs px-6 py-3 rounded-xl font-black shadow-lg animate-bounce">✨ 揭曉題目</button>
                    ) : (
                      <button onClick={() => onCompleteRound(round.id)} className="bg-black text-white text-xs px-6 py-3 rounded-xl font-black shadow-lg">🏁 結束回合</button>
                    )}
                  </div>
                </div>
              )) : <p className="text-center py-10 text-xs text-amber-300 font-bold italic">目前無待處理賽程</p>}
            </div>
          </div>
        </div>
      )}

      {tab === 'POOL' && (
        <div className="clay-card p-6 border-l-8 border-amber-900 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-amber-950">📦 全局題庫管理</h2>
            <button 
              onClick={() => poolFileRef.current?.click()}
              className="bg-amber-900 text-white text-xs px-5 py-2.5 rounded-xl font-black hover:bg-black transition-all"
            >
              + 管理員上傳題目
            </button>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={poolFileRef} onChange={handleFileUpload} />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {questionPool.length > 0 ? questionPool.map(item => (
              <div key={item.id} className="relative group aspect-square bg-white border-2 border-amber-50 rounded-2xl overflow-hidden shadow-sm">
                <img src={item.imageUrl} className="w-full h-full object-contain" alt="pool item" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                   <p className="text-[8px] text-white font-black mb-2">提供者: {item.contributorId === 'ADMIN' ? '管理員' : (participants.find(p => p.id === item.contributorId)?.name || '未知')}</p>
                   <button onClick={() => onDeleteFromPool(item.id)} className="bg-red-500 text-white text-[10px] px-2 py-1 rounded font-black">刪除</button>
                </div>
                {usedTopicImages.includes(item.imageUrl) && (
                  <div className="absolute top-1 left-1 bg-amber-400 text-[8px] font-black px-1 rounded">已用</div>
                )}
              </div>
            )) : <p className="col-span-full text-center py-20 text-xs text-amber-300 font-bold">題庫尚無內容</p>}
          </div>
        </div>
      )}

      {tab === 'ACCOUNTS' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
           <div className="clay-card p-6 border-l-8 border-amber-900">
             <h2 className="text-xl font-bold text-amber-950 mb-4">🛡️ 管理員帳號設定</h2>
             <div className="flex flex-col sm:flex-row gap-2 mb-6">
               <input type="text" value={newAdminUser} onChange={(e) => setNewAdminUser(e.target.value)} placeholder="帳號" className="flex-1 p-3 border-2 border-amber-300 rounded-xl font-black text-sm" />
               <input type="password" value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} placeholder="密碼" className="flex-1 p-3 border-2 border-amber-300 rounded-xl font-black text-sm" />
               <button onClick={handleAddAdmin} className="bg-amber-900 text-white px-6 py-2 rounded-xl font-black text-sm">建立</button>
             </div>
             <div className="space-y-2">
               {admins.map(a => (
                 <div key={a.username} className="bg-amber-50/50 p-3 rounded-2xl flex items-center justify-between border border-amber-100">
                   <span className="font-bold text-amber-950">{a.username}</span>
                   <div className="flex gap-2">
                     <button onClick={() => { const p = prompt('新密碼', a.password); if (p) onUpdateAdmin(a.username, p); }} className="text-[10px] bg-white border px-3 py-1 rounded-lg font-black text-amber-700">編輯密碼</button>
                     <button onClick={() => a.username !== 'admin' && window.confirm(`刪除管理員 ${a.username}？`) && onDeleteAdmin(a.username)} className={`text-[10px] px-3 py-1 rounded-lg font-black ${a.username === 'admin' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600'}`}>刪除</button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
           <div className="clay-card p-6 border-l-8 border-blue-600">
             <h2 className="text-xl font-bold text-amber-950 mb-4">👥 參賽者管理</h2>
             <div className="flex flex-col sm:flex-row gap-2 mb-6">
               <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="姓名" className="flex-1 p-3 border-2 border-amber-300 rounded-xl font-black text-sm" />
               <input type="text" value={newId} onChange={(e) => setNewId(e.target.value)} placeholder="登入 ID" className="flex-1 p-3 border-2 border-amber-300 rounded-xl font-black text-sm" />
               <button onClick={handleAddParticipant} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-sm">建立選手</button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {participants.length > 0 ? participants.map(p => (
                 <div key={p.id} className="bg-white border-2 border-amber-200 p-4 rounded-[24px] flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-3">
                     <img src={p.avatar} className="w-10 h-10 rounded-full border border-amber-100" alt="p" />
                     <div>
                       <p className="font-black text-amber-950 text-sm">{p.name}</p>
                       <p className="text-[9px] text-amber-400 font-bold">ID: {p.id}</p>
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => { const n = prompt('修改姓名', p.name); if (n) onUpdateParticipant(p.id, n); }} className="text-[10px] bg-amber-50 text-amber-700 font-black px-3 py-1 rounded-lg">改名</button>
                     <button onClick={() => window.confirm(`將永久刪除選手 ${p.name}，確定？`) && onDeleteParticipant(p.id)} className="text-[10px] bg-red-50 text-red-600 font-black px-3 py-1 rounded-lg">刪除</button>
                   </div>
                 </div>
               )) : <p className="col-span-full text-center py-10 text-xs text-amber-300 font-bold">尚未新增任何參賽者</p>}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
