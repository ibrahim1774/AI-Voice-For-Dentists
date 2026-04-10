"use client";

import { useState, useEffect } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LOADING_MESSAGES = [
  { text: "Analyzing your dental practice...", duration: 4000 },
  { text: "Building your custom AI receptionist...", duration: 5000 },
  { text: "Training on dental knowledge...", duration: 5000 },
  { text: "Setting up your phone system...", duration: 5000 },
  { text: "Final touches — almost there...", duration: 6000 },
];

export default function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setMessageIndex(0);
      setFadeKey(0);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const advance = () => {
      if (currentIndex < LOADING_MESSAGES.length - 1) {
        currentIndex++;
        setMessageIndex(currentIndex);
        setFadeKey((prev) => prev + 1);
        timeoutId = setTimeout(advance, LOADING_MESSAGES[currentIndex].duration);
      }
    };

    timeoutId = setTimeout(advance, LOADING_MESSAGES[0].duration);

    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="text-center max-w-sm mx-auto px-6">
        {/* Teal spinning ring */}
        <div className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />

        {/* Animated message */}
        <p
          key={fadeKey}
          className="text-lg font-sans font-semibold text-foreground animate-fade-in-up md:text-xl"
        >
          {LOADING_MESSAGES[messageIndex].text}
        </p>

        {/* Progress dots */}
        <div className="mt-5 flex justify-center gap-2">
          {LOADING_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors duration-500 ${
                i <= messageIndex ? "bg-gold" : "bg-gold/20"
              }`}
            />
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xs font-sans text-xs text-muted leading-relaxed">
          Please do not move away from this page or your custom demo won&apos;t generate.
        </p>

        {/* Time estimate */}
        <p className="mt-5 font-sans text-sm text-muted">
          This takes about 20–30 seconds
        </p>

        {/* Warning */}
        <div className="mt-4 rounded-lg border border-gold/20 bg-gold/5 px-4 py-2.5">
          <p className="font-sans text-xs font-medium text-gold">
            Please don&apos;t leave this page — your receptionist is being built!
          </p>
        </div>
      </div>
    </div>
  );
}
