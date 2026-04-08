import IntakeForm from "./IntakeForm";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center px-5 py-8 md:py-12 aurora-bg overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(13,148,136,0.06)_0%,transparent_70%)]" />

      {/* Static ambient orb for depth */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "400px",
          background: "rgba(13, 148, 136, 0.04)",
          filter: "blur(60px)",
        }}
      />

      {/* Top edge glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        style={{ boxShadow: "0 0 15px rgba(13, 148, 136, 0.15)" }}
      />

      {/* Logo */}
      <div className="absolute top-4 left-5 z-20 md:top-6 md:left-8">
        <span className="font-serif text-lg font-bold text-foreground md:text-xl">
          Dental PrimeHub <span className="text-gold">AI</span>
        </span>
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10 mx-auto max-w-4xl w-full text-center">
        {/* Main headline */}
        <h1 className="font-serif text-2xl font-bold leading-[1.25] text-foreground sm:text-3xl md:text-3xl lg:text-4xl">
          New York City Dentists: Stop Losing Patients to Missed Calls —{" "}
          <span className="text-gold bg-gold/10 px-2 py-0.5 rounded-lg">Generate Custom Demo In 20 Seconds</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted md:mt-4 md:text-sm">
          When you miss a call, you lose a patient. Our AI receptionist picks up
          every call, day and night. It books appointments, answers questions, and
          handles emergencies — all while keeping patient data safe and HIPAA compliant.
          Try a free sample below. We&apos;ll build one fully custom for your practice.
        </p>

        {/* HIPAA + Custom Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:mt-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3 py-1">
            <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-xs font-semibold tracking-wide text-gold">HIPAA Compliant</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3 py-1">
            <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span className="text-xs font-semibold tracking-wide text-gold">Custom-Built for Your Practice</span>
          </div>
        </div>

        {/* Intake Form */}
        <div className="mt-5 md:mt-6">
          <IntakeForm />
        </div>
      </div>
    </section>
  );
}
