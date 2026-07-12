import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Clock, Inbox, Send } from 'lucide-react';

export default function Requests({ onNavigate }) {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    const token = localStorage.getItem('skillSwapToken');
    try {
      const response = await fetch('http://localhost:5000/api/users/swaps', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIncoming(data.incoming);
        setOutgoing(data.outgoing);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    const token = localStorage.getItem('skillSwapToken');
    try {
      const response = await fetch(`http://localhost:5000/api/users/swap/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => onNavigate('marketplace')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
              <Inbox size={20} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Incoming Requests</h2>
          </div>
          
          {incoming.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 border border-slate-100 text-center text-slate-500">
              No incoming swap requests at the moment.
            </div>
          ) : (
            <div className="grid gap-4">
              {incoming.map(req => (
                <div key={req._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{req.senderId.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium mb-2">{req.senderId.title}</p>
                    <div className="flex gap-2">
                      {req.senderId.skillsHave.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-md border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {req.status === 'pending' ? (
                      <>
                        <button onClick={() => handleUpdate(req._id, 'accepted')} className="flex items-center gap-1 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg font-bold text-sm transition-colors">
                          <Check size={16} /> Accept
                        </button>
                        <button onClick={() => handleUpdate(req._id, 'rejected')} className="flex items-center gap-1 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg font-bold text-sm transition-colors">
                          <X size={16} /> Decline
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide ${req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center shadow-inner">
              <Send size={20} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Outgoing Requests</h2>
          </div>

          {outgoing.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 border border-slate-100 text-center text-slate-500">
              You haven't sent any swap requests yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {outgoing.map(req => (
                <div key={req._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{req.receiverId.name}</h3>
                    <p className="text-sm text-teal-600 font-medium mb-2">{req.receiverId.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === 'pending' && <Clock size={16} className="text-amber-500" />}
                    {req.status === 'accepted' && <Check size={16} className="text-emerald-500" />}
                    {req.status === 'rejected' && <X size={16} className="text-rose-500" />}
                    <span className="font-bold text-sm text-slate-600 uppercase tracking-wide">
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}