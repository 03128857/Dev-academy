/**
 * Application types for Registration & Technical Diagnostic System
 */

export type AppPhase = 'intro' | 'registration' | 'diagnostic' | 'summary';

export interface RegistrationData {
  nom: string;
  postnom: string;
  prenom: string;
  sexe: 'Homme' | 'Femme' | 'Autre' | '';
  dateNaissance: string;
  age: number | string;
  pays: string;
  whatsapp: string;
  email: string;
  profession: string;
  ordinateurPortable: 'Oui' | 'Non' | '';
  sourceInformation: string;
  motivation: string;
  accepteConditions: boolean;
  // Optional legacy fields kept for backwards compatibility
  adressePhysique?: string;
  ville?: string;
  province?: string;
  niveauEtude?: string;
  etablissement?: string;
  smartphoneAndroid?: 'Oui' | 'Non' | '';
  connexionInternet?: 'Oui' | 'Non' | '';
}

export interface QuestionOption {
  label: string;
  value: string;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  category: 'Général' | 'Technologies' | 'Expérience' | 'Objectifs';
  options: QuestionOption[];
}

export interface DiagnosticAnswers {
  [questionId: string]: string;
}

export interface FieldConfig {
  key: keyof RegistrationData;
  label: string;
  placeholderText: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'checkbox';
  options?: string[];
  helpText?: string;
  validate: (value: any, formData: RegistrationData) => { valid: boolean; message?: string };
}
