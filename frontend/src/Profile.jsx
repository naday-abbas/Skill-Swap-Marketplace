import React, { useState, useEffect } from 'react';
import { User, Save, ArrowLeft } from 'lucide-react';

export default function Profile({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '', title: '', bio: '', skillsHave: '', skillsWant: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('skillSwapToken');
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || '',
            title: data.title || '',
            bio: data.bio || '',
            skillsHave: data.skillsHave.join(', ') || '',
            skillsWant: data.skillsWant.join(', ') || ''
          });
        }
      } catch (error) {
        setStatus({ type: 'error', message: 'Failed to load profile' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    const token = localStorage.getItem('skillSwapToken');
    
    const payload = {
      ...formData,
      skillsHave: formData.skillsHave.split(',').map(s => s.trim()).filter(Boolean),
      skillsWant: formData.skillsWant.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatus({ type: 'success', message: 'Profile updated successfully' });
      } else {
        setStatus({ type: 'error', message: 'Update failed' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network connection failed' });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => onNavigate('marketplace')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="bg-white rounded-[24px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Your Profile</h2>
              <p className="text-slate-500 font-medium">Manage your public marketplace presence.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {status.message && (
              <div className={`p-4 rounded-xl text-sm font-bold ${status.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                {status.message}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Display Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Professional Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Bio</label>
              <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 h-28" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Skills You Offer (comma separated)</label>
              <input type="text" value={formData.skillsHave} onChange={(e) => setFormData({...formData, skillsHave: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Skills You Need (comma separated)</label>
              <input type="text" value={formData.skillsWant} onChange={(e) => setFormData({...formData, skillsWant: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800" />
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md hover:shadow-emerald-500/25">
              <Save size={18} /> Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}