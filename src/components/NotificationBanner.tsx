import React, { useEffect } from 'react';
import { Bell, X, CheckCircle2, Navigation, AlertCircle, Heart, Sparkles, Building, Trophy, Layers } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';

export const NotificationBanner: React.FC = () => {
  const { notifications, clearNotification, authUser, currentRole } = useFoodBridge();

  const activeRole = authUser?.role || (currentRole === 'public' || currentRole === 'login' ? null : currentRole);
  const currentIdentity = (authUser?.establishmentName || authUser?.name || authUser?.id || '').trim().toLowerCase();

  // Filter notifications strictly for the active logged-in user and role
  const relevantNotifications = notifications.filter(notif => {
    // If not logged in or in public landing, hide operational popups
    if (!activeRole) return false;

    // Admin can audit all notifications
    if (activeRole === 'admin') return true;

    // 1. Role match
    if (notif.recipientRole !== activeRole) {
      return false;
    }

    // 2. Specific recipient identity match (if recipientId was specified)
    if (notif.recipientId && authUser) {
      const targetId = notif.recipientId.trim().toLowerCase();
      const isMatch = (
        authUser.id.toLowerCase() === targetId ||
        authUser.name.toLowerCase() === targetId ||
        (authUser.establishmentName && authUser.establishmentName.toLowerCase() === targetId) ||
        targetId.includes(currentIdentity) ||
        currentIdentity.includes(targetId)
      );
      if (!isMatch) return false;
    }

    return true;
  });

  // Auto-dismiss each notification after 6 seconds so they don't pile up
  useEffect(() => {
    if (relevantNotifications.length === 0) return;

    const timers = relevantNotifications.map(notif => {
      return setTimeout(() => {
        clearNotification(notif.id);
      }, 6000);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [relevantNotifications, clearNotification]);

  if (relevantNotifications.length === 0) return null;

  // Limit display to at most 3 notifications at a time
  const displayNotifs = relevantNotifications.slice(0, 3);

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full space-y-2.5 pointer-events-auto">
      {displayNotifs.map(notif => {
        const isDonor = notif.recipientRole === 'donor';
        const isNgo = notif.recipientRole === 'ngo';
        const isVol = notif.recipientRole === 'volunteer';

        return (
          <div
            key={notif.id}
            className={`border-2 text-white p-4 rounded-2xl shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-right-10 duration-300 transition-all ${
              isDonor
                ? 'bg-slate-900 border-emerald-500 shadow-emerald-950/40'
                : isNgo
                ? 'bg-slate-900 border-teal-500 shadow-teal-950/40'
                : isVol
                ? 'bg-slate-900 border-[#84CC16] shadow-lime-950/40'
                : 'bg-slate-900 border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl border shrink-0 ${
                  isDonor
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : isNgo
                    ? 'bg-teal-950 border-teal-500 text-teal-400'
                    : isVol
                    ? 'bg-lime-950 border-[#84CC16] text-[#84CC16]'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {isDonor ? (
                  <Sparkles className="w-5 h-5 animate-pulse" />
                ) : isNgo ? (
                  <Building className="w-5 h-5 animate-bounce" />
                ) : isVol ? (
                  <Trophy className="w-5 h-5 animate-pulse" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-extrabold text-xs text-white leading-tight">{notif.title}</h4>
                  <span
                    className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full border ${
                      isDonor
                        ? 'bg-emerald-900 text-emerald-300 border-emerald-600'
                        : isNgo
                        ? 'bg-teal-900 text-teal-300 border-teal-600'
                        : isVol
                        ? 'bg-lime-900 text-lime-300 border-lime-600'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {notif.recipientRole}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{notif.message}</p>
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">{notif.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => clearNotification(notif.id)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
