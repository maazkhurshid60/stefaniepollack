import PageHero from "@/components/feature/PageHero";
import Intro from "./components/Intro";
import NeighborhoodGrid from "./components/NeighborhoodGrid";
import CTASection from "../home/components/CTASection";

export default function Neighborhoods() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Neighborhoods"
        title="The Valley,"
        italicTitle="Block by Block"
        subtitle="Local knowledge for every corner of Studio City and the surrounding communities."
        image="/images/stefanie/lifestyle-2.jpg"
        imageAlt="Studio City neighborhood"
      />
      <Intro />
      <NeighborhoodGrid />
      <CTASection />
    </div>
  );
}
