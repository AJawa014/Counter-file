
import React, { useState } from 'react';
import { PaymentLog } from '../types';
import { formatDate } from '../utils';
import { Users, CreditCard, ChevronLeft, LogOut } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  payments: PaymentLog[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, payments }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === (process.env as any).ADMIN_USERNAME && password === (process.env as any).ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid Credentials');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black z-[110] flex items-center justify-center p-8">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 animate-ios">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold">Admin Portal</h2>
            <p className="text-white/40 text-sm">Enter credentials to proceed</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl px-4 text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl px-4 text-white"
            />
            <button type="submit" className="w-full h-14 bg-blue-600 font-bold rounded-2xl">Sign In</button>
            <button type="button" onClick={onClose} className="w-full text-white/40 text-sm">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="fixed inset-0 bg-black z-[110] safe-top flex flex-col animate-ios">
      <header className="p-6 flex justify-between items-center border-b border-white/5">
        <button onClick={onClose} className="text-blue-500 flex items-center space-x-1">
          <ChevronLeft size={20} />
          <span>Exit</span>
        </button>
        <h2 className="font-bold">Command Center</h2>
        <div className="w-8" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 p-4 rounded-3xl border border-white/5">
            <div className="text-blue-500 mb-2"><Users size={20} /></div>
            <div className="text-2xl font-bold">{payments.length}</div>
            <div className="text-[10px] text-white/40 uppercase font-bold">Total Users</div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-3xl border border-white/5">
            <div className="text-green-500 mb-2"><CreditCard size={20} /></div>
            <div className="text-2xl font-bold">₦{totalRevenue}</div>
            <div className="text-[10px] text-white/40 uppercase font-bold">Revenue</div>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest px-2">Recent Transactions</h3>
          <div className="space-y-2">
            {payments.length === 0 ? (
              <p className="text-center py-8 text-white/20">No payments yet</p>
            ) : (
              payments.map(log => (
                <div key={log.id} className="p-4 bg-zinc-900 rounded-2xl flex justify-between items-center border border-white/5">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{log.customerName}</p>
                    <p className="text-[10px] text-white/30">{formatDate(log.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-500 font-bold text-sm">+{log.amount}</p>
                    <p className="text-[8px] text-green-500 uppercase font-bold">Successful</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
