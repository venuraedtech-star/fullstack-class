import { useEffect, useState } from "react";

const BANNERS = [
  {
    title: "Big Billion Days",
    subtitle: "Up to 80% Off on Electronics",
    cta: "Shop Now",
    gradient: "from-brand to-brand-dark",
    image: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  },
  {
    title: "Fashion Fiesta",
    subtitle: "Trending styles from top brands",
    cta: "Explore",
    gradient: "from-[#7A3B69] to-[#4F2350]",
    image: "https://cdn.dummyjson.com/product-images/womens-dresses/calvin-klein-continuous-color-block/thumbnail.webp",
  },
  {
    title: "Mobile Bonanza",
    subtitle: "Latest smartphones at best prices",
    cta: "Buy Now",
    gradient: "from-accent to-deal",
    image: "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp",
  },
];

function HeroBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[active];

  return (
    <div className="relative overflow-hidden rounded-sm bg-white shadow-sm">
      <div
        className={`flex min-h-[280px] items-center justify-between bg-gradient-to-r ${banner.gradient} px-8 py-10 text-white md:px-16`}
      >
        <div className="max-w-md">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-white/80">Sale Live</p>
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">{banner.title}</h2>
          <p className="mb-6 text-lg text-white/90">{banner.subtitle}</p>
          <button
            type="button"
            className="rounded-sm bg-white px-8 py-2.5 text-sm font-semibold text-brand shadow transition hover:bg-accent hover:text-gray-900"
          >
            {banner.cta}
          </button>
        </div>
        <img
          src={banner.image}
          alt=""
          className="hidden h-48 w-48 object-contain drop-shadow-2xl md:block lg:h-56 lg:w-56"
        />
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all ${
              index === active ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
