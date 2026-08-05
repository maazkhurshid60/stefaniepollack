import PageHero from "@/components/feature/PageHero";
import PropertyGrid from "./components/PropertyGrid";
import Newsletter from "../home/components/Newsletter";

export default function Listings() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Listings"
        title="Available &"
        italicTitle="Sold Properties"
        subtitle="Exceptional homes across Studio City and the San Fernando Valley."
        image="/images/stefanie/lifestyle-7.jpg"
        imageAlt="Studio City property"
      />
      <PropertyGrid />
      <Newsletter />
    </div>
  );
}
