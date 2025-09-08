"use client";
import { Navigation } from "@/components/navigation";
import { ExecutiveSummary } from "@/components/landing/ExecutiveSummary";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <ExecutiveSummary />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}