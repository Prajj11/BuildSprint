import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, Cpu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function AIAssistant() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Namaste ${user?.farmer_name || 'Farmer'}! I am your SmartAgri AI Assistant, integrated with ICAR Knowledge Bulletins and live platform APIs. How can I assist your farm today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    api.chatAssistant(userText, [])
      .then(res => {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: res.response,
          tool: res.tool_used,
          rag: res.rag_context
        }]);
      })
      .catch(err => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an issue connecting to SmartAgri AI servers.' }]);
      })
      .finally(() => setLoading(false));
  };

  const samplePrompts = [
    `What is the current Mandi price of ${user?.primary_crop || "Rice"} in ${user?.state || "Maharashtra"}?`,
    "My tomato leaf has brown target-shaped spots, what organic remedy should I apply?",
    "Is it safe to spray pesticides given the weather forecast for my current location?"
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', paddingBottom: '1rem' }}>
      <div>
        <span className="badge badge-dark" style={{ border: '1px solid #10B981', marginBottom: '0.4rem' }}>
          ICAR RAG & MULTI-TOOL ROUTER ENGINE
        </span>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.2rem', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Central AI Farmer Assistant
        </h1>
      </div>

      {/* Chat Window */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '1rem', overflow: 'hidden', padding: 0, borderRadius: '18px' }}>
        {/* Messages list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}
            >
              {m.sender === 'bot' && (
                <div style={{ background: '#0B1F17', color: '#10B981', padding: '0.65rem', borderRadius: '50%', border: '1px solid #10B981' }}>
                  <Bot size={20} />
                </div>
              )}

              <div style={{
                maxWidth: '75%',
                background: m.sender === 'user' ? 'linear-gradient(135deg, #10B981 0%, #047857 100%)' : '#F8FAF8',
                color: m.sender === 'user' ? 'white' : '#0F172A',
                padding: '0.9rem 1.2rem',
                borderRadius: '16px',
                border: m.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                boxShadow: m.sender === 'user' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
              }}>
                {m.tool && (
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284C7', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Cpu size={13} /> Executed Tool: {m.tool}
                  </div>
                )}
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.65rem', borderRadius: '50%' }}>
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontSize: '0.85rem', fontWeight: 700 }}>
              <RefreshCw className="spin" size={18} /> Routing query via ICAR Knowledge Base & Platform APIs...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{ padding: '0.6rem 1rem', background: '#F8FAF8', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {samplePrompts.map((prompt, i) => (
            <button 
              key={i} 
              onClick={() => { setInput(prompt); }}
              style={{ background: 'white', border: '1px solid #CBD5E1', borderRadius: '20px', padding: '0.35rem 0.85rem', fontSize: '0.78rem', fontWeight: 600, color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'white', borderTop: '1px solid #E2E8F0' }}>
          <input 
            type="text" 
            placeholder="Ask anything about crops, Mandi prices, diseases, or weather..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            style={{ borderRadius: '24px', paddingLeft: '1.25rem' }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ borderRadius: '24px', padding: '0.65rem 1.35rem' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
