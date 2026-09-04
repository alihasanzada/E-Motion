'use client';
import { useState } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface UserStats {
    addimlar: number;
    aktivlikDeq: number;
    kalori: number;
    suQebulu: number;
    yuxu: number;
    seriya: number;
}

export default function AIChatModal({
    isOpen,
    onClose,
    userStats,
}: {
    isOpen: boolean;
    onClose: () => void;
    userStats?: UserStats;
}) {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Salam! Mən E-Motion AI asistentiyəm. Bu gün özünü necə hiss edirsən?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');

        const history = messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
        }));

        setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMsg, history, userStats }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, { sender: 'ai', text: data.result || 'Cavab alınmadı.' }]);
        } catch {
            setMessages((prev) => [...prev, { sender: 'ai', text: 'Xəta baş verdi. Yenidən cəhd edin.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', bottom: '85px', right: '24px', width: '350px', height: '460px',
            backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
        }}>
            <div style={{ padding: '14px 16px', backgroundColor: '#059669', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                    <Bot size={20} />
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>E-Motion AI Asistent</span>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={18} />
                </button>
            </div>

            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                        backgroundColor: m.sender === 'user' ? '#10b981' : '#27272a',
                        color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '12.5px',
                        maxWidth: '85%', whiteSpace: 'pre-wrap'
                    }}>
                        {m.text}
                    </div>
                ))}
                {loading && (
                    <div style={{ alignSelf: 'flex-start', backgroundColor: '#27272a', color: '#a1a1aa', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Loader2 className="animate-spin" size={14} /> Cavab yazılır...
                    </div>
                )}
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Mesajınızı yazın..."
                    style={{ flex: 1, backgroundColor: '#27272a', border: 'none', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12.5px', outline: 'none' }}
                />
                <button onClick={handleSend} style={{ backgroundColor: '#10b981', border: 'none', borderRadius: '8px', padding: '8px 12px', color: '#fff', cursor: 'pointer' }}>
                    <Send size={15} />
                </button>
            </div>
        </div>
    );
}