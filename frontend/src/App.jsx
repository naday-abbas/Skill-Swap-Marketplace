import React, { useState, useEffect } from 'react';
import Signup from './Signup';
import Login from './Login';

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("marketplace");
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('skillSwapToken');
    if (token) {
      setIsLoggedIn(true);
    }

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
  }, [currentView]);

  const handleLogout = () => {
    localStorage.removeItem('skillSwapToken');
    setIsLoggedIn(false);
    setCurrentView("marketplace");
  };

  const filteredUsers = users.filter(user => {
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

  const handleSwapRequest = (userName) => {
    alert(`Swap request sent to ${userName}!`);
  };

  if (currentView === "signup") {
    return <Signup onNavigate={(view) => setCurrentView(view || "marketplace")} />;
  }

  if (currentView === "login") {
    return <Login onNavigate={(view) => setCurrentView(view || "marketplace")} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30">
      
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              ⇄
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">SkillSwap<span className="text-cyan-400">_</span></span>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-sm font-bold px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20 hover:border-red-500/50"
              >
                Logout
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentView("login")}
                  className="text-sm font-bold px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => setCurrentView("signup")}
                  className="text-sm font-bold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition-colors border border-slate-700 hover:border-cyan-500/50"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
            Trade Skills. <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Build Projects.
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Connect with developers and designers. Execute a perfect knowledge exchange.
          </p>
          
          <div className="relative max-w-md mx-auto group">
            <input
              type="text"
              placeholder="Search by name, tech stack, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3.5 bg-slate-900 border border-slate-700 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm text-slate-100 placeholder-slate-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Fetching marketplace data...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user._id} className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/30 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 flex flex-col justify-between p-6 group">
                <div>
                  <div className="flex items-center space-x-4 mb-5">
                    <div className="w-12 h-12 bg-slate-800 text-cyan-400 font-bold rounded-xl flex items-center justify-center text-lg border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg leading-tight">{user.name}</h3>
                      <p className="text-sm text-cyan-500/80 font-medium">{user.title}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                    {user.bio}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-2">
                        OFFERS
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsHave.map((skill, index) => (
                          <span key={index} className="font-mono text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-2">
                        WANTS
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsWant.map((skill, index) => (
                          <span key={index} className="font-mono text-xs px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSwapRequest(user.name)}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 border border-slate-700 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto">
            <span className="text-4xl block mb-4 opacity-50">📡</span>
            <h3 className="font-bold text-slate-200 text-lg">No Profiles Found</h3>
            <p className="text-slate-500 text-sm mt-2 px-6">
              Database is empty or no matches fit your search. Create an account to populate the marketplace.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}