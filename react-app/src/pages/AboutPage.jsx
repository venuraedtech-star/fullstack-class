import StaticPage from "../components/StaticPage";
import { StorefrontIcon } from "../components/StaticPageIcons";

const CATEGORIES = ["Mobiles", "Electronics", "Home", "Beauty", "Fashion", "Grocery"];

function AboutPage() {
  return (
    <StaticPage
      title="About Cartloom"
      subtitle="A marketplace woven around what you actually need."
      Icon={StorefrontIcon}
      gradient="from-brand to-brand-dark"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">What We Sell</h2>
          <ul className="space-y-2">
            {CATEGORIES.map((category) => (
              <li key={category} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {category}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <p>
        Cartloom started as a simple idea: shopping online shouldn&apos;t feel like wading
        through a warehouse. We wanted a storefront that surfaces the right products fast,
        keeps checkout painless, and treats sellers and shoppers as equally important
        customers.
      </p>
      <h2>What we do</h2>
      <p>
        We connect shoppers with a curated catalog spanning electronics, fashion, home,
        beauty, and grocery — built on the same product data our engineering students use
        to learn full-stack development, which is why you&apos;ll notice a few &quot;demo&quot;
        touches like simulated payments across the site.
      </p>
      <h2>Where we&apos;re headed</h2>
      <p>
        Cartloom is under active development. New categories, seller tools, and order
        tracking are on the roadmap — this page, like the rest of the site, will keep
        growing alongside it.
      </p>
    </StaticPage>
  );
}

export default AboutPage;
