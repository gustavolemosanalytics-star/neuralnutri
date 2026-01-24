'use client';

import { motion } from 'framer-motion';

export default function AnamneseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-green/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-xl"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
