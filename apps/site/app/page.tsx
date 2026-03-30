import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { FounderStatement } from "@/components/landing/founder-statement";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { SectionSeparator } from "@/components/landing/section-separator";
import { TranslatorBanner } from "@/components/landing/translator-banner";

export default function HomePage() {
  return (
    <>
      <TranslatorBanner />
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Hero />
        <SectionSeparator>
          <Features />
        </SectionSeparator>
        <SectionSeparator>
          <FounderStatement />
        </SectionSeparator>
      </main>
      <Footer />
    </>
  );
}
