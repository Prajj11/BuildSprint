import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, Cpu } from 'lucide-react';
import { api } from '../services/api';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am your SmartAgri AI Farmer Assistant, backed by ICAR Knowledge Bulletins and real-time internal platform APIs. How can I help your farm today?'
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
    "What is the current Mandi price of Rice in Maharashtra?",
    "My tomato leaf has brown target-shaped spots, what remedy should I apply?",
    "Is it safe to spray pesticides given the weather forecast for Verna, Goa?"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', paddingBottom: '1rem' }}>
      <div>
        <span className="badge badge-primary">ICAR RAG & MULTI-TOOL ROUTER ENGINE</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: '#0f172a' }}>
          Central AI Farmer Assistant (Multi-Lingual RAG Chat)
        </h1>
      </div>

      {/* Chat Window */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '1rem', overflow: 'hidden', padding: 0 }}>
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
                <div style={{ background: '#d1fae5', color: '#047857', padding: '0.5rem', borderRadius: '50%' }}>
                  <Bot size={20} />
                </div>
              )}

              <div style={{
                maxWidth: '75%',
                background: m.sender === 'user' ? '#059669' : '#f8fafc',
                color: m.sender === 'user' ? 'white' : '#1e293b',
                padding: '0.85rem 1.15rem',
                borderRadius: '16px',
                border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}>
                {m.tool && (
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Cpu size={12} /> Executed Tool: {m.tool}
                  </div>
                )}
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.5rem', borderRadius: '50%' }}>
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
              <RefreshCw className="spin" size={16} /> Routing query via ICAR Knowledge Base & Internal Tools...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Sample Prompts */}
        <div style={{ padding: '0.5rem 1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {samplePrompts.map((prompt, i) => (
            <button 
              key={i} 
              onClick={() => { setInput(prompt); }}
              style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
          <input 
            type="text" 
            placeholder="Ask anything about crops, Mandi prices, diseases, or weather..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            style={{ borderRadius: '24px' }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ borderRadius: '24px', padding: '0.65rem 1.25rem' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
