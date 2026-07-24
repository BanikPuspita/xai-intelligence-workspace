import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import InsightFlow from '@/components/InsightFlow';
import DashboardPreview from '@/components/DashboardPreview';
import SignatureSection from '@/components/SignatureSection';
import Footer from '@/components/Footer';
import BootIntro from '@/components/BootIntro';

export default function Home() {
  return (
    <BootIntro>
      <main className="relative min-h-screen overflow-x-hidden">
        <Nav />
        <Hero />
        <InsightFlow />
        <DashboardPreview />
        <SignatureSection />
        <Footer />
      </main>
    </BootIntro>
  );
}
