import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, BrainCircuit, Send } from 'lucide-react';
import { generateGeminiResponse } from '../utils/gemini';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', role: 'model', text: 'مرحباً بك في منصة أبحاث قسم علوم المعلومات. أنا مساعدك الأكاديمي الذكي، كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    const history = messages.slice(1).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const response = await generateGeminiResponse(userText, history);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start">
      
      {/* Chat Window */}
      {isOpen && (
        <div 
          dir="rtl" 
          className="mb-6 w-80 sm:w-[400px] rounded-[2rem] bg-white shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col overflow-hidden animate-fade-in-up origin-bottom-left"
          style={{ height: 'calc(100vh - 120px)' }} 
        >

          {/* Header */}
          <div className="bg-gradient-to-r from-[#658DB7] to-[#54799E] p-6 text-white flex justify-between items-center shadow-lg relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">المساعد الذكي</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                  <p className="text-[11px] text-white/90 font-bold">متصل ومستعد للمساعدة</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-2.5 transition-all active:scale-95 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-6 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[1.5rem] px-5 py-4 text-sm leading-relaxed shadow-sm transition-all duration-300 font-medium ${
                   msg.role === 'user' 
                    ? 'bg-[#658DB7] text-white rounded-tl-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tr-none shadow-slate-200/50'
                } text-right`} dir="rtl">
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-tr-none px-6 py-4 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#658DB7]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#658DB7]/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#658DB7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-5 bg-white border-t border-slate-100 flex gap-4 items-center">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل عن أي معلومة بحثية..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none transition-all focus:border-[#658DB7] focus:ring-4 focus:ring-[#658DB7]/5 focus:bg-white text-right placeholder:text-slate-400 font-bold"
                dir="rtl"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#658DB7] text-white rounded-2xl p-4 flex items-center justify-center hover:bg-[#54799E] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#658DB7]/20 active:scale-95 group"
            >
              <Send className="w-6 h-6 transform rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group ${isOpen ? 'bg-slate-900 rotate-90 scale-90' : 'bg-[#658DB7] hover:shadow-[#658DB7]/40 shadow-[#658DB7]/20'} text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 border-[3px] border-white z-50`}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <div className="relative">
            <Bot className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-[1.5px] border-white animate-pulse shadow-lg"></div>
          </div>
        )}
      </button>
    </div>
  );
}