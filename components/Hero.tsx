import ParticleField from "./ParticleField";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-accent/[0.04] blur-[120px] animate-pulse-glow" />

      {/* Particle field */}
      <ParticleField />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Distomos branding */}
        <div className="mb-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <a
            href="https://distomostech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted text-xs tracking-[0.2em] uppercase hover:text-text-secondary transition-colors font-body"
          >
            Distomos
          </a>
        </div>

        {/* Product name */}
        <h1
          className="font-display text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-text-primary mb-6 opacity-0 animate-fade-in-up glow-text"
          style={{ animationDelay: "0.2s" }}
        >
          Exocortex
        </h1>

        {/* Tagline */}
        <p
          className="font-display text-xl sm:text-2xl text-accent-light/90 mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          Every AI knows a piece of you. Exocortex knows all of you.
        </p>

        {/* Description */}
        <p
          className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          A personal data layer that unifies your digital identity across platforms.
          Connect your AI tools, email, and messages — and never explain yourself twice.
        </p>

        {/* CTA */}
        <div
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <WaitlistForm />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </section>
  );
}
