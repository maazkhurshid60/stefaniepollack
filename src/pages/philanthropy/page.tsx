import PageHero from "@/components/feature/PageHero";
import Intro from "./components/Intro";
import Causes from "./components/Causes";
import Gallery from "./components/Gallery";
import CTASection from "../home/components/CTASection";

export default function Philanthropy() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Philanthropy"
        title="Rooted in"
        italicTitle="Community"
        subtitle="Giving back to the neighborhoods that make Studio City home."
        image="/images/philanthropy/food-drive-1.jpg"
        imageAlt="Stefanie Pollack community event"
      />
      <Intro />
      <Causes />
      <Gallery />
      <CTASection />
    </div>
  );
}
