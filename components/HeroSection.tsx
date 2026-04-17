import IntakeForm from "./IntakeForm";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden dotted-grid-bg">
      {/* Soft radial glow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0) 70%)",
        }}
      />

      {/* Logo */}
      <div className="absolute top-5 left-5 z-20 md:top-7 md:left-8">
        <span className="font-serif text-lg font-bold text-foreground md:text-xl">
          Dental PrimeHub <span className="text-muted">AI</span>
        </span>
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-4xl flex-col items-center justify-center px-5 py-24 text-center">
        {/* Main headline */}
        <h1 className="font-serif text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[56px]">
          Generate your custom dentist demo{" "}
          <span className="text-muted">in 20 seconds.</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-5 max-w-2xl font-sans text-sm leading-relaxed text-muted md:mt-6 md:text-base">
          Stop losing patients to missed calls. Your AI receptionist answers
          24/7 — booking appointments, handling insurance questions, and
          managing emergencies while you&apos;re chairside.
        </p>

        {/* Intake Form */}
        <div className="mt-10 w-full md:mt-12">
          <IntakeForm />
        </div>

        {/* HIPAA Badge */}
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 backdrop-blur-sm">
            <svg
              className="h-3.5 w-3.5 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              />
            </svg>
            <span className="text-xs font-medium tracking-wide text-muted">
              HIPAA Compliant
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
