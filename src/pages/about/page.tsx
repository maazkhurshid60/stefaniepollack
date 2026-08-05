import PageHero from "@/components/feature/PageHero";
import Bio from "./components/Bio";
import CompassSection from "./components/CompassSection";
import TestimonialsGrid from "./components/TestimonialsGrid";
import CTASection from "../home/components/CTASection";

export default function About() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="About Stefanie"
        title="Meet"
        italicTitle="Stefanie"
        subtitle="Studio City native. Compass Realtor. Community connector."
        image="/images/stefanie/portrait-2.jpg"
        imageAlt="Stefanie Pollack"
      />
      <Bio />
      <CompassSection />
      <TestimonialsGrid />
      <CTASection />
    </div>
  );
}
