"use client";

import { useEffect, useRef, useState } from "react";

const platforms = [
  { name: "ChatGPT", icon: "💬" },
  { name: "Claude", icon: "🔮" },
  { name: "Email", icon: "📧" },
  { name: "Slack", icon: "💼" },
  { name: "Gemini", icon: "✦" },
  { name: "Notes", icon: "📝" },
];

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary mb-6 text-center">
            Your digital self is scattered.
          </h2>
          <p className="text-text-secondary text-center max-w-2xl mx-auto text-lg leading-relaxed mb-16">
            You&apos;ve told ChatGPT your job title. Claude knows your writing style.
            Your email has a decade of decisions. Your Slack has every project discussion.
            None of them talk to each other.
          </p>
        </div>

        {/* Platform nodes visualization */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
            {platforms.map((platform, i) => (
              <div
                key={platform.name}
                className="gradient-border rounded-xl bg-bg-card/60 px-5 py-4 flex flex-col items-center gap-2 transition-all duration-500"
                style={{
                  animationDelay: `${i * 100}ms`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "scale(1)" : "scale(0.9)",
                  transitionDelay: `${400 + i * 100}ms`,
                }}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-text-secondary text-xs font-body">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>

          {/* Disconnected → Connected visual */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-red-500/40 mx-auto mb-2" />
              <span className="text-text-muted text-xs">Fragmented</span>
            </div>
            <div className="flex-1 max-w-32 h-px bg-gradient-to-r from-red-500/20 via-text-muted/20 to-accent/40" />
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-accent/80 mx-auto mb-2 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              <span className="text-accent-light text-xs font-medium">Unified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
