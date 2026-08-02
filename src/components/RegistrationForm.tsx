import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  MapPin, 
  PhoneCall, 
  GraduationCap, 
  Laptop, 
  FileText,
  Edit2,
  Sparkles,
  Award
} from 'lucide-react';
import { RegistrationData, FieldConfig } from '../types';
import { AnimatedInput } from './AnimatedInput';
import { soundEngine } from '../utils/sound';

interface RegistrationFormProps {
  formData: RegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationData>>;
  onComplete: () => void;
  setProgress: (val: number) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  setFormData,
  onComplete,
  setProgress,
}) => {
  // Current visible step index (0 to fields.length - 1)
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number>(0);

  // Field configurations list (Simplified to prevent user fatigue)
  const fieldConfigs: FieldConfig[] = [
    {
      key: 'nom',
      label: 'Nom de famille',
      placeholderText: 'Ex: KABANGE',
      type: 'text',
      helpText: 'Saisissez votre nom de famille officiel.',
      validate: (v) => ({
        valid: typeof v === 'string' && v.trim().length >= 2,
        message: 'Le nom doit contenir au moins 2 caractères.',
      }),
    },
    {
      key: 'postnom',
      label: 'Postnom',
      placeholderText: 'Ex: MUKENDI',
      type: 'text',
      helpText: 'Saisissez votre postnom.',
      validate: (v) => ({
        valid: typeof v === 'string' && v.trim().length >= 2,
        message: 'Le postnom doit contenir au moins 2 caractères.',
      }),
    },
    {
      key: 'prenom',
      label: 'Prénom',
      placeholderText: 'Ex: Christian',
      type: 'text',
      helpText: 'Saisissez votre prénom usuel.',
      validate: (v) => ({
        valid: typeof v === 'string' && v.trim().length >= 2,
        message: 'Le prénom doit contenir au moins 2 caractères.',
      }),
    },
    {
      key: 'sexe',
      label: 'Sexe / Genre',
      placeholderText: 'Sélectionnez votre sexe',
      type: 'select',
      options: ['Homme', 'Femme', 'Autre'],
      validate: (v) => ({
        valid: v === 'Homme' || v === 'Femme' || v === 'Autre',
        message: 'Veuillez sélectionner votre sexe.',
      }),
    },
    {
      key: 'dateNaissance',
      label: 'Date de naissance',
      placeholderText: 'AAAA-MM-JJ',
      type: 'date',
      helpText: "L'âge sera calculé automatiquement. Réservé aux personnes d'au moins 12 ans.",
      validate: (v) => {
        if (!v || typeof v !== 'string') {
          return { valid: false, message: 'La date de naissance est obligatoire.' };
        }
        const birthDate = new Date(v);
        if (isNaN(birthDate.getTime())) {
          return { valid: false, message: 'Veuillez saisir une date de naissance valide.' };
        }
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }

        if (calculatedAge < 12) {
          return {
            valid: false,
            message: `Accès refusé : Vous avez ${calculatedAge < 0 ? 0 : calculatedAge} ans. Vous devez avoir au moins 12 ans pour vous inscrire à cette formation.`,
          };
        }
        if (calculatedAge > 90) {
          return {
            valid: false,
            message: 'Veuillez vérifier la date de naissance saisie (âge supérieur à 90 ans).',
          };
        }
        return { valid: true };
      },
    },
    {
      key: 'pays',
      label: 'Pays de résidence',
      placeholderText: 'Ex: République Démocratique du Congo',
      type: 'text',
      validate: (v) => ({
        valid: typeof v === 'string' && v.trim().length >= 2,
        message: 'Veuillez indiquer votre pays.',
      }),
    },
    {
      key: 'whatsapp',
      label: 'Numéro WhatsApp actif (Format RDC uniquement)',
      placeholderText: 'Ex: 0852356789 ou +243852356789',
      type: 'tel',
      helpText: 'Seul le format RDC est accepté (10 chiffres commençant par 0, ou 12 chiffres avec +243).',
      validate: (v) => {
        if (!v || typeof v !== 'string') {
          return { valid: false, message: 'Numéro WhatsApp RDC obligatoire.' };
        }
        const cleaned = v.trim().replace(/[\s\-\(\)]/g, '');
        if (cleaned.startsWith('0')) {
          if (!/^0\d{9}$/.test(cleaned)) {
            return { valid: false, message: 'Un numéro commençant par 0 doit contenir exactement 10 chiffres (ex: 0852356789).' };
          }
          return { valid: true };
        }
        if (cleaned.startsWith('+243')) {
          if (!/^\+243\d{9}$/.test(cleaned)) {
            return { valid: false, message: 'Un numéro avec +243 doit contenir exactement 12 chiffres (ex: +243852356789).' };
          }
          return { valid: true };
        }
        if (cleaned.startsWith('243')) {
          if (!/^243\d{9}$/.test(cleaned)) {
            return { valid: false, message: 'Un numéro avec 243 doit contenir exactement 12 chiffres (ex: 243852356789).' };
          }
          return { valid: true };
        }
        return { valid: false, message: 'Seuls les numéros au format RDC (+243... ou 0...) sont acceptés.' };
      },
    },
    {
      key: 'email',
      label: 'Adresse e-mail officielle',
      placeholderText: 'Ex: votre.nom@gmail.com',
      type: 'email',
      validate: (v) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          valid: emailRegex.test(v || ''),
          message: 'Adresse email valide requise (ex: nom@domaine.com).',
        };
      },
    },
    {
      key: 'profession',
      label: 'Profession ou activité principale',
      placeholderText: 'Ex: Étudiant, Développeur, Enseignant, Indépendant...',
      type: 'text',
      validate: (v) => ({
        valid: typeof v === 'string' && v.trim().length >= 2,
        message: 'Veuillez renseigner votre profession.',
      }),
    },
    {
      key: 'ordinateurPortable',
      label: 'Disposez-vous d’un ordinateur portable pour la pratique ?',
      placeholderText: 'Sélectionnez Oui ou Non',
      type: 'select',
      options: ['Oui', 'Non'],
      helpText: 'Essentiel pour réaliser les 80% d’exercices pratiques.',
      validate: (v) => ({
        valid: v === 'Oui' || v === 'Non',
        message: 'Veuillez faire un choix.',
      }),
    },
    {
      key: 'sourceInformation',
      label: 'Comment avez-vous connu cette formation ?',
      placeholderText: 'Sélectionnez une source',
      type: 'select',
      options: [
        'Réseaux Sociaux (Facebook, WhatsApp, LinkedIn)',
        'Recommandation d\'un ami / collègue',
        'Affichage publicitaire',
        'Site Web / Recherche Google',
        'Autre',
      ],
      validate: (v) => ({
        valid: typeof v === 'string' && v.length > 0,
        message: 'Indiquez comment vous avez connu la formation.',
      }),
    },
    {
      key: 'motivation',
      label: 'Quelle est votre motivation principale ?',
      placeholderText: 'Décrivez brièvement vos attentes (ex: Trouver un emploi, créer une startup, reconversion...)',
      type: 'textarea',
      validate: (v) => ({
        valid: typeof v === 'string' && v.trim().length >= 10,
        message: 'Veuillez exprimer votre motivation (au moins 10 caractères).',
      }),
    },
    {
      key: 'accepteConditions',
      label: 'Acceptation du règlement',
      placeholderText: '',
      type: 'checkbox',
      validate: (v) => ({
        valid: v === true,
        message: 'Vous devez accepter les conditions pour poursuivre.',
      }),
    },
  ];

  // Automatic Age calculation when date of birth changes
  useEffect(() => {
    if (formData.dateNaissance) {
      const birthDate = new Date(formData.dateNaissance);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (!isNaN(calculatedAge) && calculatedAge > 0) {
        setFormData((prev) => ({ ...prev, age: calculatedAge }));
      }
    }
  }, [formData.dateNaissance, setFormData]);

  // Update global progress state
  useEffect(() => {
    const validCount = fieldConfigs.filter((config) => {
      const val = formData[config.key];
      return config.validate(val, formData).valid;
    }).length;

    const percent = Math.round((validCount / fieldConfigs.length) * 100);
    setProgress(percent);
  }, [formData, setProgress]);

  const [showFieldErrorAlert, setShowFieldErrorAlert] = useState<boolean>(false);

  // Handle value change for current field without auto-advancing (prevents interrupting user while typing)
  const handleFieldChange = (key: keyof RegistrationData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'dateNaissance' && value) {
        const birthDate = new Date(value);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
          }
          updated.age = calculatedAge;
        } else {
          updated.age = '';
        }
      }
      return updated;
    });
    setShowFieldErrorAlert(false);
  };

  const currentConfig = fieldConfigs[currentFieldIndex];
  const currentValue = formData[currentConfig.key];
  const currentValidation = currentConfig.validate(currentValue, formData);

  const isAllValid = fieldConfigs.every((cfg) => cfg.validate(formData[cfg.key], formData).valid);

  const handleNextClick = () => {
    if (currentValidation.valid) {
      setShowFieldErrorAlert(false);
      if (currentFieldIndex < fieldConfigs.length - 1) {
        soundEngine.playReveal();
        setCurrentFieldIndex((prev) => prev + 1);
      } else if (isAllValid) {
        soundEngine.playSuccess();
        onComplete();
      }
    } else {
      soundEngine.playClick();
      setShowFieldErrorAlert(true);
    }
  };

  const handlePrevClick = () => {
    if (currentFieldIndex > 0) {
      soundEngine.playClick();
      setCurrentFieldIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 border border-slate-200/60 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-500/20">
              <UserCheck className="w-4 h-4" />
              <span>ÉTAPE 1 / 3 : FORMULAIRE D'INSCRIPTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Saisie Progressive des Données
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Les champs se débloquent au fur et à mesure de votre saisie.
            </p>
          </div>

          {/* Age Indicator Display if calculated */}
          {formData.age ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <Award className="w-8 h-8 text-cyan-300" />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200">Âge Calculé</span>
                <p className="text-lg font-extrabold font-mono">{formData.age} ans</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Step Indicator Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Champ {currentFieldIndex + 1} sur {fieldConfigs.length} : {currentConfig.label}</span>
            <span>{Math.round(((currentFieldIndex + 1) / fieldConfigs.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentFieldIndex + 1) / fieldConfigs.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Form Card */}
      <div className="glass-panel-glow p-6 sm:p-10 rounded-3xl mb-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Active Field Focus Area (Progressive one-by-one field display) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentConfig.key}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="py-4"
          >
            <AnimatedInput
              id={currentConfig.key}
              label={currentConfig.label}
              placeholderText={currentConfig.placeholderText}
              type={currentConfig.type}
              value={formData[currentConfig.key]}
              onChange={(val) => handleFieldChange(currentConfig.key, val)}
              options={currentConfig.options}
              isValid={currentValidation.valid}
              errorMessage={currentValidation.message}
              helpText={currentConfig.helpText}
              autoFocus={true}
              onEnterPress={handleNextClick}
            />

            {/* Error Alert when clicking Suivant without completing the field */}
            {showFieldErrorAlert && !currentValidation.valid && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs sm:text-sm font-semibold flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Ce champ est obligatoire. {currentValidation.message || "Veuillez remplir correctement ce champ avant de passer au suivant."}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800">
          <button
            onClick={handlePrevClick}
            disabled={currentFieldIndex === 0}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentFieldIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
            }`}
          >
            &larr; Précédent
          </button>

          {isAllValid && currentFieldIndex === fieldConfigs.length - 1 ? (
            <button
              onClick={() => {
                soundEngine.playSuccess();
                onComplete();
              }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Valider & Passer au Diagnostic</span>
              <Sparkles className="w-4 h-4 animate-spin" />
            </button>
          ) : (
            <button
              onClick={handleNextClick}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
                currentValidation.valid
                  ? 'bg-blue-600 text-white shadow-blue-500/25 hover:bg-blue-700 hover:scale-105'
                  : 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 hover:bg-amber-200 dark:hover:bg-amber-500/30'
              }`}
            >
              <span>Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Completed Fields Review Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Récapitulatif des Champs Complétés</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {fieldConfigs.map((cfg, idx) => {
            const val = formData[cfg.key];
            const isValid = cfg.validate(val, formData).valid;
            const isCurrent = idx === currentFieldIndex;

            return (
              <div
                key={cfg.key}
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentFieldIndex(idx);
                }}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all duration-200 ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : isValid
                    ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 hover:border-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase">
                    {cfg.label}
                  </span>
                  {isValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {val === true ? 'Accepté' : val || 'Non renseigné'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
