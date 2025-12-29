
import React, { useState, useMemo } from 'react';
import { PaymentLog } from '../types';
import { formatDate } from '../utils';
import { Users, CreditCard, ChevronLeft, Search, Filter, Download, ShieldAlert, TrendingUp, Activity, Smartphone } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  payments: PaymentLog[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, payments }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === (process.env as any).ADMIN_USERNAME && password === (process.env as any).ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert('Security Breach: Invalid Admin Credentials');
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(p => 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [payments, searchQuery]);

  const stats = useMemo(() => {
    const total = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const growth = payments.length > 0 ? "+100%" : "0%";
    return { total, count: payments.length, growth };
  }, [payments]);

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black z-[110] flex items-center justify-center p-8 backdrop-blur-2xl">
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-8 animate-ios relative z-10">
          <div className="flex flex-col items-center space-y-4">
            <img src="/logo.png" className="w-20 h-20 rounded-3xl border border-white/10 shadow-2xl" />
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-tight">Admin Terminal</h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Authorized Access Only</p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-16 bg-zinc-900 border border-white/5 rounded-2xl px-6 text-white text-lg focus:border-blue-500/50 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 bg-zinc-900 border border-white/5 rounded-2xl px-6 text-white text-lg focus:border-blue-500/50 transition-colors"
            />
            <button type="submit" className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
              Login to Command Center
            </button>
            <button type="button" onClick={onClose} className="w-full text-white/30 text-xs font-bold uppercase tracking-widest py-2">
              Back to App
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[110] safe-top flex flex-col animate-ios overflow-hidden">
      <header className="p-6 flex justify-between items-center border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <button onClick={onClose} className="text-blue-500 font-bold flex items-center space-x-1 active:opacity-50">
          <ChevronLeft size={20} />
          <span>Exit</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-sm tracking-tight">V2 Command Center</h2>
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">System Online</span>
          </div>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {/* Analytics Section */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 p-5 rounded-[2rem] border border-white/5 space-y-2">
            <div className="flex justify-between items-start text-blue-500">
              <Users size={20} />
              <span className="text-[8px] font-bold bg-blue-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest">{stats.growth}</span>
            </div>
            <div>
              <p className="text-2xl font-black">{stats.count}</p>
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Total Users</p>
            </div>
          </div>
          <div className="bg-zinc-900/40 p-5 rounded-[2rem] border border-white/5 space-y-2">
            <div className="flex justify-between items-start text-green-500">
              <CreditCard size={20} />
              <span className="text-[8px] font-bold bg-green-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest">NGN</span>
            </div>
            <div>
              <p className="text-2xl font-black">₦{stats.total}</p>
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Total Revenue</p>
            </div>
          </div>
        </section>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-zinc-900/60 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:bg-zinc-900 transition-all outline-none"
          />
        </div>

        {/* User Registry */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">User Registry</h3>
            <div className="flex items-center space-x-2 text-[10px] text-blue-500 font-bold">
              <Activity size={12} />
              <span>{filteredPayments.length} Users</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-white/5 space-y-4">
                <Search size={48} strokeWidth={1} />
                <p className="text-sm font-medium tracking-tight">No match found in registry</p>
              </div>
            ) : (
              filteredPayments.map(log => (
                <div key={log.id} className="p-5 bg-zinc-900/40 rounded-3xl border border-white/5 space-y-4 hover:bg-zinc-900/60 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-bold text-lg">
                        {log.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white leading-none">{log.customerName}</p>
                        <p className="text-[10px] text-white/30 mt-1">{log.customerEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-500 font-black text-lg leading-none">₦{log.amount}</p>
                      <p className="text-[8px] font-black text-green-500 uppercase tracking-widest mt-1">Confirmed</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-4 text-white/30">
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={12} />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Smartphone size={12} />
                        <span>iPhone</span>
                      </div>
                    </div>
                    <span className="font-mono text-white/20">{log.id.slice(0, 10)}...</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black to-transparent">
        <div className="p-4 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-between shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Security Status</p>
              <p className="text-sm font-bold text-green-500">End-to-End Encrypted</p>
            </div>
          </div>
          <button onClick={() => alert('V2 System update checked: You are on the latest version.')} className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
