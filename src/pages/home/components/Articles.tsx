import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { articles } from "@/mocks/home";

function ArticleCard({
  article,
  index,
}: {
  article: (typeof articles)[0];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="snap-start flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-22px)] group cursor-pointer"
    >
      <a href={article.href} className="block">
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden rounded-lg mb-5">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Category + Date */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600">
            {article.category}
          </span>
          <span className="text-[11px] text-foreground-400">&bull;</span>
          <span className="text-[11px] text-foreground-500">
            {article.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl md:text-[22px] text-foreground-950 leading-snug mb-3 group-hover:text-primary-700 transition-colors duration-300">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-foreground-600 leading-relaxed line-clamp-3 mb-5">
          {article.excerpt}
        </p>

        {/* Read Time */}
        <div className="border-t border-background-200 pt-3 flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-foreground-400" strokeWidth={1.5} />
          </span>
          <span className="text-xs text-foreground-500">{article.readTime}</span>
        </div>
      </a>
    </motion.article>
  );
}

export default function Articles() {
  return (
    <section className="w-full bg-background-100 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 md:mb-20"
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
              Featured
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950">
              Latest <span className="italic font-normal">Articles</span>
            </h2>
          </motion.div>

          {/* Horizontal Scroll Articles */}
          <div className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}