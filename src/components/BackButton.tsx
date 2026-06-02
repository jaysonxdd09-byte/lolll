import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onBack: () => void;
  label?: string;
  className?: string;
}

export default function BackButton({ onBack, label = 'Back', className = '' }: BackButtonProps) {
  return (
    <button
      onClick={onBack}
      className={`inline-flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors group ${className}`}
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
