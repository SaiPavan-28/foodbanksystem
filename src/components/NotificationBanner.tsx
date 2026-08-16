import React from 'react';
import { Bell, X, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';

export const NotificationBanner: React.FC = () => {
  const { notifications, clearNotification } = useFoodBridge();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-auto">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className="bg-slate-900 border-2 border-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-right-10 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-400">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-white">{notif.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">{notif.message}</p>
              <span className="text-[9px] text-slate-500 font-mono mt-1 block">{notif.timestamp}</span>
            </div>
          </div>

          <button
            onClick={() => clearNotification(notif.id)}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
