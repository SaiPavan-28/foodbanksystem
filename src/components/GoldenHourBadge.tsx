import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface GoldenHourBadgeProps {
  deadlineIso: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GoldenHourBadge: React.FC<GoldenHourBadgeProps> = ({ deadlineIso, size = 'md' }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean; rawMinutes: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    rawMinutes: 0
  });

  useEffect(() => {
    const updateTimer = () => {
      const target = new Date(deadlineIso).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true, rawMinutes: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const rawMinutes = Math.floor(diff / (1000 * 60));
        setTimeLeft({ hours, minutes, seconds, isExpired: false, rawMinutes });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  // Color & Badge Styling based on Golden Hour SLA status
  let bgStyle = '';
  let textStyle = '';
  let borderStyle = '';
  let statusText = '';
  let Icon = Clock;

  if (timeLeft.isExpired) {
    bgStyle = 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse';
    textStyle = 'text-rose-400 font-bold';
    borderStyle = 'border-rose-700';
    statusText = 'EXPIRED (Safety Risk)';
    Icon = AlertTriangle;
  } else if (timeLeft.rawMinutes <= 60) {
    // Critical SLA (< 1 hour left)
    bgStyle = 'bg-red-950/90 text-red-200 border-red-800 animate-pulse';
    textStyle = 'text-red-400 font-bold';
    borderStyle = 'border-red-600';
    statusText = 'URGENT GOLDEN HOUR';
    Icon = AlertTriangle;
  } else if (timeLeft.rawMinutes <= 120) {
    // Warning SLA (1-2 hours left)
    bgStyle = 'bg-amber-950/70 text-amber-200 border-amber-700';
    textStyle = 'text-amber-400 font-medium';
    borderStyle = 'border-amber-600';
    statusText = 'At Risk SLA';
    Icon = Clock;
  } else {
    // Healthy SLA (> 2 hours left)
    bgStyle = 'bg-emerald-950/70 text-emerald-200 border-emerald-700';
    textStyle = 'text-emerald-400 font-medium';
    borderStyle = 'border-emerald-600';
    statusText = 'Golden Hour Safe';
    Icon = ShieldCheck;
  }

  const formatPad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={`inline-flex items-center gap-2 border px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-md transition-all ${bgStyle} ${borderStyle}`}
    >
      <Icon className={`w-4 h-4 ${textStyle}`} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1 font-mono font-bold text-sm tracking-wider">
          <span>{formatPad(timeLeft.hours)}h</span>
          <span>:</span>
          <span>{formatPad(timeLeft.minutes)}m</span>
          <span>:</span>
          <span className="text-xs opacity-80">{formatPad(timeLeft.seconds)}s</span>
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-wider opacity-90">{statusText}</span>
      </div>
    </div>
  );
};
