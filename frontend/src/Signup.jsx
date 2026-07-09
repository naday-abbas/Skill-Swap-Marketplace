import React, { useState } from 'react';

export default function Signup({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    bio: '',
    skillsHave: '',
    skillsWant: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Creating account...' });

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      title: formData.title,
      bio: formData.bio,
      skillsHave: formData.skillsHave.split(',').map(skill => skill.trim()).filter(Boolean),
      skillsWant: formData.skillsWant.split(',').map(skill => skill.trim()).filter(Boolean)
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Account created successfully. Redirecting...' });
        localStorage.setItem('skillSwapToken', data.token);
        setFormData({ name: '', email: '', password: '', title: '', bio: '', skillsHave: '', skillsWant: '' });
        
        setTimeout(() => {
          onNavigate('marketplace');
        }, 1500);

      } else {
        setStatus({ type: 'error', message: data.message || 'Registration failed.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Connection error. Please check server status.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 font-sans selection:bg-cyan-500/30">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-[0_0_40px_rgba(6,182,212,0.05)] p-8">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-[0_0_15px_rgba(6,182,212,0.5)] mx-auto mb-4">
            ⇄
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
          <p className="text-sm text-slate-500 mt-2">Join the SkillSwap marketplace</p>
        </div>

        {status.message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-mono border ${
            status.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
            status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
          }`}>
            &gt; {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Password</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Professional Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 transition-colors" placeholder="e.g. Frontend Developer" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="2"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 transition-colors" placeholder="Briefly describe what you do..." />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Skills You Have (Comma Separated)</label>
            <input type="text" name="skillsHave" value={formData.skillsHave} onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 font-mono text-sm transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Skills You Want (Comma Separated)</label>
            <input type="text" name="skillsWant" value={formData.skillsWant} onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 font-mono text-sm transition-colors" />
          </div>

          <button type="submit" disabled={status.type === 'loading'}
            className="w-full py-3.5 px-4 mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-sm transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed">
            {status.type === 'loading' ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => onNavigate('marketplace')} className="text-sm text-cyan-500/80 hover:text-cyan-400 transition-colors font-medium">
            ← Return to Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}