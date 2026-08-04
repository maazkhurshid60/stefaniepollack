import Hero from "./components/Hero";
import BuyerSellerCTA from "./components/BuyerSellerCTA";
import About from "./components/About";
import Articles from "./components/Articles";
import Stats from "./components/Stats";
import FeaturedProperties from "./components/FeaturedProperties";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import Newsletter from "./components/Newsletter";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <BuyerSellerCTA />
      <About />
      <Articles />
      <Stats />
      <FeaturedProperties />
      <Testimonials />
      <CTASection />
      <Newsletter />
    </div>
  );
}