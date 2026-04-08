"use client";

import { useEffect } from "react";
import { BOOKING_WIDGET_URL, FORM_EMBED_SCRIPT_URL } from "@/lib/constants";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Load the form embed script
  useEffect(() => {
    if (!isOpen) return;

    const existing = document.querySelector(
      `script[src="${FORM_EMBED_SCRIPT_URL}"]`
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = FORM_EMBED_SCRIPT_URL;
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative z-10 mx-2 w-full max-w-2xl max-h-[98vh] overflow-hidden rounded-2xl border border-gold/20 bg-card shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 shrink-0">
          <h2 className="font-serif text-base font-bold text-foreground md:text-lg">
            Book Your Setup Call
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-subtle transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* HIPAA Badge */}
        <div className="flex items-center justify-center gap-1.5 border-b border-slate-200 bg-gold/5 px-4 py-1.5 shrink-0">
          <svg className="h-3.5 w-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-[11px] font-semibold tracking-wide text-gold">HIPAA Compliant</span>
        </div>

        {/* Calendar Widget */}
        <div className="flex-1 min-h-0 relative overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          <iframe
            src={BOOKING_WIDGET_URL}
            style={{ width: "100%", minHeight: "900px", border: "none" }}
          />

          {/* Scroll hint */}
          <div className="sticky bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-card via-card/95 to-transparent py-2.5 pt-6 pointer-events-none">
            <svg className="h-4 w-4 text-gold animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs font-medium text-gold">Scroll down to finish booking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
