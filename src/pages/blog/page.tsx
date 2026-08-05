import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import { articles } from "@/mocks/home";

export default function Blog() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Journal"
        title="Studio City"
        italicTitle="Real Estate Notes"
        subtitle="Market updates, local guides, and community stories from Stefanie."
        image="/images/stefanie/lifestyle-2.jpg"
        imageAlt="Studio City"
      />

      <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                className="group"
              >
                <a href={article.href} className="block">
                  <div className="aspect-[16/10] overflow-hidden rounded-lg mb-5">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-foreground-400">&bull;</span>
                    <span className="text-[11px] text-foreground-500">{article.date}</span>
                  </div>
                  <h3 className="font-heading text-xl text-foreground-950 leading-snug mb-3 group-hover:text-primary-700 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-sm text-foreground-600 leading-relaxed line-clamp-3 mb-5">
                    {article.excerpt}
                  </p>
                  <div className="border-t border-background-200 pt-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-foreground-400" strokeWidth={1.5} />
                    <span className="text-xs text-foreground-500">{article.readTime}</span>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
