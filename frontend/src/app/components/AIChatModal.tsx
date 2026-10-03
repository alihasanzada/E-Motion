'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, RotateCcw } from 'lucide-react';

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

const INITIAL_MESSAGES: Message[] = [
    { sender: 'ai', text: 'Salam! Mən E-Motion AI asistentiyəm. Bu gün özünü necə hiss edirsən?' },
];

export default function AIChatModal({
    isOpen,
    onClose,
    userStats,
}: {
    isOpen: boolean;
    onClose: () => void;
    userStats?: UserStats;
}) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedMessages = localStorage.getItem('emotion_chat_history');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                }
            } catch (error) {
                console.error('Çat tarixçəsi oxunarkən xəta baş verdi:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('emotion_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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

    const handleClearChat = () => {
        setMessages(INITIAL_MESSAGES);
        localStorage.removeItem('emotion_chat_history');
    };

    return (
        <>
            {/* Responsiv qaydalar: pəncərə heç bir cihazda ekrandan kənara çıxmır */}
            <style>{`
                .ai-chat-modal {
                    box-sizing: border-box;
                    max-width: calc(100vw - 16px);
                    overflow: hidden;
                }

                .ai-chat-modal *,
                .ai-chat-modal *::before,
                .ai-chat-modal *::after {
                    box-sizing: border-box;
                }

                @supports (height: 100dvh) {
                    .ai-chat-modal {
                        height: min(460px, calc(100dvh - 105px)) !important;
                    }
                }

                /* Telefonlar: ekranın eninə uyğunlaşır (sol və sağdan 10px boşluq) */
                @media (max-width: 480px) {
                    .ai-chat-modal {
                        left: 10px !important;
                        right: 10px !important;
                        width: auto !important;
                        max-width: none !important;
                        bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
                        height: min(460px, calc(100vh - 96px)) !important;
                    }

                    /* iOS-da input-a toxunanda səhifənin avtomatik böyüməsinin (zoom) qarşısını alır */
                    .ai-chat-input {
                        font-size: 16px !important;
                    }
                }

                @supports (height: 100dvh) {
                    @media (max-width: 480px) {
                        .ai-chat-modal {
                            height: min(460px, calc(100dvh - 96px)) !important;
                        }
                    }
                }

                /* Aşağı hündürlüklü (landscape) telefonlar */
                @media (max-height: 520px) {
                    .ai-chat-modal {
                        bottom: 8px !important;
                        height: calc(100vh - 16px) !important;
                    }
                }

                @supports (height: 100dvh) {
                    @media (max-height: 520px) {
                        .ai-chat-modal {
                            height: calc(100dvh - 16px) !important;
                        }
                    }
                }
            `}</style>

            <div
                className="ai-chat-modal"
                role="dialog"
                aria-label="E-Motion AI Asistent"
                style={{
                    position: 'fixed', bottom: '85px', right: '24px',
                    width: 'min(350px, calc(100vw - 32px))',
                    height: 'min(460px, calc(100vh - 105px))',
                    backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header */}
                <div style={{ flexShrink: 0, padding: '14px 16px', backgroundColor: '#059669', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', minWidth: 0 }}>
                        <Bot size={20} style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>E-Motion AI Asistent</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                            onClick={handleClearChat}
                            title="Söhbəti təmizlə"
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center', padding: '4px' }}
                        >
                            <RotateCcw size={16} />
                        </button>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Mesajlar Sahəsi */}
                <div style={{ flex: 1, minHeight: 0, padding: '14px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{
                            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: m.sender === 'user' ? '#10b981' : '#27272a',
                            color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '12.5px',
                            maxWidth: '85%', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'
                        }}>
                            {m.text}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ alignSelf: 'flex-start', backgroundColor: '#27272a', color: '#a1a1aa', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Loader2 className="animate-spin" size={14} /> Cavab yazılır...
                        </div>
                    )}
                    {/* Avto-skrol üçün hədəf nöqtə */}
                    <div ref={messagesEndRef} />
                </div>

                {/* İnput və Göndər Düyməsi */}
                <div style={{ flexShrink: 0, padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
                    <input
                        className="ai-chat-input"
                        type="text"
                        value={input}
                        disabled={loading}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={loading ? 'Cavab gözlənilir...' : 'Mesajınızı yazın...'}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            backgroundColor: '#27272a',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: '#fff',
                            fontSize: '12.5px',
                            outline: 'none',
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'text'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        style={{
                            flexShrink: 0,
                            backgroundColor: '#10b981',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: '#fff',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        <Send size={15} />
                    </button>
                </div>
            </div>
        </>
    );
}