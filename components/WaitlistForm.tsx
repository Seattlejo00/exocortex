"use client";

import { useState, FormEvent } from "react";

export default function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setName("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className={`${compact ? "" : "max-w-md mx-auto"}`}>
        <div className="gradient-border rounded-xl bg-bg-card/50 p-6 text-center">
          <div className="text-accent-light text-lg font-display font-medium mb-1">
            You&apos;re on the list.
          </div>
          <p className="text-text-secondary text-sm">
            We&apos;ll reach out when Exocortex is ready for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${compact ? "" : "max-w-md mx-auto"}`}
    >
      <div className="flex flex-col gap-3">
        {!compact && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-bg-card border border-white/[0.06] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors font-body text-sm"
          />
        )}
        <div className={compact ? "flex gap-3" : "flex flex-col gap-3"}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            className={`${
              compact ? "flex-1" : "w-full"
            } px-4 py-3 rounded-lg bg-bg-card border border-white/[0.06] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors font-body text-sm`}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-light text-white font-display font-medium text-sm tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Joining...
              </span>
            ) : (
              "Join the Waitlist"
            )}
          </button>
        </div>
      </div>
      {errorMsg && (
        <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
      )}
    </form>
  );
}
