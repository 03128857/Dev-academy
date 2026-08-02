import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Code, 
  Database, 
  GitBranch, 
  Layers, 
  Globe, 
  Smartphone, 
  Clock, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Award
} from 'lucide-react';
import { DiagnosticAnswers, DiagnosticQuestion } from '../types';
import { soundEngine } from '../utils/sound';

interface DiagnosticQuizProps {
  answers: DiagnosticAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosticAnswers>>;
  onComplete: () => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  answers,
  setAnswers,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const questions: DiagnosticQuestion[] = [
    {
      id: 'web_exp',
      question: 'Avez-vous déjà développé un site Web ?',
      category: 'Général',
      options: [
        { label: 'Oui, plusieurs sites complets', value: 'Oui, expert' },
        { label: 'Oui, un petit site simple', value: 'Oui, basique' },
        { label: 'Non, jamais de site web', value: 'Non, débutant complet' },
      ],
    },
    {
      id: 'html_level',
      question: 'Quel est votre niveau de connaissances en HTML ?',
      category: 'Technologies',
      options: [
        { label: 'Avancé (HTML5 sémantique, formulaires, SEO)', value: 'Avancé' },
        { label: 'Intermédiaire (Balises de base, images, liens)', value: 'Intermédiaire' },
        { label: 'Débutant (Notions très simples)', value: 'Débutant' },
        { label: 'Aucune connaissance', value: 'Aucune' },
      ],
    },
    {
      id: 'css_level',
      question: 'Quel est votre niveau de connaissances en CSS ?',
      category: 'Technologies',
      options: [
        { label: 'Avancé (Flexbox, Grid, Animations, Tailwind)', value: 'Avancé' },
        { label: 'Intermédiaire (Styles de base, couleurs, polices)', value: 'Intermédiaire' },
        { label: 'Débutant (Compréhension basique)', value: 'Débutant' },
        { label: 'Aucune connaissance', value: 'Aucune' },
      ],
    },
    {
      id: 'js_level',
      question: 'Quel est votre niveau en JavaScript (ES6+) ?',
      category: 'Technologies',
      options: [
        { label: 'Avancé (DOM, Async/Await, Frameworks)', value: 'Avancé' },
        { label: 'Intermédiaire (Variables, Fonctions, Événements)', value: 'Intermédiaire' },
        { label: 'Débutant (Bases théoriques)', value: 'Débutant' },
        { label: 'Aucune connaissance', value: 'Aucune' },
      ],
    },
    {
      id: 'php_level',
      question: 'Connaissez-vous PHP pour le backend ?',
      category: 'Technologies',
      options: [
        { label: 'Oui, développement orienté objet / API', value: 'Avancé' },
        { label: 'Bases (Scripts simples, formulaires)', value: 'Intermédiaire' },
        { label: 'Uniquement des notions théoriques', value: 'Débutant' },
        { label: 'Non, pas du tout', value: 'Aucune' },
      ],
    },
    {
      id: 'mysql_level',
      question: 'Connaissez-vous MySQL ou les bases de données SQL ?',
      category: 'Technologies',
      options: [
        { label: 'Oui (Requêtes complexes, requêtes jointures, SGBD)', value: 'Avancé' },
        { label: 'Bases (CREATE, SELECT, INSERT, UPDATE)', value: 'Intermédiaire' },
        { label: 'Notions théoriques simples', value: 'Débutant' },
        { label: 'Non, jamais utilisé', value: 'Aucune' },
      ],
    },
    {
      id: 'git_github',
      question: 'Avez-vous déjà utilisé Git ou GitHub ?',
      category: 'Technologies',
      options: [
        { label: 'Oui, régulièrement (Commits, Push, Branches, PRs)', value: 'Oui, régulier' },
        { label: 'Oui, juste pour télécharger des projets', value: 'Occasionnel' },
        { label: 'Non, je ne connais pas Git/GitHub', value: 'Non' },
      ],
    },
    {
      id: 'duration_exp',
      question: 'Depuis combien de temps développez-vous des applications ?',
      category: 'Expérience',
      options: [
        { label: 'Plus de 2 ans', value: '+2 ans' },
        { label: 'Entre 6 mois et 2 ans', value: '6 mois - 2 ans' },
        { label: 'Moins de 6 mois', value: '< 6 mois' },
        { label: 'Je commence seulement maintenant !', value: 'Débutant absolu' },
      ],
    },
    {
      id: 'complete_project',
      question: 'Avez-vous déjà réalisé un projet informatique complet ?',
      category: 'Expérience',
      options: [
        { label: 'Oui, projet professionnel ou académique complet', value: 'Oui' },
        { label: 'Oui, de petits projets personnels', value: 'Projets perso' },
        { label: 'Non, aucun projet encore', value: 'Non' },
      ],
    },
    {
      id: 'published_website',
      question: 'Avez-vous déjà publié un site Web en ligne (hébergement/domaine) ?',
      category: 'Expérience',
      options: [
        { label: 'Oui, site actif avec nom de domaine', value: 'Oui' },
        { label: 'Oui, sur une plateforme gratuite (Vercel, Netlify, GH-Pages)', value: 'Plateforme gratuite' },
        { label: 'Non, uniquement en local sur ma machine', value: 'Non' },
      ],
    },
    {
      id: 'mobile_app',
      question: 'Avez-vous déjà créé ou publié une application mobile (Android/iOS) ?',
      category: 'Expérience',
      options: [
        { label: 'Oui, une ou plusieurs applications fonctionnelles', value: 'Oui' },
        { label: 'J\'ai testé de petits exemples (Flutter, React Native)', value: 'Tests basiques' },
        { label: 'Non, c\'est mon objectif dans cette formation', value: 'Non' },
      ],
    },
    {
      id: 'main_target',
      question: 'Quel est votre principal objectif dans cette formation ?',
      category: 'Objectifs',
      options: [
        { label: 'Devenir développeur professionnel et décrocher un emploi', value: 'Emploi / Carrière' },
        { label: 'Créer ma propre entreprise / Startup technologique', value: 'Entrepreneuriat' },
        { label: 'Proposer mes services en Freelance', value: 'Freelance' },
        { label: 'Renforcer mes compétences professionnelles actuelles', value: 'Montée en compétences' },
      ],
    },
    {
      id: 'preferred_field',
      question: 'Quel domaine vous intéresse le plus ?',
      category: 'Objectifs',
      options: [
        { label: 'Développement Fullstack (Web + Mobile + Backend)', value: 'Fullstack' },
        { label: 'Développement Frontend (Interfaces Web modernes)', value: 'Frontend' },
        { label: 'Développement Mobile (Applications Android)', value: 'Mobile' },
        { label: 'Développement Backend & API (Bases de données)', value: 'Backend' },
      ],
    },
    {
      id: 'time_commitment',
      question: 'Combien d’heures par semaine pouvez-vous consacrer à l’apprentissage ?',
      category: 'Objectifs',
      options: [
        { label: 'Plus de 20 heures / semaine (Immersion totale)', value: '+20h / semaine' },
        { label: 'Entre 10 et 20 heures / semaine', value: '10h-20h / semaine' },
        { label: 'Entre 5 et 10 heures / semaine', value: '5h-10h / semaine' },
        { label: 'Moins de 5 heures / semaine', value: '< 5h / semaine' },
      ],
    },
  ];

  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (value: string) => {
    soundEngine.playSuccess();
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));

    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        soundEngine.playReveal();
      }, 350);
    } else {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      soundEngine.playClick();
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header Info */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 border border-slate-200/60 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-500/20">
              <Terminal className="w-4 h-4" />
              <span>ÉTAPE 2 / 3 : DIAGNOSTIC TECHNIQUE ET APPRÉCIATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Évaluation de Votre Profil
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Répondez aux questions ci-dessous pour permettre au formateur de personnaliser votre programme.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Award className="w-4 h-4 text-blue-500" />
            <span>Questions restantes : <strong className="text-blue-600 dark:text-blue-400 font-mono text-sm">{totalQuestions - (currentQuestionIndex + 1)}</strong></span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Catégorie : <strong className="text-slate-900 dark:text-white">{currentQ.category}</strong></span>
            <span>Question {currentQuestionIndex + 1} sur {totalQuestions} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-panel-glow p-6 sm:p-10 rounded-3xl mb-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question Label */}
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-6 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === option.value;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option.value)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-left font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-100/90 dark:from-indigo-950/50 dark:to-purple-950/50 ring-2 ring-indigo-500/30 text-indigo-950 dark:text-indigo-100 scale-[1.01] shadow-md'
                        : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-200 hover:border-indigo-500 hover:bg-indigo-50/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option.label}</span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              currentQuestionIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
            }`}
          >
            &larr; Question Précédente
          </button>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            {answeredCount} / {totalQuestions} questions répondues
          </span>
        </div>

      </div>

    </div>
  );
};
