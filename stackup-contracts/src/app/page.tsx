import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { StatsSection } from './components/StatsSection';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturesSection />
      <StatsSection />
      <Footer />
    </div>
  );
}
