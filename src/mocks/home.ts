/** Companion interior/backyard shots for a listing's detail-page gallery.
 *
 * The readdy.ai search-image endpoint used for each listing's single card
 * photo only serves the exact images baked into the original template at
 * generation time — it 400s ("hash not found") on any new query text, even
 * reusing the same working dimensions. It's not a live text-to-image API, so
 * it can't produce new interior shots. These use Unsplash's CDN instead
 * (verified working, same approach already used for the blog article images
 * further down this file) — generic, freely-licensed interiors, cycled by
 * index so each listing gets a distinct-ish combination. */
const INTERIOR_POOLS = {
  kitchen: ["1556911220-e15b29be8c8f", "1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c"],
  living: ["1600210492486-724fe5c67fb0", "1616486338812-3dadae4b4ace", "1600121848594-d8644e57abab"],
  bedroom: ["1616594039964-ae9021a400a0", "1560448204-e02f11c3d0e2", "1522771739844-6a9f6d5f14af"],
  outdoor: ["1600566753190-17f0baa2a6c3", "1600585154526-990dced4db0d", "1600047509807-ba8f99d2cdde"],
};

function galleryShots(index: number): string[] {
  const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`;
  return [
    unsplash(INTERIOR_POOLS.kitchen[index % INTERIOR_POOLS.kitchen.length]),
    unsplash(INTERIOR_POOLS.living[index % INTERIOR_POOLS.living.length]),
    unsplash(INTERIOR_POOLS.bedroom[index % INTERIOR_POOLS.bedroom.length]),
    unsplash(INTERIOR_POOLS.outdoor[index % INTERIOR_POOLS.outdoor.length]),
  ];
}

export const featuredProperties = [
  {
    id: 1,
    slug: "10956-wrightwood-lane",
    address: "10956 Wrightwood Lane",
    city: "Studio City, CA",
    price: "$3,495,000",
    beds: 5,
    baths: 5,
    sqft: "4,250",
    image: "https://readdy.ai/api/search-image?query=Luxury%20modern%20farmhouse%20exterior%20with%20manicured%20lawn%20and%20mature%20trees%2C%20warm%20golden%20hour%20lighting%2C%20clean%20architectural%20photography%20style%2C%20high-end%20real%20estate%20presentation&width=600&height=800&seq=fp-01&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Luxury%20modern%20farmhouse%20exterior%20with%20manicured%20lawn%20and%20mature%20trees%2C%20warm%20golden%20hour%20lighting%2C%20clean%20architectural%20photography%20style%2C%20high-end%20real%20estate%20presentation&width=600&height=800&seq=fp-01&orientation=portrait",
      ...galleryShots(0),
    ],
    status: "available",
  },
  {
    id: 2,
    slug: "4233-laurel-canyon-blvd",
    address: "4233 Laurel Canyon Blvd",
    city: "Studio City, CA",
    price: "$2,875,000",
    beds: 4,
    baths: 4,
    sqft: "3,680",
    image: "https://readdy.ai/api/search-image?query=Elegant%20Mediterranean%20villa%20with%20wrought%20iron%20details%20and%20lush%20landscaping%2C%20premium%20real%20estate%20photography%2C%20warm%20afternoon%20sunlight%2C%20clean%20minimal%20background&width=600&height=800&seq=fp-02&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Elegant%20Mediterranean%20villa%20with%20wrought%20iron%20details%20and%20lush%20landscaping%2C%20premium%20real%20estate%20photography%2C%20warm%20afternoon%20sunlight%2C%20clean%20minimal%20background&width=600&height=800&seq=fp-02&orientation=portrait",
      ...galleryShots(1),
    ],
    status: "available",
  },
  {
    id: 3,
    slug: "12631-mulholland-drive",
    address: "12631 Mulholland Drive",
    city: "Beverly Hills, CA",
    price: "$5,200,000",
    beds: 6,
    baths: 7,
    sqft: "6,100",
    image: "https://readdy.ai/api/search-image?query=Contemporary%20Beverly%20Hills%20mansion%20with%20sleek%20modern%20design%20and%20infinity%20pool%2C%20bright%20daylight%2C%20architectural%20photography%2C%20luxury%20home%20presentation&width=600&height=800&seq=fp-03&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Contemporary%20Beverly%20Hills%20mansion%20with%20sleek%20modern%20design%20and%20infinity%20pool%2C%20bright%20daylight%2C%20architectural%20photography%2C%20luxury%20home%20presentation&width=600&height=800&seq=fp-03&orientation=portrait",
      ...galleryShots(2),
    ],
    status: "available",
  },
  {
    id: 4,
    slug: "8901-sunshine-terrace",
    address: "8901 Sunshine Terrace",
    city: "Studio City, CA",
    price: "$1,950,000",
    beds: 3,
    baths: 3,
    sqft: "2,400",
    image: "https://readdy.ai/api/search-image?query=Charming%20California%20bungalow%20with%20mature%20trees%20and%20warm%20natural%20light%2C%20inviting%20front%20porch%2C%20real%20estate%20photography%20style%2C%20soft%20neutral%20color%20palette&width=600&height=800&seq=fp-04&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Charming%20California%20bungalow%20with%20mature%20trees%20and%20warm%20natural%20light%2C%20inviting%20front%20porch%2C%20real%20estate%20photography%20style%2C%20soft%20neutral%20color%20palette&width=600&height=800&seq=fp-04&orientation=portrait",
      ...galleryShots(3),
    ],
    status: "available",
  },
  {
    id: 5,
    slug: "4821-woodrow-wilson-drive",
    address: "4821 Woodrow Wilson Drive",
    city: "Los Feliz, CA",
    price: "$4,850,000",
    beds: 5,
    baths: 5,
    sqft: "4,800",
    image: "https://readdy.ai/api/search-image?query=Modern%20architectural%20masterpiece%20with%20floor-to-ceiling%20windows%20and%20hillside%20view%2C%20sunset%20lighting%2C%20luxury%20home%20photography%2C%20clean%20minimal%20composition&width=600&height=800&seq=fp-05&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Modern%20architectural%20masterpiece%20with%20floor-to-ceiling%20windows%20and%20hillside%20view%2C%20sunset%20lighting%2C%20luxury%20home%20photography%2C%20clean%20minimal%20composition&width=600&height=800&seq=fp-05&orientation=portrait",
      ...galleryShots(4),
    ],
    status: "available",
  },
  {
    id: 6,
    slug: "2210-outpost-drive",
    address: "2210 Outpost Drive",
    city: "Hollywood Hills, CA",
    price: "$3,750,000",
    beds: 4,
    baths: 4,
    sqft: "3,600",
    image: "https://readdy.ai/api/search-image?query=Stunning%20contemporary%20home%20with%20glass%20walls%20and%20lush%20green%20landscaping%2C%20premium%20real%20estate%20photography%2C%20bright%20natural%20daylight%2C%20warm%20neutral%20tones&width=600&height=800&seq=fp-06&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Stunning%20contemporary%20home%20with%20glass%20walls%20and%20lush%20green%20landscaping%2C%20premium%20real%20estate%20photography%2C%20bright%20natural%20daylight%2C%20warm%20neutral%20tones&width=600&height=800&seq=fp-06&orientation=portrait",
      ...galleryShots(5),
    ],
    status: "available",
  },
];

export const soldListings = [
  {
    id: 1,
    slug: "11548-moorpark-street",
    address: "11548 Moorpark Street",
    city: "Studio City, CA",
    soldPrice: "$2,425,000",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    image: "https://readdy.ai/api/search-image?query=Classic%20Tudor-style%20home%20with%20stone%20facade%20and%20manicured%20garden%2C%20soft%20overcast%20lighting%2C%20professional%20real%20estate%20photography%2C%20warm%20earth%20tone%20palette&width=600&height=800&seq=sl-01&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Classic%20Tudor-style%20home%20with%20stone%20facade%20and%20manicured%20garden%2C%20soft%20overcast%20lighting%2C%20professional%20real%20estate%20photography%2C%20warm%20earth%20tone%20palette&width=600&height=800&seq=sl-01&orientation=portrait",
      ...galleryShots(0),
    ],
    dateSold: "Dec 2025",
  },
  {
    id: 2,
    slug: "3915-oakdale-avenue",
    address: "3915 Oakdale Avenue",
    city: "Studio City, CA",
    soldPrice: "$1,875,000",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    image: "https://readdy.ai/api/search-image?query=Mid-century%20modern%20home%20with%20clean%20lines%20and%20large%20windows%2C%20desert%20landscaping%2C%20golden%20hour%20photography%2C%20premium%20real%20estate%20presentation&width=600&height=800&seq=sl-02&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Mid-century%20modern%20home%20with%20clean%20lines%20and%20large%20windows%2C%20desert%20landscaping%2C%20golden%20hour%20photography%2C%20premium%20real%20estate%20presentation&width=600&height=800&seq=sl-02&orientation=portrait",
      ...galleryShots(1),
    ],
    dateSold: "Nov 2025",
  },
  {
    id: 3,
    slug: "12417-valleyheart-drive",
    address: "12417 Valleyheart Drive",
    city: "Studio City, CA",
    soldPrice: "$3,100,000",
    beds: 5,
    baths: 4,
    sqft: "3,800",
    image: "https://readdy.ai/api/search-image?query=Grand%20colonial%20estate%20with%20white%20columns%20and%20circular%20driveway%2C%20mature%20oak%20trees%2C%20bright%20daylight%2C%20architectural%20photography%20style&width=600&height=800&seq=sl-03&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Grand%20colonial%20estate%20with%20white%20columns%20and%20circular%20driveway%2C%20mature%20oak%20trees%2C%20bright%20daylight%2C%20architectural%20photography%20style&width=600&height=800&seq=sl-03&orientation=portrait",
      ...galleryShots(2),
    ],
    dateSold: "Oct 2025",
  },
  {
    id: 4,
    slug: "4521-carpenter-avenue",
    address: "4521 Carpenter Avenue",
    city: "Studio City, CA",
    soldPrice: "$2,750,000",
    beds: 4,
    baths: 4,
    sqft: "3,450",
    image: "https://readdy.ai/api/search-image?query=Rustic%20modern%20mountain%20home%20with%20wood%20and%20stone%20exterior%2C%20forest%20backdrop%2C%20warm%20ambient%20lighting%2C%20real%20estate%20photography%20style&width=600&height=800&seq=sl-04&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Rustic%20modern%20mountain%20home%20with%20wood%20and%20stone%20exterior%2C%20forest%20backdrop%2C%20warm%20ambient%20lighting%2C%20real%20estate%20photography%20style&width=600&height=800&seq=sl-04&orientation=portrait",
      ...galleryShots(3),
    ],
    dateSold: "Sep 2025",
  },
  {
    id: 5,
    slug: "10870-bloomfield-street",
    address: "10870 Bloomfield Street",
    city: "Studio City, CA",
    soldPrice: "$1,650,000",
    beds: 3,
    baths: 2,
    sqft: "1,950",
    image: "https://readdy.ai/api/search-image?query=Elegant%20Georgian-style%20home%20with%20red%20brick%20and%20white%20trim%2C%20formal%20garden%2C%20soft%20natural%20light%2C%20premium%20real%20estate%20photography&width=600&height=800&seq=sl-05&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Elegant%20Georgian-style%20home%20with%20red%20brick%20and%20white%20trim%2C%20formal%20garden%2C%20soft%20natural%20light%2C%20premium%20real%20estate%20photography&width=600&height=800&seq=sl-05&orientation=portrait",
      ...galleryShots(4),
    ],
    dateSold: "Aug 2025",
  },
  {
    id: 6,
    slug: "3890-lankershim-blvd",
    address: "3890 Lankershim Blvd",
    city: "Studio City, CA",
    soldPrice: "$2,200,000",
    beds: 4,
    baths: 3,
    sqft: "2,850",
    image: "https://readdy.ai/api/search-image?query=Coastal%20contemporary%20home%20with%20weathered%20wood%20siding%20and%20ocean%20view%20terrace%2C%20bright%20sunny%20day%2C%20luxury%20real%20estate%20photography%20style&width=600&height=800&seq=sl-06&orientation=portrait",
    gallery: [
      "https://readdy.ai/api/search-image?query=Coastal%20contemporary%20home%20with%20weathered%20wood%20siding%20and%20ocean%20view%20terrace%2C%20bright%20sunny%20day%2C%20luxury%20real%20estate%20photography%20style&width=600&height=800&seq=sl-06&orientation=portrait",
      ...galleryShots(5),
    ],
    dateSold: "Jul 2025",
  },
];

export const testimonials = [
  {
    id: 1,
    quote:
      "STOP looking for another agent — you simply cannot find one better than Stefanie. We had the pleasure of working with Stefanie as our Studio City realtor when searching for a new home for my in-laws. From the moment we found her online, we were impressed with her professionalism and expertise.",
    author: "Brian S.",
    location: "Los Angeles, CA",
  },
  {
    id: 2,
    quote:
      "We could not be happier that we chose Stefanie Pollack as our realtor in Studio City. We have known Stefanie for several years. When it came time to list our home, Stefanie was the clear choice because she knows our neighborhood and local market better than anyone else.",
    author: "Andrew S.",
    location: "Studio City, CA",
  },
  {
    id: 3,
    quote:
      "Stefanie's total management and coordination of staging as well as internet and print advertising was outstanding. Our open houses were extremely well-attended. We had an offer in one day that was significantly over asking and we were in escrow in less than 48 hours.",
    author: "Grace V.",
    location: "Seller, Studio City",
  },
  {
    id: 4,
    quote:
      "I am very grateful to Stefanie, and her support team, for her hard work and dedication to getting my dad the outcome that he envisioned for himself. Stefanie came up with a successful strategic plan that generated at least 10 strong offers.",
    author: "Melissa Schwarm",
    location: "Seller, Studio City",
  },
];

// Fuller set for the About page grid, sourced from the client's Yelp/Google
// review exports (Testimonials 2024.docx). Location is "Google Review" where
// the source review didn't include a city.
export const allTestimonials = [
  ...testimonials,
  {
    id: 5,
    quote:
      "STOP looking for another agent - you simply cannot find one better than Stefanie. From the moment we found her online, we were impressed with her professionalism and expertise in Studio City real estate. If you text her, she responds promptly. Call her, she responds promptly. Have a concern? She figures out how to address it.",
    author: "Brian S.",
    location: "Yelp Review",
  },
  {
    id: 6,
    quote:
      "Trust — she told me how it was and was a straight shooter from the very beginning. Commitment — she was committed to making sure she does everything in her power to get it done. Knowledge — not only was she selling my home but selling the whole city. She knew so much about the area that made all the difference.",
    author: "Raffi Alan M.",
    location: "Yelp Review",
  },
  {
    id: 7,
    quote:
      "Stefanie is an amazing realtor! She took the time to explain what it would take to sell our house for the price we wanted, then had us stage it so it looked like a model home. She did open houses every weekend until we found our buyer and was an excellent negotiator the whole way through.",
    author: "Leanne S.",
    location: "Sherman Oaks, CA",
  },
  {
    id: 8,
    quote:
      "If you are looking for the best Realtor in Studio City, look no further! Stefanie makes the home buying process easy and fun. She is always furthering her education in realty and stays up to date on all the market trends. She was attentive to our requests and didn't pressure us with her opinions.",
    author: "Valerie B.",
    location: "Valley Glen, CA",
  },
  {
    id: 9,
    quote:
      "Stefanie expertly guided us through a market that was changing by the minute. I know she has a lot of other projects, but she made us feel like her only clients — constantly doing open houses, appointments, and follow-ups with agents and potential buyers, and coming up with creative ideas to change things up.",
    author: "Stephanie K.",
    location: "Los Angeles, CA",
  },
  {
    id: 10,
    quote:
      "From start to finish she was knowledgeable, very organized, and completely on top of everything. Being first time home buyers, we asked a ton of questions — Stefanie answered every single one with intelligence, professionalism, and patience. She helped us find our dream home.",
    author: "Denise K.",
    location: "North Hollywood, CA",
  },
  {
    id: 11,
    quote:
      "Stefanie is UH...MAZING. She walked my husband and I through the entire selling process and set realistic expectations, which I really appreciated. She helped us present our house in the most attractive way possible and when offers came in, she was amazing at negotiating.",
    author: "Brittany Sarkisian",
    location: "Google Review",
  },
  {
    id: 12,
    quote:
      "Stefanie helped us find our dream home in Valley Village after patiently helping us navigate through neighborhoods, school districts, and all the other considerations. She was incredibly responsive and always there for our needs, including finding the best ways to present our offers.",
    author: "Eric Held",
    location: "Valley Village, CA",
  },
  {
    id: 13,
    quote:
      "During the most difficult of times, with a raging pandemic and an almost impossible financing climate, Stefanie was an absolute champion for us. Patient, experienced, professional, direct, knowledgeable, resourceful, accessible, well connected — she had the right answer for us at every step of the way.",
    author: "Jon D.",
    location: "Encino, CA",
  },
];

export const neighborhoods = [
  {
    id: 1,
    name: "Studio City",
    description: "The heart of the San Fernando Valley",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=400&fit=crop",
    listings: 24,
  },
  {
    id: 2,
    name: "Sherman Oaks",
    description: "Upscale living with village charm",
    image: "https://images.unsplash.com/photo-1513584685915-8d50d7547c3e?w=600&h=400&fit=crop",
    listings: 18,
  },
  {
    id: 3,
    name: "Beverly Hills",
    description: "Iconic luxury and timeless elegance",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&h=400&fit=crop",
    listings: 12,
  },
  {
    id: 4,
    name: "Encino",
    description: "Suburban tranquility meets sophistication",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop",
    listings: 15,
  },
];

export const stats = [
  { id: 1, value: "20+", label: "Years of Experience" },
  { id: 2, value: "$500M+", label: "In Sales" },
  { id: 3, value: "800+", label: "Families Helped" },
  { id: 4, value: "98%", label: "Client Satisfaction" },
];

export const articles = [
  {
    id: 1,
    title: "4 Practical Steps to Make 2026 Your Vision Year in Studio City Real Estate",
    excerpt: "Start the new year with clarity and purpose. These four actionable strategies will help buyers and sellers position themselves for success in Studio City's competitive market.",
    image: "https://images.squarespace-cdn.com/content/v1/62857f9467398e0fd622fe08/1771386671536-4XRBGSA2BQDQSFJPZ3JY/4+Practical+Steps+to+Make+2026+Your+Vision+Year+in+Studio+City+Real+Estate.jpg?format=750w",
    href: "/blog/4-practical-steps-to-make-2026-your-vision-year-in-studio-city-real-estate",
    category: "Market Updates",
    date: "Jan 15, 2026",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Is January a Good Time to Buy or Sell a Home in Studio City?",
    excerpt: "January often brings fresh inventory and motivated buyers. Here is what the market data says about timing your move at the start of the year in Studio City.",
    image: "https://images.squarespace-cdn.com/content/v1/62857f9467398e0fd622fe08/1767907743269-W2A42ZBE1E8RA793FNN6/013_02.07.22_Stefanie-Pollack_Nicole-Goddard-Photography_423A5339.jpg+%281%29.jpg?format=750w",
    href: "/blog/is-january-a-good-time-to-buy-or-sell-a-home-in-studio-city",
    category: "Market Updates",
    date: "Jan 8, 2026",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "The Moms Effect: Impact Garage – A Community Day of Giving in Studio City",
    excerpt: "A mom-led community event in Studio City, Impact Garage brings families together to assemble care kits and support women and children through LA Family Housing.",
    image: "https://images.squarespace-cdn.com/content/v1/62857f9467398e0fd622fe08/1765398996010-XX9TKOIO0F5EUGPYCZHF/Untitled+design+%285%29.jpg?format=750w",
    href: "/blog/the-moms-effect-impact-garage-a-community-day-of-giving-in-studio-city",
    category: "Community",
    date: "Dec 10, 2025",
    readTime: "4 min read",
  },
  {
    id: 4,
    title: "Best Holiday Activities in Studio City: Your Ultimate Local Guide",
    excerpt: "Discover the best holiday activities in Studio City, from festive light displays and seasonal events to family-friendly outings, shopping, dining, and winter experiences in the heart of the San Fernando Valley.",
    image: "https://images.squarespace-cdn.com/content/v1/62857f9467398e0fd622fe08/1763836039986-WE544CGHNF66S5Z03QD1/Untitled+%282500+x+1500+px%29+%281%29.jpg?format=750w",
    href: "/blog/best-holiday-activities-in-studio-city-your-ultimate-local-guide",
    category: "Local Guide",
    date: "Nov 28, 2025",
    readTime: "6 min read",
  },
];