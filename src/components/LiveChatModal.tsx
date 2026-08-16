import React, { useState } from 'react';
import { X, Send, MessageSquare, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';

interface LiveChatModalProps {
  requestId: string;
  donorName: string;
  volunteerName: string;
  onClose: () => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  requestId,
  donorName,
  volunteerName,
  onClose
}) => {
  const { chatMessages, sendChatMessage, authUser } = useFoodBridge();
  const [inputText, setInputText] = useState('');

  const messages = chatMessages.filter(m => m.requestId === requestId);
  const currentRole = authUser?.role || 'donor';

  const quickChips = currentRole === 'donor' 
    ? [
        "Food is safely packed in thermal containers.",
        "Pickup location is near the main entrance gate.",
        "Please call when you arrive."
      ]
    : [
        "I have accepted the dispatch and am on my way!",
        "Arrived at your pickup location.",
        "Loaded food safely into vehicle. Heading to shelter."
      ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sendChatMessage(requestId, text);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl max-w-lg w-full h-[540px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950 border border-emerald-600 rounded-2xl text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Live Rescue Chat</h3>
              <p className="text-[10px] text-slate-400">
                {donorName} ↔ {volunteerName} (Req #{requestId})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
          {messages.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-500 text-xs">
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto opacity-60" />
              <p className="font-bold text-slate-400">Direct Rescue Chat Started</p>
              <p>Send a message or select a quick response chip below to communicate.</p>
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderRole === currentRole;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-slate-400 font-bold mb-0.5 px-1">
                    {msg.senderName} ({msg.senderRole.toUpperCase()}) • {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-slate-950 rounded-br-none shadow-md font-semibold'
                        : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Chips */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[10px]">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-medium rounded-lg whitespace-nowrap border border-slate-700 transition-all"
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
