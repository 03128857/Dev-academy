import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppPhase, RegistrationData, DiagnosticAnswers } from './types';
import { BackgroundParticles } from './components/BackgroundParticles';
import { HeaderNavbar } from './components/HeaderNavbar';
import { IntroPage } from './components/IntroPage';
import { RegistrationForm } from './components/RegistrationForm';
import { DiagnosticQuiz } from './components/DiagnosticQuiz';
import { SummaryWhatsApp } from './components/SummaryWhatsApp';
import { soundEngine } from './utils/sound';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('intro');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [registrationProgress, setRegistrationProgress] = useState<number>(0);

  // Initial Form Data State
  const [formData, setFormData] = useState<RegistrationData>({
    nom: '',
    postnom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    age: '',
    adressePhysique: '',
    ville: '',
    province: '',
    pays: 'République Démocratique du Congo',
    whatsapp: '',
    email: '',
    niveauEtude: '',
    profession: '',
    etablissement: '',
    ordinateurPortable: '',
    smartphoneAndroid: '',
    connexionInternet: '',
    sourceInformation: '',
    motivation: '',
    accepteConditions: false,
  });

  // Diagnostic Quiz Answers State
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswers>({});

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle phase transitions
  const handleIntroComplete = () => {
    soundEngine.playSuccess();
    setCurrentPhase('registration');
  };

  const handleRegistrationComplete = () => {
    soundEngine.playSuccess();
    setCurrentPhase('diagnostic');
  };

  const handleDiagnosticComplete = () => {
    soundEngine.playSuccess();
    setCurrentPhase('summary');
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 selection:bg-blue-500 selection:text-white ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Background Animated Canvas & Glowing Orbs */}
      <BackgroundParticles />

      {/* Persistent Header */}
      <HeaderNavbar
        currentPhase={currentPhase}
        setCurrentPhase={setCurrentPhase}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        registrationProgress={registrationProgress}
      />

      {/* Main View Transition Container */}
      <main className="relative z-10 pb-16">
        <AnimatePresence mode="wait">
          {currentPhase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <IntroPage
                onComplete={handleIntroComplete}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
              />
            </motion.div>
          )}

          {currentPhase === 'registration' && (
            <motion.div
              key="registration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <RegistrationForm
                formData={formData}
                setFormData={setFormData}
                onComplete={handleRegistrationComplete}
                setProgress={setRegistrationProgress}
              />
            </motion.div>
          )}

          {currentPhase === 'diagnostic' && (
            <motion.div
              key="diagnostic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <DiagnosticQuiz
                answers={diagnosticAnswers}
                setAnswers={setDiagnosticAnswers}
                onComplete={handleDiagnosticComplete}
              />
            </motion.div>
          )}

          {currentPhase === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
            >
              <SummaryWhatsApp
                formData={formData}
                diagnosticAnswers={diagnosticAnswers}
                onEditRegistration={() => setCurrentPhase('registration')}
                onEditDiagnostic={() => setCurrentPhase('diagnostic')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
