'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isProcessing?: boolean;
}

export function AICopilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Olá! Sou seu Copiloto Neural. Como posso ajudar com sua dieta hoje?',
            timestamp: new Date(),
        },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');

        // 1. Add processing message
        const processingId = (Date.now() + 1).toString();
        setMessages((prev) => [...prev, {
            id: processingId,
            role: 'assistant',
            content: 'Pensando...',
            timestamp: new Date(),
            isProcessing: true
        }]);

        try {
            // 2. Call the real API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, chatId }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // 3. Update chatId if it was a new chat
            if (data.chatId && !chatId) {
                setChatId(data.chatId);
            }

            // 4. Update with actual response
            setMessages((prev) => prev.map(m =>
                m.id === processingId
                    ? { ...m, content: data.message, isProcessing: false }
                    : m
            ));
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => prev.map(m =>
                m.id === processingId
                    ? { ...m, content: "Desculpe, ocorreu um erro ao processar sua solicitação.", isProcessing: false }
                    : m
            ));
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shadow-lg glow-cyan z-40"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="relative">
                    <MessageCircle className="w-6 h-6 text-background" />
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1"
                    >
                        <Sparkles className="w-3 h-3 text-white" />
                    </motion.div>
                </div>
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-6 right-6 w-[90vw] max-w-[400px] h-[600px] max-h-[85vh] z-50 flex flex-col"
                    >
                        <Card className="flex-1 flex flex-col glass border-neon-green/30 shadow-2xl overflow-hidden rounded-3xl">
                            {/* Header */}
                            <div className="p-4 bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-background border border-neon-green flex items-center justify-center">
                                        <Brain className="w-5 h-5 text-neon-green" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Copiloto Neural</h3>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-full hover:bg-white/10"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Messages area */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
                            >
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                ? 'bg-neon-blue text-white rounded-tr-none'
                                                : 'bg-muted/50 border border-white/10 rounded-tl-none'
                                                }`}
                                        >
                                            {msg.isProcessing ? (
                                                <div className="flex gap-1 py-1 px-2">
                                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                                                </div>
                                            ) : msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer / Input */}
                            <div className="p-4 bg-background/50 border-t border-white/10">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSend();
                                    }}
                                    className="relative flex items-center gap-2"
                                >
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Pergunte algo ao copiloto..."
                                        className="flex-1 bg-muted/50 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-neon-green/50 transition-colors"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="bg-neon-green text-background hover:bg-neon-green/90 rounded-xl"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
