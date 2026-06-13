import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AssistantChat() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'massage_assistant',
      metadata: { name: 'Czat z asystentem' },
    });
    setConversation(conv);
    setMessages(conv.messages || []);

    const unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });

    return unsubscribe;
  };

  const handleOpen = async () => {
    setOpen(true);
    if (!conversation) {
      await startConversation();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending || !conversation) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gold text-obsidian flex items-center justify-center shadow-lg hover:bg-gold-light transition-colors"
        aria-label="Otwórz asystenta"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-background border border-border shadow-2xl flex flex-col"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-foreground text-background">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm font-medium tracking-wide">Asystent Wesoły Masaż</span>
              </div>
              <button onClick={() => setOpen(false)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center pt-8">
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-sm text-muted-foreground">
                    Cześć! Jestem asystentem salonu Wesoły Masaż. Mogę pomóc Ci wybrać odpowiedni masaż, odpowiedzieć na pytania o ceny i godziny.
                  </p>
                  <div className="mt-4 space-y-2">
                    {['Jaki masaż na ból pleców?', 'Ile kosztuje masaż relaksacyjny?', 'Jak umówić wizytę?'].map(q => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="block w-full text-left text-xs border border-border px-3 py-2 hover:border-gold hover:text-gold transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.filter(m => m.role !== 'system').map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 text-sm rounded-sm ${
                    msg.role === 'user'
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-foreground'
                  }`}>
                    {msg.role === 'user' ? (
                      <p>{msg.content}</p>
                    ) : (
                      <ReactMarkdown className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-muted px-3 py-2 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Piszę...</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Napisz wiadomość..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="text-gold disabled:opacity-40 hover:text-gold-light transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}