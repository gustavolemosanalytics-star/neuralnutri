'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, ChevronRight, Share2, ClipboardList, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function NutriPortal() {
    const [isDragging, setIsDragging] = useState(false);
    const [fileStatus, setFileStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success'>('idle');

    const handleFileUpload = (e: any) => {
        setFileStatus('uploading');
        setTimeout(() => setFileStatus('analyzing'), 1500);
        setTimeout(() => setFileStatus('success'), 4000);
    };

    return (
        <main className="min-h-screen pb-24 px-4 pt-8 max-w-lg mx-auto">
            {/* Header */}
            <header className="mb-10 text-center">
                <div className="w-16 h-16 bg-neon-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neon-blue/20">
                    <ClipboardList className="w-8 h-8 text-neon-blue" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
                    Portal do Nutricionista
                </h1>
                <p className="text-muted-foreground mt-2">
                    Sincronize sua dieta prescrita com a inteligência neural.
                </p>
            </header>

            <AnimatePresence mode="wait">
                {fileStatus === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        {/* Upload Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); handleFileUpload(e); }}
                            className={`relative h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer bg-card/50 ${isDragging ? 'border-neon-blue bg-neon-blue/5 scale-[1.02]' : 'border-border'
                                }`}
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".pdf,.csv,.xlsx"
                            />
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg">Subir Prescrição</h3>
                            <p className="text-sm text-muted-foreground mt-1 px-8 text-center">
                                Arraste seu PDF ou CSV aqui. Nossa IA vai extrair alimentos, horários e macros.
                            </p>
                            <div className="absolute bottom-4 flex gap-4">
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">PDF</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">CSV</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">XLSX</span>
                            </div>
                        </div>

                        {/* Recent History */}
                        <Card className="glass p-6 border-white/5">
                            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-50">Histórico de Prescrições</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-neon-blue" />
                                        <div>
                                            <div className="text-sm font-medium">dieta_hipertrofia_v2.pdf</div>
                                            <div className="text-[10px] text-muted-foreground">Importado em 22 Jan, 2024</div>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {(fileStatus === 'uploading' || fileStatus === 'analyzing') && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-80 flex flex-col items-center justify-center text-center space-y-8"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 rounded-full border-2 border-transparent border-t-neon-blue border-r-neon-purple shadow-[0_0_20px_rgba(0,163,255,0.3)]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Brain className="w-10 h-10 text-neon-blue" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                                {fileStatus === 'uploading' ? 'Carregando Arquivo...' : 'IA Extraindo Dados...'}
                            </h2>
                            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                                Convertendo tabelas e textos em instruções neurais para o seu log.
                            </p>
                        </div>
                    </motion.div>
                )}

                {fileStatus === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <Card className="p-8 border-neon-green/30 bg-neon-green/5 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-neon-green" />
                            </div>
                            <h2 className="text-2xl font-bold">Dieta Sincronizada!</h2>
                            <p className="text-muted-foreground mt-2">
                                Identificamos 5 refeições e metas de 2.800kcal diárias. Seu plano foi atualizado.
                            </p>

                            <div className="w-full h-px bg-white/10 my-8" />

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="p-4 rounded-2xl bg-background border border-border">
                                    <div className="text-xs text-muted-foreground uppercase mb-1">Proteínas</div>
                                    <div className="text-xl font-bold text-neon-green">180g</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-background border border-border">
                                    <div className="text-xs text-muted-foreground uppercase mb-1">Calorias</div>
                                    <div className="text-xl font-bold text-neon-blue">2.8k</div>
                                </div>
                            </div>

                            <Link href="/dashboard" className="w-full mt-8">
                                <Button className="w-full h-14 bg-white text-black font-bold text-lg hover:bg-gray-200 rounded-2xl shadow-xl">
                                    Ir para o Dashboard <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </Card>

                        <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setFileStatus('idle')}>
                            Subir outro arquivo
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Tip */}
            <div className="mt-12 p-6 rounded-3xl bg-muted/30 border border-white/5 flex gap-4 items-start">
                <Share2 className="w-5 h-5 text-neon-purple mt-1" />
                <div>
                    <h5 className="text-sm font-semibold">Dica do Nutri</h5>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Você também pode compartilhar o acesso do seu workspace diretamente com seu nutricionista usando um link temporário (Beta).
                    </p>
                </div>
            </div>
        </main>
    );
}
