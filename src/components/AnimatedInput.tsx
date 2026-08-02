import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface AnimatedInputProps {
  id: string;
  label: string;
  placeholderText: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'checkbox';
  value: any;
  onChange: (val: any) => void;
  options?: string[];
  isValid: boolean;
  errorMessage?: string;
  helpText?: string;
  isRequired?: boolean;
  autoFocus?: boolean;
  onEnterPress?: () => void;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  id,
  label,
  placeholderText,
  type = 'text',
  value,
  onChange,
  options = [],
  isValid,
  errorMessage,
  helpText,
  isRequired = true,
  autoFocus = false,
  onEnterPress,
}) => {
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasBeenTouched, setHasBeenTouched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, id]);

  // Typewriter placeholder animation effect for text inputs
  useEffect(() => {
    if (type === 'select' || type === 'checkbox') {
      setDisplayedPlaceholder(placeholderText);
      return;
    }

    if (value) {
      setDisplayedPlaceholder(placeholderText);
      return;
    }

    if (!placeholderText) {
      setDisplayedPlaceholder('');
      return;
    }

    let isSubscribed = true;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: number;

    const animateTypewriter = () => {
      if (!isSubscribed) return;

      if (!isDeleting) {
        // Typing letter by letter
        setDisplayedPlaceholder(placeholderText.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex >= placeholderText.length) {
          isDeleting = true;
          timeoutId = window.setTimeout(animateTypewriter, 1800);
          return;
        }
        timeoutId = window.setTimeout(animateTypewriter, 70 + Math.random() * 30);
      } else {
        // Deleting letter by letter
        setDisplayedPlaceholder(placeholderText.substring(0, charIndex - 1));
        charIndex--;

        if (charIndex <= 0) {
          isDeleting = false;
          timeoutId = window.setTimeout(animateTypewriter, 500);
          return;
        }
        timeoutId = window.setTimeout(animateTypewriter, 35);
      }
    };

    animateTypewriter();

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
    };
  }, [placeholderText, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setHasBeenTouched(true);
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onChange(checked);
    } else {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenTouched(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    soundEngine.playClick();
  };

  const showSuccess = hasBeenTouched && isValid && value !== '' && value !== false;
  const showError = hasBeenTouched && !isValid && errorMessage;

  return (
    <div className="w-full mb-5 transition-all duration-300">
      
      {/* Label Header */}
      <div className="flex items-center justify-between mb-2">
        <label 
          htmlFor={id} 
          className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5"
        >
          <span>{label}</span>
          {isRequired && <span className="text-rose-600 dark:text-rose-400 font-extrabold">*</span>}
        </label>

        {/* Validation Badges */}
        <div className="flex items-center gap-1">
          {showSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valide
            </span>
          )}
          {showError && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-300 dark:border-rose-800 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Requis
            </span>
          )}
        </div>
      </div>

      {/* Input Field Variants */}
      <div className="relative">
        {type === 'select' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {options.map((option) => {
              const isSelected = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setHasBeenTouched(true);
                    onChange(option);
                    soundEngine.playClick();
                  }}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-98 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-100/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/30 shadow-md scale-[1.02]'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:border-blue-400 hover:bg-slate-50 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="truncate">{option}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400 dark:border-slate-600'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : type === 'textarea' ? (
          <textarea
            id={id}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder={displayedPlaceholder + (value ? '' : ' |')}
            className={`w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold placeholder:text-slate-500 dark:placeholder:text-slate-500 shadow-sm transition-all duration-200 outline-none resize-none ${
              showError
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                : showSuccess
                ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
                : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
            }`}
          />
        ) : type === 'checkbox' ? (
          <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer hover:border-blue-500 transition-colors">
            <input
              id={id}
              type="checkbox"
              checked={!!value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
              J'accepte intégralement les conditions de participation et le règlement intérieur de la formation.
            </span>
          </label>
        ) : (
          <input
            id={id}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type === 'date' && (isFocused || value) ? 'date' : type === 'date' ? 'text' : type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={displayedPlaceholder + (value ? '' : ' |')}
            className={`w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold placeholder:text-slate-500 dark:placeholder:text-slate-500 shadow-sm transition-all duration-200 outline-none ${
              showError
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                : showSuccess
                ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
                : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
            }`}
          />
        )}
      </div>

      {/* Helper text / Error text */}
      {showError && (
        <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMessage}
        </p>
      )}

      {helpText && !showError && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          {helpText}
        </p>
      )}

    </div>
  );
};
