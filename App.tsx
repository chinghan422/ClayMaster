
import React, { useState, useEffect } from 'react';
import { UserRole, Participant, Round, Submission, QuestionPoolItem, AppState, AdminAccount } from './types';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { ParticipantLogin } from './components/ParticipantLogin';
import { AudienceView } from './components/AudienceView';
import { AdminPanel } from './components/AdminPanel';
import { ImageModal } from './components/ImageModal';
import { LandingPage } from './components/LandingPage';
import { PastHighlights } from './components/PastHighlights';
import { AwardsView } from './components/AwardsView';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [currentView, setCurrentView] = useState<'HOME' | 'HIGHLIGHTS' | 'AWARDS'>('HOME');
  const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<string | null>(null);
  const [guestNickname, setGuestNickname] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  
  const [state, setState] = useState<AppState>({
    participants: [],
    admins: [{ username: 'admin', password: 'q' }], 
    questionPool: [],
    rounds: [],
    submissions: []
  });

  const activeRound = state.rounds.find(r => r.status === 'ACTIVE');
  const [lastRevealedRoundId, setLastRevealedRoundId] = useState<string | null>(null);

  useEffect(() => {
    if (activeRound && activeRound.isTopicRevealed && activeRound.id !== lastRevealedRoundId) {
      setPreviewImage({ url: activeRound.topicImage, title: `第 ${activeRound.roundNumber} 輪：比賽題目揭曉！` });
      setLastRevealedRoundId(activeRound.id);
    }
  }, [activeRound, lastRevealedRoundId]);

  // Auth Handlers
  const handleAdminLogin = (u: string, p: string) => {
    const found = state.admins.find(a => a.username === u && a.password === p);
    if (found) {
      setCurrentAdminUser(u);
      setRole(UserRole.ADMIN);
      setShowLoginMenu(false);
      return true;
    }
    return false;
  };

  const handleParticipantLogin = (id: string) => {
    setCurrentParticipantId(id);
    setRole(UserRole.PARTICIPANT);
    setShowLoginMenu(false);
  };

  const handleGuestEntry = () => {
    setRole(UserRole.AUDIENCE);
    setShowLoginMenu(false);
  };

  const handleLogout = () => {
    setRole(UserRole.NONE);
    setCurrentParticipantId(null);
    setCurrentAdminUser(null);
    setGuestNickname(null); 
    setCurrentView('HOME');
  };

  // Participant CRUD
  const addParticipant = (name: string, id: string) => {
    const newP: Participant = {
      id,
      name,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${id}`
    };
    setState(prev => ({ ...prev, participants: [...prev.participants, newP] }));
  };

  const updateParticipant = (id: string, newName: string) => {
    setState(prev => ({
      ...prev,
      participants: prev.participants.map(p => p.id === id ? { ...p, name: newName } : p)
    }));
  };

  const deleteParticipant = (id: string) => {
    setState(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id),
      questionPool: prev.questionPool.filter(q => q.contributorId !== id)
    }));
  };

  // Admin CRUD
  const addAdmin = (username: string, password: string) => {
    setState(prev => ({ ...prev, admins: [...prev.admins, { username, password }] }));
  };

  const updateAdmin = (username: string, newPassword: string) => {
    setState(prev => ({
      ...prev,
      admins: prev.admins.map(a => a.username === username ? { ...a, password: newPassword } : a)
    }));
  };

  const deleteAdmin = (username: string) => {
    if (username === 'admin') return alert('不可刪除預設管理員帳號。');
    setState(prev => ({
      ...prev,
      admins: prev.admins.filter(a => a.username !== username)
    }));
  };

  const uploadToPool = (imageUrl: string, contributorId?: string) => {
    const cid = contributorId || currentParticipantId || 'ADMIN';
    const newItem: QuestionPoolItem = {
      id: Math.random().toString(36).substr(2, 9),
      imageUrl,
      contributorId: cid
    };
    setState(prev => ({ ...prev, questionPool: [...prev.questionPool, newItem] }));
  };

  const updateSubmissionImage = (roundId: string, participantId: string, imageUrl: string) => {
    setState(prev => ({
      ...prev,
      submissions: prev.submissions.map(s => 
        (s.roundId === roundId && s.participantId === participantId) 
          ? { ...s, imageUrl, timestamp: Date.now() } 
          : s
      )
    }));
  };

  const deleteFromPool = (itemId: string) => {
    setState(prev => ({ ...prev, questionPool: prev.questionPool.filter(item => item.id !== itemId) }));
  };

  const createRound = (roundNumber: number, selectedIds: string[]) => {
    const usedTopicImages = state.rounds.map(r => r.topicImage);
    const availablePool = state.questionPool.filter(item => !usedTopicImages.includes(item.imageUrl));
    
    if (availablePool.length === 0) return alert('題庫已無不重複的題目！請上傳更多創意。');

    const randomIdx = Math.floor(Math.random() * availablePool.length);
    const topicImage = availablePool[randomIdx].imageUrl;
    const newRound: Round = {
      id: Math.random().toString(36).substr(2, 9),
      roundNumber,
      topicImage,
      isTopicRevealed: false,
      status: 'UPCOMING',
      participantIds: selectedIds
    };
    setState(prev => ({ ...prev, rounds: [...prev.rounds, newRound] }));
  };

  const revealAndStart = (roundId: string) => {
    setState(prev => {
      const updatedRounds = prev.rounds.map(r => r.id === roundId ? { ...r, isTopicRevealed: true, status: 'ACTIVE' as const } : r);
      const round = prev.rounds.find(r => r.id === roundId);
      const newSubs = [...prev.submissions];
      if (round) {
        round.participantIds.forEach(pid => {
          if (!newSubs.some(s => s.roundId === roundId && s.participantId === pid)) {
            newSubs.push({ id: `sub-${roundId}-${pid}`, participantId: pid, roundId: roundId, imageUrl: '', timestamp: Date.now(), scores: {} });
          }
        });
      }
      return { ...prev, rounds: updatedRounds, submissions: newSubs };
    });
  };

  const completeRound = (roundId: string) => {
    setState(prev => ({ ...prev, rounds: prev.rounds.map(r => r.id === roundId ? { ...r, status: 'COMPLETED' as const } : r) }));
  };

  const rateSubmission = (subId: string, score: number, voterNickname: string) => {
    setState(prev => ({
      ...prev,
      submissions: prev.submissions.map(s => s.id === subId ? { ...s, scores: { ...s.scores, [voterNickname]: score } } : s)
    }));
  };

  const loggedInParticipant = state.participants.find(p => p.id === currentParticipantId);

  const showLogout = (role === UserRole.ADMIN && currentAdminUser) || 
                     (role === UserRole.PARTICIPANT && currentParticipantId) ||
                     (role === UserRole.AUDIENCE && guestNickname);

  return (
    <div className="min-h-screen pb-20 bg-[#fffcf9]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setRole(UserRole.NONE); setCurrentView('HOME'); }}>
              <div className="w-10 h-10 bg-amber-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg hover:rotate-6 transition-transform">C</div>
              <h1 className="text-xl font-black text-amber-900 hidden sm:block">ClayMaster</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
               <button 
                 onClick={() => { setCurrentView('HOME'); setRole(UserRole.NONE); }}
                 className={`px-4 py-2 text-sm font-black rounded-xl transition-all ${currentView === 'HOME' && role === UserRole.NONE ? 'bg-amber-100 text-amber-900' : 'text-amber-900/40 hover:text-amber-900'}`}
               >
                 首頁
               </button>
               <button 
                 onClick={() => { setCurrentView('HIGHLIGHTS'); setRole(UserRole.NONE); }}
                 className={`px-4 py-2 text-sm font-black rounded-xl transition-all ${currentView === 'HIGHLIGHTS' ? 'bg-amber-100 text-amber-900' : 'text-amber-900/40 hover:text-amber-900'}`}
               >
                 賽事回顧
               </button>
               <button 
                 onClick={() => { setCurrentView('AWARDS'); setRole(UserRole.NONE); }}
                 className={`px-4 py-2 text-sm font-black rounded-xl transition-all ${currentView === 'AWARDS' ? 'bg-amber-100 text-amber-900' : 'text-amber-900/40 hover:text-amber-900'}`}
               >
                 頒獎典禮
               </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
             {role === UserRole.NONE ? (
               <div className="relative">
                 <button 
                   onClick={() => setShowLoginMenu(!showLoginMenu)}
                   className="bg-amber-900 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-md hover:bg-black transition-all active:scale-95 flex items-center gap-2"
                 >
                   登入 / 觀賽
                   <span className={`text-[10px] transition-transform ${showLoginMenu ? 'rotate-180' : ''}`}>▼</span>
                 </button>
                 
                 {showLoginMenu && (
                   <div className="absolute right-0 mt-3 w-48 bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden z-50 py-2 animate-in slide-in-from-top-2">
                     <button onClick={() => { setRole(UserRole.PARTICIPANT); setShowLoginMenu(false); }} className="w-full text-left px-5 py-3 text-sm font-black text-amber-950 hover:bg-blue-50 hover:text-blue-900 transition-colors">🎨 參賽者入口</button>
                     <button onClick={() => { setRole(UserRole.AUDIENCE); setShowLoginMenu(false); }} className="w-full text-left px-5 py-3 text-sm font-black text-amber-950 hover:bg-red-50 hover:text-red-900 transition-colors">🍿 觀眾入口</button>
                     <div className="h-px bg-amber-50 my-1"></div>
                     <button onClick={() => { setRole(UserRole.ADMIN); setShowLoginMenu(false); }} className="w-full text-left px-5 py-3 text-sm font-black text-amber-950 hover:bg-amber-50 transition-colors">⚙️ 管理後台</button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="flex items-center gap-4 animate-in slide-in-from-right-2">
                  {role === UserRole.PARTICIPANT && loggedInParticipant && (
                    <div className="flex items-center gap-3 bg-blue-50 px-3 py-1.5 rounded-2xl border border-blue-100 shadow-sm">
                      <img src={loggedInParticipant.avatar} className="w-8 h-8 rounded-full bg-white border border-blue-200" alt="me" />
                      <p className="text-sm font-black text-blue-900 hidden sm:block">{loggedInParticipant.name}</p>
                    </div>
                  )}
                  {role === UserRole.AUDIENCE && guestNickname && (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-2xl border border-red-100 shadow-sm">
                       <span className="text-sm">👤</span>
                       <p className="text-sm font-black text-red-900 hidden sm:block">{guestNickname}</p>
                    </div>
                  )}
                  {role === UserRole.ADMIN && currentAdminUser && (
                    <div className="flex items-center gap-2 bg-amber-100 px-4 py-1.5 rounded-2xl border border-amber-200">
                       <span className="text-xs font-black text-amber-950">{currentAdminUser}</span>
                    </div>
                  )}
                  {showLogout && (
                    <button onClick={handleLogout} className="text-xs font-black text-amber-900/40 hover:text-red-600 transition-colors px-2 py-1">登出</button>
                  )}
               </div>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {role === UserRole.NONE && (
          <>
            {currentView === 'HOME' && (
              <LandingPage 
                activeRound={activeRound} 
                participants={state.participants} 
                rounds={state.rounds}
                submissions={state.submissions}
                onSelectRole={(r) => r === UserRole.AUDIENCE ? handleGuestEntry() : setRole(r)} 
                onImageClick={(url, title) => setPreviewImage({ url, title })}
              />
            )}
            {currentView === 'HIGHLIGHTS' && (
              <PastHighlights 
                rounds={state.rounds}
                participants={state.participants}
                submissions={state.submissions}
                onImageClick={(url, title) => setPreviewImage({ url, title })}
              />
            )}
            {currentView === 'AWARDS' && (
              <AwardsView 
                participants={state.participants}
                submissions={state.submissions}
              />
            )}
          </>
        )}

        {role === UserRole.ADMIN && (
          currentAdminUser ? (
            <AdminPanel 
              participants={state.participants}
              admins={state.admins}
              questionPool={state.questionPool}
              rounds={state.rounds}
              onAddParticipant={addParticipant}
              onUpdateParticipant={updateParticipant}
              onDeleteParticipant={deleteParticipant}
              onAddAdmin={addAdmin}
              onUpdateAdmin={updateAdmin}
              onDeleteAdmin={deleteAdmin}
              onCreateRound={createRound}
              onRevealAndStart={revealAndStart}
              onCompleteRound={completeRound}
              onUploadToPool={(url) => uploadToPool(url, 'ADMIN')}
              onDeleteFromPool={deleteFromPool}
            />
          ) : (
             <AdminLogin onLogin={handleAdminLogin} />
          )
        )}

        {role === UserRole.PARTICIPANT && (
          loggedInParticipant ? (
            <ParticipantDashboard 
              participant={loggedInParticipant}
              activeRound={state.rounds.find(r => r.status === 'ACTIVE')}
              submissions={state.submissions}
              questionPool={state.questionPool}
              onUploadToPool={uploadToPool}
              onUploadSubmission={(url) => activeRound && updateSubmissionImage(activeRound.id, loggedInParticipant.id, url)}
              onDeleteFromPool={deleteFromPool}
              onLogout={handleLogout}
              onImageClick={(url, title) => setPreviewImage({ url, title })}
            />
          ) : (
            <ParticipantLogin participants={state.participants} onLogin={handleParticipantLogin} />
          )
        )}

        {role === UserRole.AUDIENCE && (
          <AudienceView 
            rounds={state.rounds}
            participants={state.participants}
            submissions={state.submissions}
            nickname={guestNickname}
            setNickname={setGuestNickname}
            onRate={rateSubmission}
            onImageClick={(url, title) => setPreviewImage({ url, title })}
          />
        )}
      </main>

      <ImageModal isOpen={!!previewImage} imageUrl={previewImage?.url || ''} title={previewImage?.title} onClose={() => setPreviewImage(null)} />
    </div>
  );
};

const AdminLogin: React.FC<{ onLogin: (u: string, p: string) => boolean }> = ({ onLogin }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState(false);
  return (
    <div className="clay-card p-10 max-w-md mx-auto space-y-8 border-t-8 border-amber-900 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-2xl font-black text-amber-950">管理員登入</h2>
      </div>
      <div className="space-y-4">
        <input type="text" value={u} onChange={e => setU(e.target.value)} placeholder="管理員帳號" className="w-full p-4 border-2 border-amber-200 placeholder-amber-700/40 rounded-2xl font-black text-amber-950 bg-white outline-none focus:border-amber-900" />
        <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="密碼" className="w-full p-4 border-2 border-amber-200 placeholder-amber-700/40 rounded-2xl font-black text-amber-950 bg-white outline-none focus:border-amber-900" />
      </div>
      {err && <div className="text-red-700 text-xs text-center font-bold">❌ 憑證不正確</div>}
      <button onClick={() => !onLogin(u, p) && setErr(true)} className="w-full bg-amber-900 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-black transition-all">確認進入</button>
    </div>
  );
};

export default App;
