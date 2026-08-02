import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { AppPhase } from '../types';
import { soundEngine } from '../utils/sound';

interface HeaderNavbarProps {
  currentPhase: AppPhase;
  setCurrentPhase: (phase: AppPhase) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  registrationProgress: number; // 0 to 100
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentPhase,
  setCurrentPhase,
  isDarkMode,
  setIsDarkMode,
  isMuted,
  setIsMuted,
  registrationProgress,
}) => {
  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playClick();
    }
  };

  const phases: { id: AppPhase; label: string; number: number }[] = [
    { id: 'intro', label: 'Présentation', number: 1 },
    { id: 'registration', label: 'Inscription', number: 2 },
    { id: 'diagnostic', label: 'Diagnostic', number: 3 },
    { id: 'summary', label: 'Confirmation', number: 4 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => {
            soundEngine.playClick();
            setCurrentPhase('intro');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white tracking-wide text-sm sm:text-base">
                TECH ACADEMY
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
                80% PRATIQUE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Web & Mobile Developer Program
            </p>
          </div>
        </div>

        {/* Phase Navigation Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200 dark:border-slate-800">
          {phases.map((p) => {
            const isActive = currentPhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentPhase(p.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-white text-blue-600' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {p.number}
                </span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Controls: Sound & Theme */}
        <div className="flex items-center gap-2">
          {/* Registration Progress Indicator if in registration or diagnostic */}
          {(currentPhase === 'registration' || currentPhase === 'diagnostic') && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">{registrationProgress}%</span>
              <span>complété</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? "Activer le son" : "Désactiver le son"}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-all duration-200"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <div className="relative">
                <Volume2 className="w-4 h-4 text-blue-500 animate-pulse" />
              </div>
            )}
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsDarkMode(!isDarkMode);
            }}
            title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-slate-700 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all duration-200"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
