import React, { useState } from 'react';
import { X, Send, MessageSquare, User, ShieldCheck, Sparkles, Building, HeartHandshake } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';

interface LiveChatModalProps {
  requestId: string;
  donorName: string;
  volunteerName: string;
  ngoName?: string;
  onClose: () => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  requestId,
  donorName,
  volunteerName,
  ngoName = 'Hope Children Shelter',
  onClose
}) => {
  const { chatMessages, sendChatMessage, authUser } = useFoodBridge();
  const [inputText, setInputText] = useState('');
  const [activeChannel, setActiveChannel] = useState<'vol_donor' | 'vol_ngo' | 'donor_ngo'>('vol_donor');

  const messages = chatMessages.filter(m => m.requestId === requestId);
  const currentRole = authUser?.role || 'donor';

  const quickChips = activeChannel === 'vol_donor'
    ? [
        "Food is safely packed in thermal containers.",
        "Pickup location is near the main entrance gate.",
        "I am on my way for pickup!"
      ]
    : activeChannel === 'vol_ngo'
    ? [
        "Food loaded safely into vehicle. Heading to your shelter!",
        "Estimated arrival time is 10 minutes.",
        "Please confirm arrival at entrance gate."
      ]
    : [
        "Thank you for donating this fresh meal!",
        "Our shelter beneficiaries appreciate your support.",
        "Golden hour quality confirmed."
      ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sendChatMessage(requestId, `[${activeChannel === 'vol_donor' ? 'Vol ↔ Donor' : activeChannel === 'vol_ngo' ? 'Vol ↔ NGO' : 'Donor ↔ NGO'}] ${text}`);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl max-w-lg w-full h-[580px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-950 border border-emerald-600 rounded-2xl text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">3-Way Rescue Live Chat</h3>
                <p className="text-[10px] text-slate-400">
                  Req #{requestId} • Donor, Volunteer & NGO Sync
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Party Channel Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[10px] font-bold text-center">
            <button
              onClick={() => setActiveChannel('vol_donor')}
              className={`py-1.5 rounded-lg transition-all ${activeChannel === 'vol_donor' ? 'bg-emerald-600 text-white font-extrabold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Vol ↔ Donor
            </button>
            <button
              onClick={() => setActiveChannel('vol_ngo')}
              className={`py-1.5 rounded-lg transition-all ${activeChannel === 'vol_ngo' ? 'bg-teal-600 text-white font-extrabold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Vol ↔ NGO
            </button>
            <button
              onClick={() => setActiveChannel('donor_ngo')}
              className={`py-1.5 rounded-lg transition-all ${activeChannel === 'donor_ngo' ? 'bg-amber-600 text-white font-extrabold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Donor ↔ NGO
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50 text-xs">
          {messages.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-500">
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto opacity-40 animate-pulse" />
              <p className="font-bold text-slate-400">3-Way Chat Active</p>
              <p className="text-[10px]">Messages sent here update live between Donor ({donorName}), Volunteer ({volunteerName}) and NGO ({ngoName}).</p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isMe = m.senderRole === currentRole;
              return (
                <div
                  key={m.id || idx}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                    <span>{m.senderName} ({m.senderRole.toUpperCase()})</span>
                    <span>• {m.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-none font-medium shadow-md'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Chips */}
        <div className="p-2.5 bg-slate-900 border-t border-slate-800 overflow-x-auto flex items-center gap-1.5 text-[10px]">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg whitespace-nowrap font-medium transition-all"
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Message in ${activeChannel === 'vol_donor' ? 'Vol ↔ Donor' : activeChannel === 'vol_ngo' ? 'Vol ↔ NGO' : 'Donor ↔ NGO'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
