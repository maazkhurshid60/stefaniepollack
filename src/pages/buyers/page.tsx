import { Search, LineChart, Handshake, Users, ClipboardCheck, KeyRound } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import ServicesGrid from "@/components/feature/ServicesGrid";
import Intro from "./components/Intro";
import Testimonials from "../home/components/Testimonials";
import CTASection from "../home/components/CTASection";

const services = [
  {
    icon: Search,
    title: "Personalized Home Search",
    description:
      "A search tailored to your budget, must-haves, and timeline — including off-market opportunities through the Compass network.",
  },
  {
    icon: LineChart,
    title: "Market & Neighborhood Guidance",
    description:
      "Deep, first-hand knowledge of Studio City and the surrounding Valley, so you know exactly what you're paying for.",
  },
  {
    icon: Handshake,
    title: "Skilled Negotiation",
    description:
      "A financial background and a decade-plus of negotiating experience working to get you the most home for your budget.",
  },
  {
    icon: Users,
    title: "Trusted Local Network",
    description:
      "Vetted lenders, inspectors, and contractors — the people you'll need on your side once an offer is accepted.",
  },
  {
    icon: ClipboardCheck,
    title: "Careful Due Diligence",
    description:
      "Thorough enough to help you avoid unpleasant surprises after you move in, from inspection through closing.",
  },
  {
    icon: KeyRound,
    title: "Start-to-Finish Support",
    description:
      "Guidance at every step, from pre-approval to keys in hand — and a resource for you long after closing day.",
  },
];

export default function Buyers() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Buyers"
        title="Find Your"
        italicTitle="Next Home"
        subtitle="A step-by-step guide from pre-approval to closing, with an expert negotiator on your side."
        image="/images/stefanie/lifestyle-1.jpg"
        imageAlt="Studio City home"
      />
      <Intro />
      <ServicesGrid
        eyebrow="How I Help"
        title="Buyer"
        italicTitle="Services"
        services={services}
        image="/images/stefanie/portrait-1.jpg"
        imageAlt="Stefanie Pollack, Studio City buyer's agent"
      />
      <Testimonials />
      <CTASection />
    </div>
  );
}
