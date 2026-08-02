import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Zap, 
  CheckCircle, 
  Layers, 
  Cpu, 
  Smartphone, 
  Globe, 
  Clock 
} from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface IntroPageProps {
  onComplete: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({
  onComplete,
  isMuted,
  setIsMuted,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  useEffect(() => {
    // Start ambient music sound engine
    soundEngine.startAmbientMusic();

    const timer = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isPaused]);

  const handleSkip = () => {
    soundEngine.playClick();
    onComplete();
  };

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.startAmbientMusic();
    }
  };

  const progressPercent = ((15 - timeLeft) / 15) * 100;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      
      {/* Top Bar: Ambient Music Status & Discreet Countdown */}
      <div className="flex items-center justify-between gap-4 z-10 bg-slate-900/40 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />}
            <span>{isMuted ? "Musique Désactivée" : "Ambiance Audio Active"}</span>
          </button>
          
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isPaused ? "Reprendre le décompte" : "Mettre en pause"}</span>
          </button>
        </div>

        {/* Discreet Progress Ring / Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Redirection automatique
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">
              {timeLeft} sec
            </span>
          </div>
          <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Hero Showcase */}
      <div className="my-auto py-8 z-10 flex flex-col items-center text-center">
        
        {/* Modern Animated Logo Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border border-slate-700/80 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-center gap-1">
              <Code2 className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.75]" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono font-bold text-cyan-300">80/20 TECH</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-blue-500/5"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>80% PRATIQUE &bull; 20% THÉORIE &bull; MENTORAT DIRECT</span>
        </motion.div>

        {/* Animated Main Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-tight mb-6"
        >
          FORMATION PROFESSIONNELLE EN DÉVELOPPEMENT DES APPLICATIONS{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent glow-text">
            WEB & MOBILES
          </span>
        </motion.h1>

        {/* Inspiring Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-light leading-relaxed mb-10"
        >
          "Construisez les applications de demain grâce à une formation intensive orientée vers la pratique."
        </motion.p>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-10 text-left"
        >
          <div className="glass-panel p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            <Zap className="w-6 h-6 text-amber-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">80% Pratique</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Projets réels et code intensif dès le jour 1.</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            <Globe className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Web Apps</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">HTML5, CSS3, JS, React, Tailwind & Backend.</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            <Smartphone className="w-6 h-6 text-indigo-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mobile Apps</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Création d'applications Android modernes.</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            <Cpu className="w-6 h-6 text-emerald-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Diagnostic Pro</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Évaluation personnalisée pour un suivi adapté.</p>
          </div>
        </motion.div>

        {/* Action Button: Skip directly to Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <button
            onClick={handleSkip}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Commencer l'Inscription Immédiatement</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>

      {/* Footer Info */}
      <div className="z-10 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/50 dark:border-slate-800/80 pt-4">
        <span>Formation intensive encadrée par un Formateur Expert</span>
        <span className="text-blue-500 font-semibold">&bull; Inscription WhatsApp Directe &bull;</span>
      </div>

    </div>
  );
};
