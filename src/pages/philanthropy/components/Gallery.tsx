import { motion } from "framer-motion";

type Tile =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

const foodDrive: Tile[] = [
  { type: "image", src: "/images/philanthropy/food-drive-1.jpg", alt: "Food Drive 2025 volunteers" },
  { type: "video", src: "/video/philanthropy/food-drive-1.mp4", poster: "/images/philanthropy/food-drive-clip-1-poster.jpg", alt: "Food Drive 2025 clip" },
  { type: "image", src: "/images/philanthropy/food-drive-2.jpg", alt: "Food Drive 2025" },
  { type: "image", src: "/images/philanthropy/food-drive-3.jpg", alt: "Food Drive 2025" },
  { type: "video", src: "/video/philanthropy/food-drive-2.mp4", poster: "/images/philanthropy/food-drive-clip-2-poster.jpg", alt: "Food Drive 2025 clip" },
  { type: "image", src: "/images/philanthropy/food-drive-4.jpg", alt: "Food Drive 2025" },
  { type: "video", src: "/video/philanthropy/food-drive-3.mp4", poster: "/images/philanthropy/food-drive-clip-3-poster.jpg", alt: "Food Drive 2025 clip" },
  { type: "image", src: "/images/philanthropy/food-drive-5.jpg", alt: "Food Drive 2025" },
  { type: "video", src: "/video/philanthropy/food-drive-4.mp4", poster: "/images/philanthropy/food-drive-clip-4-poster.jpg", alt: "Food Drive 2025 clip" },
  { type: "image", src: "/images/philanthropy/food-drive-6.jpg", alt: "Food Drive 2025" },
  { type: "video", src: "/video/philanthropy/food-drive-5.mp4", poster: "/images/philanthropy/food-drive-clip-5-poster.jpg", alt: "Food Drive 2025 clip" },
];

const impact: Tile[] = [
  { type: "video", src: "/video/philanthropy/impact-1.mp4", poster: "/images/philanthropy/impact-clip-1-poster.jpg", alt: "IMPACT 2025 clip" },
  { type: "video", src: "/video/philanthropy/impact-2.mp4", poster: "/images/philanthropy/impact-clip-2-poster.jpg", alt: "IMPACT 2025 clip" },
  { type: "video", src: "/video/philanthropy/impact-3.mp4", poster: "/images/philanthropy/impact-clip-3-poster.jpg", alt: "IMPACT 2025 clip" },
];

function MediaTile({ tile, index }: { tile: Tile; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="relative aspect-[3/4] overflow-hidden rounded-xl bg-foreground-900"
    >
      {tile.type === "image" ? (
        <img src={tile.src} alt={tile.alt} className="w-full h-full object-cover" />
      ) : (
        <video
          src={tile.src}
          poster={tile.poster}
          controls
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        >
          <track kind="captions" />
        </video>
      )}
    </motion.div>
  );
}

export default function Gallery() {
  return (
    <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Year in review spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-10 mb-20 md:mb-28"
          >
            <div className="w-full md:w-[300px] flex-shrink-0">
              <div className="relative aspect-[9/16] max-w-[300px] mx-auto overflow-hidden rounded-2xl bg-foreground-900">
                <video
                  src="/video/year-in-review.mp4"
                  poster="/images/philanthropy/year-in-review-poster.jpg"
                  controls
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover"
                >
                  <track kind="captions" />
                </video>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
                2025 Year in Review
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground-950">
                A Look Back at
                <br />
                <span className="italic font-normal">A Year of Giving</span>
              </h2>
              <p className="mt-5 text-foreground-600 leading-relaxed max-w-md">
                From food drives to community fundraisers, here&apos;s a look back
                at the moments that made 2025 a year of connection in Studio City.
              </p>
            </div>
          </motion.div>

          {/* Food Drive 2025 */}
          <div className="mb-14">
            <h3 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-8">
              Food Drive <span className="italic font-normal">2025</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {foodDrive.map((tile, i) => (
                <MediaTile key={tile.src} tile={tile} index={i} />
              ))}
            </div>
          </div>

          {/* IMPACT 2025 */}
          <div>
            <h3 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-8">
              IMPACT <span className="italic font-normal">2025</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {impact.map((tile, i) => (
                <MediaTile key={tile.src} tile={tile} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
