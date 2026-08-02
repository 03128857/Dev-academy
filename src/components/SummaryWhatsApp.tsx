import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Copy, 
  Check, 
  FileDown, 
  Edit3, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { RegistrationData, DiagnosticAnswers } from '../types';
import { soundEngine } from '../utils/sound';

interface SummaryWhatsAppProps {
  formData: RegistrationData;
  diagnosticAnswers: DiagnosticAnswers;
  onEditRegistration: () => void;
  onEditDiagnostic: () => void;
}

export const SummaryWhatsApp: React.FC<SummaryWhatsAppProps> = ({
  formData,
  diagnosticAnswers,
  onEditRegistration,
  onEditDiagnostic,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Target Formateur WhatsApp Number (used for redirect link only)
  const whatsappUrlNumber = '243999140566'; 

  // Generate clean WhatsApp Message
  const generateWhatsAppMessage = (): string => {
    return `========================================
🎓 NOUVELLE INSCRIPTION - FORMATION WEB & MOBILE
========================================

👤 IDENTITÉ & CONTACT
• Nom : ${formData.nom || 'N/A'}
• Postnom : ${formData.postnom || 'N/A'}
• Prénom : ${formData.prenom || 'N/A'}
• Sexe : ${formData.sexe || 'N/A'}
• Date de Naissance : ${formData.dateNaissance || 'N/A'} (${formData.age} ans)
• Pays : ${formData.pays || 'N/A'}
• WhatsApp : ${formData.whatsapp || 'N/A'}
• E-mail : ${formData.email || 'N/A'}

🎓 PROFIL & MATÉRIEL
• Profession : ${formData.profession || 'N/A'}
• Ordinateur Portable : ${formData.ordinateurPortable || 'N/A'}
• Source Info : ${formData.sourceInformation || 'N/A'}
• Motivation : ${formData.motivation || 'N/A'}

📊 DIAGNOSTIC TECHNIQUE
• Expérience Web : ${diagnosticAnswers.web_exp || 'N/A'}
• Niveau HTML : ${diagnosticAnswers.html_level || 'N/A'}
• Niveau CSS : ${diagnosticAnswers.css_level || 'N/A'}
• Niveau JavaScript : ${diagnosticAnswers.js_level || 'N/A'}
• Niveau PHP : ${diagnosticAnswers.php_level || 'N/A'}
• Niveau MySQL : ${diagnosticAnswers.mysql_level || 'N/A'}
• Git / GitHub : ${diagnosticAnswers.git_github || 'N/A'}
• Durée Expérience : ${diagnosticAnswers.duration_exp || 'N/A'}
• Projet complet réalisé : ${diagnosticAnswers.complete_project || 'N/A'}
• Site web publié : ${diagnosticAnswers.published_website || 'N/A'}
• App mobile créée : ${diagnosticAnswers.mobile_app || 'N/A'}
• Objectif principal : ${diagnosticAnswers.main_target || 'N/A'}
• Domaine d'intérêt : ${diagnosticAnswers.preferred_field || 'N/A'}
• Disponibilité : ${diagnosticAnswers.time_commitment || 'N/A'}

========================================
Message généré automatiquement depuis la plateforme d'inscription.`;
  };

  const messageText = generateWhatsAppMessage();
  const encodedText = encodeURIComponent(messageText);
  const whatsappLink = `https://wa.me/${whatsappUrlNumber}?text=${encodedText}`;

  const handleCopy = () => {
    soundEngine.playSuccess();
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = () => {
    soundEngine.playClick();
    const blob = new Blob([messageText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inscription_${formData.nom}_${formData.prenom}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Top Banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 border border-emerald-500/40 dark:border-emerald-800 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-emerald-500" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>INSCRIPTION & DIAGNOSTIC VALIDÉS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Félicitations, {formData.prenom} !
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Votre dossier d'inscription et diagnostic technique sont prêts. Cliquez sur le bouton ci-dessous pour transmettre vos informations directement au formateur via WhatsApp.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Send Card */}
      <div className="glass-panel-glow p-6 sm:p-10 rounded-3xl mb-8 border border-blue-500/30 dark:border-slate-800 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          <span>Aperçu du Message Formaté WhatsApp</span>
        </h3>

        {/* Formatted Text Box */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto border border-slate-800 max-h-96 shadow-inner mb-6">
          <pre className="whitespace-pre-wrap font-mono">{messageText}</pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Primary WhatsApp Direct Link */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playSuccess()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all text-center cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span>Envoyer mon Dossier d'Inscription via WhatsApp</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-extrabold text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Message Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier le Texte</span>
              </>
            )}
          </button>

          {/* Download Text File */}
          <button
            onClick={handleDownloadReport}
            title="Télécharger la fiche d'inscription"
            className="p-4 rounded-2xl bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            <FileDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Edit or Review Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Informations Personnelles</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Modifier vos coordonnées et profil</p>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onEditRegistration();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-all border border-blue-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier</span>
          </button>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Diagnostic Technique</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Modifier vos réponses techniques</p>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onEditDiagnostic();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 transition-all border border-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier</span>
          </button>
        </div>
      </div>

    </div>
  );
};
