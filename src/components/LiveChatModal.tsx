import React, { useState } from 'react';
import { X, Send, MessageSquare, ShieldCheck, Sparkles, Lock, Shield } from 'lucide-react';
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
  ngoName = 'Hope Children Shelter & NGO',
  onClose
}) => {
  const { chatMessages, sendChatMessage, authUser } = useFoodBridge();
  const currentRole = authUser?.role || 'donor';

  // Role-based channel secrecy filtering
  const availableChannels: Array<{ id: 'vol_donor' | 'vol_ngo' | 'donor_ngo'; label: string }> = [];

  if (currentRole === 'volunteer') {
    availableChannels.push(
      { id: 'vol_donor', label: 'Volunteer ↔ Donor' },
      { id: 'vol_ngo', label: 'Volunteer ↔ NGO' }
    );
  } else if (currentRole === 'donor') {
    availableChannels.push(
      { id: 'vol_donor', label: 'Donor ↔ Volunteer' },
      { id: 'donor_ngo', label: 'Donor ↔ NGO' }
    );
  } else if (currentRole === 'ngo') {
    availableChannels.push(
      { id: 'vol_ngo', label: 'NGO ↔ Volunteer' },
      { id: 'donor_ngo', label: 'NGO ↔ Donor' }
    );
  } else {
    // Admin role: see all 3 channels
    availableChannels.push(
      { id: 'vol_donor', label: 'Vol ↔ Donor' },
      { id: 'vol_ngo', label: 'Vol ↔ NGO' },
      { id: 'donor_ngo', label: 'Donor ↔ NGO' }
    );
  }

  const [activeChannel, setActiveChannel] = useState<'vol_donor' | 'vol_ngo' | 'donor_ngo'>(availableChannels[0].id);
  const [inputText, setInputText] = useState('');

  // Filter messages specifically for the selected active private channel
  const filteredMessages = chatMessages.filter(
    m => m.requestId === requestId && (m.channel === activeChannel || (!m.channel && activeChannel === 'vol_donor'))
  );

  const quickChips = activeChannel === 'vol_donor'
    ? [
        "Food is safely packed in thermal containers.",
        "Pickup location is near the main entrance gate.",
        "On my way for pickup!"
      ]
    : activeChannel === 'vol_ngo'
    ? [
        "Food loaded safely into vehicle. Heading to shelter!",
        "Estimated arrival time is 10 minutes.",
        "Please confirm arrival at shelter gate."
      ]
    : [
        "Thank you for donating this fresh meal!",
        "Our shelter beneficiaries appreciate your support.",
        "Golden hour quality confirmed."
      ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sendChatMessage(requestId, text, activeChannel);
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
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">Private Rescue Chat</h3>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-600/60 text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Channel Secrecy
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Req #{requestId} • Logged in as <b>{authUser?.name} ({currentRole.toUpperCase()})</b>
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

          {/* Role-Gated Channel Tabs */}
          <div className={`grid grid-cols-${availableChannels.length} gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[10px] font-bold text-center`}>
            {availableChannels.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`py-1.5 rounded-lg transition-all ${
                  activeChannel === ch.id ? 'bg-emerald-600 text-white font-extrabold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50 text-xs">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-500">
              <Lock className="w-8 h-8 text-emerald-500 mx-auto opacity-40 animate-pulse" />
              <p className="font-bold text-slate-300">Private Channel ({availableChannels.find(c => c.id === activeChannel)?.label})</p>
              <p className="text-[10px] max-w-xs mx-auto text-slate-400">
                Messages in this channel are end-to-end isolated for secrecy. 
                {currentRole === 'volunteer' && " Donors and NGOs cannot see other private conversations."}
              </p>
            </div>
          ) : (
            filteredMessages.map((m, idx) => {
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
              placeholder={`Message in ${availableChannels.find(c => c.id === activeChannel)?.label}...`}
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
