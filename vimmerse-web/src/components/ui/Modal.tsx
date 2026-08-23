"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './Button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                "glass-card relative w-full max-w-lg overflow-hidden rounded-2xl p-6 shadow-2xl pointer-events-auto border-[var(--color-electric-violet)]/20",
                className
              )}
            >
              {title && (
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              {!title && (
                 <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground z-10"
                  >
                    <X size={18} />
                  </button>
              )}
              <div className="relative z-10">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
