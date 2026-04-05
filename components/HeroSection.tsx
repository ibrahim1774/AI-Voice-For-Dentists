import IntakeForm from "./IntakeForm";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center px-4 py-4 md:py-12 aurora-bg overflow-hidden">
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
        <h1 className="font-serif text-xl font-bold leading-[1.2] text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
          Your 24/7 AI Dental Receptionist: Custom Demo Built in 20 Seconds{" "}
          <span className="text-gold">— Don&apos;t Lose a Patient to a Missed Call</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-2 max-w-xl font-sans text-xs leading-relaxed text-muted md:mt-3 md:text-sm">
          Every missed call is a lost patient. Your AI receptionist answers
          24/7 — booking appointments, handling insurance questions, and
          managing emergencies while you&apos;re chairside. Enter your details
          below to try a working demo now.
        </p>

        {/* HIPAA Badge */}
        <div className="mt-3 flex items-center justify-center gap-2 md:mt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3 py-1">
            <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-xs font-semibold tracking-wide text-gold">HIPAA Compliant AI Receptionist</span>
          </div>
        </div>

        {/* Intake Form */}
        <div className="mt-3 md:mt-5">
          <IntakeForm />
        </div>
      </div>
    </section>
  );
}
