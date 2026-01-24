'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, Check, X, Zap, Loader2, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDailyLogStore } from '@/stores/dailyLogStore';
import { useRouter } from 'next/navigation';

export default function VisionAIPage() {
    const [state, setState] = useState<'idle' | 'capturing' | 'analyzing' | 'result'>('idle');
    const [image, setImage] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const addMeal = useDailyLogStore((state) => state.addMeal);

    const startCamera = async () => {
        setState('capturing');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Erro ao acessar câmera", err);
            setState('idle');
        }
    };

    const takePhoto = () => {
        const canvas = document.createElement('canvas');
        if (videoRef.current) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImage(dataUrl);

            // Stop camera stream
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());

            analyzeImage();
        }
    };

    const analyzeImage = () => {
        setState('analyzing');
        // Mock analysis
        setTimeout(() => {
            setAnalysis({
                dish: "Bowl de Poke com Salmão",
                kcal: 580,
                macros: { proteina: 35, carboidrato: 65, gordura: 22 },
                items: ["Salmão Grelhado", "Arroz Gohan", "Abacate", "Edamame"]
            });
            setState('result');
        }, 3000);
    };

    const confirmLog = () => {
        if (analysis) {
            addMeal({
                nome: analysis.dish,
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                items: analysis.items.map((it: string) => ({
                    nome: it,
                    quantidade: 100,
                    unidade: 'g',
                    kcal: Math.round(analysis.kcal / analysis.items.length),
                    macros: {
                        proteina: Math.round(analysis.macros.proteina / analysis.items.length),
                        carboidrato: Math.round(analysis.macros.carboidrato / analysis.items.length),
                        gordura: Math.round(analysis.macros.gordura / analysis.items.length),
                    }
                })),
                totalKcal: analysis.kcal,
                totalMacros: analysis.macros
            });
            router.push('/dashboard');
        }
    };

    return (
        <main className="min-h-screen bg-black text-white flex flex-col">
            <AnimatePresence mode="wait">
                {state === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-neon-green/10 flex items-center justify-center mb-8 border border-neon-green/20">
                            <Camera className="w-12 h-12 text-neon-green" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Visão Neural</h1>
                        <p className="text-gray-400 mb-10 max-w-xs">
                            Aponte a câmera para o seu prato. Nossa IA irá identificar os alimentos e calcular os macros instantaneamente.
                        </p>
                        <Button onClick={startCamera} className="w-full h-16 bg-neon-green text-black font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                            Abrir Câmera
                        </Button>
                    </motion.div>
                )}

                {state === 'capturing' && (
                    <motion.div key="capturing" className="relative flex-1 flex flex-col">
                        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-64 border-2 border-neon-green/50 rounded-3xl box-content">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-neon-green rounded-tl-xl" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-neon-green rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-neon-green rounded-bl-xl" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-neon-green rounded-br-xl" />
                        </div>
                        <div className="mt-auto p-10 flex justify-center z-10 bg-gradient-to-t from-black to-transparent">
                            <button onClick={takePhoto} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white transition-active active:scale-95" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {state === 'analyzing' && (
                    <motion.div key="analyzing" className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="relative mb-12">
                            <img src={image!} className="w-64 h-64 object-cover rounded-3xl opacity-50 blur-sm" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-12 h-12 text-neon-green animate-spin" />
                            </div>
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-neon-green shadow-[0_0_15px_#39FF14] z-20"
                            />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="text-neon-green w-6 h-6" /> Escaneando Nutrientes...
                        </h2>
                    </motion.div>
                )}

                {state === 'result' && (
                    <motion.div key="result" className="flex-1 flex flex-col p-6">
                        <img src={image!} className="w-full h-64 object-cover rounded-3xl mb-6 shadow-2xl" />
                        <Card className="glass p-6 text-white border-neon-green/30">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold">{analysis.dish}</h1>
                                <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-xs font-bold uppercase">Detectado</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-neon-blue">{analysis.macros.proteina}g</div>
                                    <div className="text-[10px] text-gray-400 uppercase">Prot</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-neon-purple">{analysis.macros.carboidrato}g</div>
                                    <div className="text-[10px] text-gray-400 uppercase">Carb</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-neon-orange">{analysis.macros.gordura}g</div>
                                    <div className="text-[10px] text-gray-400 uppercase">Gord</div>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap mb-8">
                                {analysis.items.map((it: string) => (
                                    <span key={it} className="text-xs bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                        <Check className="w-3 h-3 text-neon-green" /> {it}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setState('idle')} className="flex-1 h-14 rounded-2xl border border-white/10">
                                    Tentar Outra
                                </Button>
                                <Button onClick={confirmLog} className="flex-[2] h-14 bg-neon-green text-black font-bold rounded-2xl shadow-xl">
                                    Registrar {analysis.kcal} kcal
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
