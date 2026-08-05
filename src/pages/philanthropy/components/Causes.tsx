import { motion } from "framer-motion";

const causes = [
  {
    name: "Kid-a-plooza",
    org: "Lutheran Church of Studio City",
    blurb:
      "An annual clothing and community drive supporting local families, hosted at the Lutheran Church of Studio City.",
    youtubeId: "eiDWCSBjkLs",
  },
  {
    name: "American Cancer Society",
    org: "Greater Valley",
    blurb:
      "Volunteering with the American Cancer Society's Greater Valley chapter on community fundraising and outreach.",
    youtubeId: "at3Uzu5AmNA",
  },
  {
    name: "NOHO Alliance",
    org: "North Hollywood Alliance",
    blurb:
      "Supporting the North Hollywood Alliance's work strengthening the community just east of Studio City.",
    youtubeId: "25MSbYGSaDc",
  },
];

export default function Causes() {
  return (
    <section className="w-full bg-accent-100 py-20 md:py-28">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
              Causes I Support
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground-950">
              Local <span className="italic font-normal">Community Partners</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {causes.map((cause, i) => (
              <motion.div
                key={cause.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="bg-background-50 rounded-2xl overflow-hidden border border-background-200/60"
              >
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${cause.youtubeId}`}
                    title={cause.name}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl text-foreground-950">{cause.name}</h3>
                  <p className="text-xs font-medium tracking-wide uppercase text-primary-600 mt-1">
                    {cause.org}
                  </p>
                  <p className="mt-3 text-sm text-foreground-600 leading-relaxed">
                    {cause.blurb}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
