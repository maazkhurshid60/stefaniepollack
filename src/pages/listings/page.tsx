import PropertyGrid from "./components/PropertyGrid";
import Newsletter from "../home/components/Newsletter";

export default function Listings() {
  return (
    <div className="w-full pt-20 md:pt-24">
      <PropertyGrid />
      <Newsletter />
    </div>
  );
}
