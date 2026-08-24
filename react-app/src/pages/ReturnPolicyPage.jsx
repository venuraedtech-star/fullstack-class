import StaticPage from "../components/StaticPage";
import { DocumentCheckIcon } from "../components/StaticPageIcons";

const NON_RETURNABLE = ["Made-to-order or personalized products", "Opened beauty or grocery items", "Gift cards"];

function ReturnPolicyPage() {
  return (
    <StaticPage
      title="Return Policy"
      subtitle="Eligibility rules for returning an item."
      Icon={DocumentCheckIcon}
      gradient="from-brand-dark to-ink"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Not Returnable</h2>
          <ul className="space-y-2">
            {NON_RETURNABLE.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-deal" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <h2>Return Window</h2>
      <p>
        Most items can be returned within 7 days of delivery. Perishable goods (groceries)
        and personal-care items (beauty, fragrances) are final sale once opened, for
        hygiene reasons.
      </p>
      <h2>Condition Requirements</h2>
      <ul>
        <li>Item is unused and in its original condition</li>
        <li>Original tags and packaging are intact, where applicable</li>
        <li>Any included accessories or freebies are returned along with it</li>
      </ul>
      <p className="text-gray-500">
        This policy is a demo document written for a teaching project and isn&apos;t a
        legally binding agreement.
      </p>
    </StaticPage>
  );
}

export default ReturnPolicyPage;
