import { motion } from "framer-motion";
import { Home, BookOpen, Map, Sparkles, MessageCircle, ArrowUpRight, type LucideIcon } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import CTASection from "../home/components/CTASection";

const resources: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}[] = [
  {
    icon: Home,
    title: "Free Home Value Estimate",
    description: "Get an instant, data-driven estimate of what your Studio City home is worth today.",
    href: "https://get.homebot.ai/?id=a4aeb5dc-a3b8-4fb8-8003-7d0485c61c9e",
    external: true,
  },
  {
    icon: BookOpen,
    title: "Buyer's Guide",
    description: "A step-by-step look at the home buying process, from pre-approval to closing.",
    href: "/buyers",
  },
  {
    icon: Sparkles,
    title: "Seller's Guide",
    description: "How pricing, staging, and marketing come together to sell your home for top dollar.",
    href: "/sellers",
  },
  {
    icon: Map,
    title: "Neighborhood Guides",
    description: "Local knowledge on Studio City, Sherman Oaks, Encino, and the surrounding areas.",
    href: "/neighborhoods",
  },
  {
    icon: Sparkles,
    title: "Compass Concierge",
    description: "Fronted, fee-free home improvement services to help sellers maximize their sale price.",
    href: "https://www.compass.com/concierge/",
    external: true,
  },
  {
    icon: MessageCircle,
    title: "Ask Stefanie Directly",
    description: "Have a question that's specific to your situation? Reach out — happy to help.",
    href: "/contact",
  },
];

export default function Resources() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Resources"
        title="Tools For Your"
        italicTitle="Next Move"
        subtitle="A starting point for buyers and sellers alike — reach out anytime for guidance specific to you."
        image="/images/stefanie/lifestyle-3.jpg"
        imageAlt="Studio City resources"
      />

      <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {resources.map((resource, i) => {
              const Icon = resource.icon;
              return (
                <motion.a
                  key={resource.title}
                  href={resource.href}
                  target={resource.external ? "_blank" : undefined}
                  rel={resource.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="group flex flex-col bg-background-50 rounded-2xl border border-background-200/60 p-8 hover:border-background-300/80 transition-all duration-300"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-100/70 text-primary-700 mb-6">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl text-foreground-950 flex items-center gap-2">
                    {resource.title}
                    {resource.external && (
                      <ArrowUpRight className="w-4 h-4 text-foreground-400 group-hover:text-primary-600 transition-colors" strokeWidth={1.5} />
                    )}
                  </h3>
                  <p className="mt-3 text-sm text-foreground-600 leading-relaxed">
                    {resource.description}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
