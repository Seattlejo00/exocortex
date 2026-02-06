import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import WaitlistCTA from "@/components/WaitlistCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
