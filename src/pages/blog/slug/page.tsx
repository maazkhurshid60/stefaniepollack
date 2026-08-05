import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowLeft } from "lucide-react";
import { articles } from "@/mocks/home";
import NotFound from "../../NotFound";

export default function BlogArticle() {
  const { slug } = useParams();
  const article = articles.find((a) => a.href === `/blog/${slug}`);

  if (!article) return <NotFound />;

  return (
    <div className="w-full">
      <section className="relative w-full h-[45vh] min-h-[360px] max-h-[520px] overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary-200">
                {article.category}
              </span>
              <span className="text-white/40">&bull;</span>
              <span className="text-[11px] text-white/70">{article.date}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white font-medium leading-tight max-w-3xl mx-auto">
              {article.title}
            </h1>
            <div className="mt-5 flex items-center justify-center gap-1.5 text-white/70">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-xs">{article.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="w-full bg-background-50 py-16 md:py-24">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <a
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-600 hover:text-primary-700 transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Back to Journal
            </a>

            <p className="text-lg text-foreground-700 leading-relaxed">{article.excerpt}</p>

            <div className="mt-10 p-6 rounded-xl bg-accent-100 border border-background-200/60">
              <p className="text-sm text-foreground-600 leading-relaxed">
                The full article is on its way — check back soon, or reach out
                directly if you have questions in the meantime.
              </p>
              <a
                href="/contact"
                className="inline-flex mt-4 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
              >
                Get in touch &rarr;
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
