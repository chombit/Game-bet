import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-green-400" />
          <span className="font-bold text-sm uppercase tracking-wider">Live Chat</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
          <Users className="w-3 h-3 text-green-400" />
          <span className="text-[10px] font-bold text-green-400">142 Online</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.isSystem ? 'items-center py-2' : ''}`}
          >
            {msg.isSystem ? (
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 font-bold uppercase tracking-widest text-center">
                {msg.text}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {msg.username.substring(0, 1)}
                  </div>
                  <span className="text-[10px] font-bold text-white/40">{msg.username}</span>
                  <span className="text-[9px] text-white/20 font-mono ml-auto">{msg.timestamp}</span>
                </div>
                <div className="bg-white/5 rounded-xl rounded-tl-none px-3 py-2 text-sm text-white/80 border border-white/5 max-w-[90%]">
                  {msg.text}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 bg-white/5 border-t border-white/5 flex gap-2"
      >
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Say something..."
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="bg-green-500 hover:bg-green-600 text-black font-bold h-9 w-9 rounded-xl"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
