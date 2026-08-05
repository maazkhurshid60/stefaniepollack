import { LineChart, Sparkles, Camera, Megaphone, Handshake, ClipboardCheck } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import ServicesGrid from "@/components/feature/ServicesGrid";
import Intro from "./components/Intro";
import Testimonials from "../home/components/Testimonials";
import CTASection from "../home/components/CTASection";

const services = [
  {
    icon: LineChart,
    title: "Pricing Strategy",
    description:
      "A comparative market analysis grounded in real Studio City comps, not guesswork — priced to attract strong offers fast.",
  },
  {
    icon: Sparkles,
    title: "Staging Guidance",
    description:
      "Hands-on direction to help your home show its best, from decluttering to swoon-worthy styling.",
  },
  {
    icon: Camera,
    title: "Professional Photography",
    description:
      "Hi-res photography and video that make your listing stand out the moment it hits the market.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Targeted online advertising and the reach of the Compass network to put your home in front of serious buyers.",
  },
  {
    icon: Handshake,
    title: "Stellar Negotiation",
    description:
      "Every offer vetted carefully and negotiated hard, so you land the best possible terms, not just the highest number.",
  },
  {
    icon: ClipboardCheck,
    title: "Escrow Coordination",
    description:
      "Full coordination from accepted offer through close, so nothing slips through the cracks.",
  },
];

export default function Sellers() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Sellers"
        title="Sell With"
        italicTitle="Confidence"
        subtitle="On-point pricing, swoon-worthy staging, savvy marketing, and stellar negotiation."
        image="/images/stefanie/lifestyle-5.jpg"
        imageAlt="Studio City listing"
      />
      <Intro />
      <ServicesGrid
        eyebrow="How I Help"
        title="Seller"
        italicTitle="Services"
        services={services}
        image="/images/stefanie/headshot.jpg"
        imageAlt="Stefanie Pollack, Studio City listing agent"
      />
      <Testimonials />
      <CTASection />
    </div>
  );
}
