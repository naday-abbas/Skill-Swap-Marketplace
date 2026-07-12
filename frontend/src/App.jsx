import React, { useState, useEffect } from 'react';
import { Search, LogOut, Code, User, ArrowRight, ArrowLeftRight, Check } from 'lucide-react';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import Requests from './Requests';

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("marketplace");
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  const token = localStorage.getItem('skillSwapToken');
  let currentUserId = null;
  
  if (token) {
    try {
      currentUserId = JSON.parse(atob(token.split('.')[1])).userId;
    } catch (e) {
      currentUserId = null;
    }
  }

  useEffect(() => {
    setIsLoggedIn(!!token);

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentView, token]);

  const handleLogout = () => {
    localStorage.removeItem('skillSwapToken');
    setIsLoggedIn(false);
    setSentRequests([]);
    setCurrentView("marketplace");
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSwapRequest = async (userId) => {
    if (!token) {
      setCurrentView("login");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/users/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: userId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast("Swap request sent successfully!", "success");
        setSentRequests(prev => [...prev, userId]);
      } else {
        showToast(data.message || "Failed to send request.", "error");
      }
    } catch (error) {
      showToast("Network connection failed.", "error");
    }
  };

  const filteredUsers = users.filter(user => {
    if (user._id === currentUserId) return false;

    const search = searchTerm.toLowerCase();
    const safeSkillsHave = user.skillsHave || [];
    const safeSkillsWant = user.skillsWant || [];
    const safeTitle = user.title || "";
    
    return (
      user.name.toLowerCase().includes(search) ||
      safeTitle.toLowerCase().includes(search) ||
      safeSkillsHave.some(skill => skill.toLowerCase().includes(search)) ||
      safeSkillsWant.some(skill => skill.toLowerCase().includes(search))
    );
  });

  if (currentView === "signup") {
    return <Signup onNavigate={(view) => setCurrentView(view || "marketplace")} />;
  }

  if (currentView === "login") {
    return <Login onNavigate={(view) => setCurrentView(view || "marketplace")} />;
  }

  if (currentView === "profile") {
    return <Profile onNavigate={(view) => setCurrentView(view || "marketplace")} />;
  }

  if (currentView === "requests") {
    return <Requests onNavigate={(view) => setCurrentView(view || "marketplace")} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2.5 font-extrabold text-2xl text-slate-900 tracking-tight">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Code size={22} strokeWidth={2.5} />
          </div>
          SkillSwap
        </div>
        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <button onClick={() => setCurrentView('requests')} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 flex items-center justify-center transition-colors">
                <ArrowLeftRight size={20} strokeWidth={2.5} />
              </button>
              <button onClick={() => setCurrentView('profile')} className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-600 text-white border border-teal-600 flex items-center justify-center transition-colors shadow-sm">
                <User size={20} />
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentView("login")} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                Log in
              </button>
              <button onClick={() => setCurrentView("signup")} className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md hover:shadow-emerald-500/25">
                Sign up free
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <section className="relative w-full max-w-5xl mx-auto pt-24 pb-20 px-6 text-center z-10">
          <h1 className="text-[3.5rem] leading-[1.1] font-extrabold text-slate-900 mb-6 tracking-tight">
            Swap Skills. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Build Your Dream Project.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Connect with elite developers and designers. Execute a perfect knowledge exchange to level up your freelance business and personal projects.
          </p>
          
          <div className="relative max-w-2xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl bg-white p-2.5 border border-slate-100 flex items-center group focus-within:shadow-[0_8px_30px_rgb(16,185,129,0.15)] focus-within:border-emerald-200 transition-all duration-300">
            <div className="pl-4 pr-2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search by name, tech stack, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-2 pr-4 py-3.5 bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-lg font-medium"
            />
          </div>
        </section>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Fetching marketplace data...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUsers.map((user) => {
              const hasSent = sentRequests.includes(user._id);
              
              return (
                <div key={user._id} className="bg-white rounded-[24px] p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner border border-emerald-100/50 flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-xl text-slate-900 tracking-tight truncate">{user.name}</h3>
                      <p className="text-sm font-semibold text-emerald-500 truncate">{user.title}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-[15px] mb-8 flex-grow leading-relaxed font-medium line-clamp-3">
                    {user.bio}
                  </p>
                  
                  <div className="mb-8 space-y-5">
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Offers</span>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsHave.map((skill, index) => (
                          <span key={index} className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200/50 shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Needs</span>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsWant.map((skill, index) => (
                          <span key={index} className="px-3.5 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => !hasSent && handleSwapRequest(user._id)}
                    disabled={hasSent}
                    className={`w-full flex items-center justify-center gap-2 py-4 font-bold rounded-xl text-[15px] transition-all duration-300 mt-auto ${
                      hasSent
                        ? 'bg-slate-50 text-emerald-600 cursor-not-allowed border border-emerald-200'
                        : 'bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 group-hover:bg-slate-800'
                    }`}
                  >
                    {hasSent ? (
                      <>
                        Request Sent
                        <Check size={18} strokeWidth={2.5} />
                      </>
                    ) : (
                      <>
                        Request Swap
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white/50 backdrop-blur-sm rounded-[32px] border border-slate-200/60 shadow-sm max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-slate-100">
              <User size={40} className="text-slate-300" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">No Profiles Found</h3>
            <p className="text-slate-500 max-w-md font-medium text-lg leading-relaxed">
              No matching profiles found in the database. Adjust your search parameters.
            </p>
          </div>
        )}
      </main>

      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm z-[100] transition-all transform duration-300 flex items-center gap-3 ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}