"use client";

import { useEffect, useRef, useState } from "react";
import WaitlistForm from "./WaitlistForm";

export default function WaitlistCTA() {
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
    <section ref={sectionRef} className="relative py-28 sm:py-36 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />

      <div
        className={`relative max-w-lg mx-auto text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary mb-4">
          Be first to access Exocortex.
        </h2>
        <p className="text-text-secondary text-lg mb-10">
          Join the waitlist and we&apos;ll let you know when it&apos;s your turn.
        </p>
        <WaitlistForm compact />
      </div>
    </section>
  );
}
