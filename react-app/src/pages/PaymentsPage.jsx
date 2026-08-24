import StaticPage from "../components/StaticPage";
import { CardIcon } from "../components/StaticPageIcons";

const METHODS = ["Visa", "Mastercard", "RuPay", "Cash on Delivery"];

function PaymentsPage() {
  return (
    <StaticPage
      title="Payment Methods"
      subtitle="How you can pay at checkout."
      Icon={CardIcon}
      gradient="from-ink to-brand-dark"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Accepted At Checkout</h2>
          <ul className="space-y-2">
            {METHODS.map((method) => (
              <li key={method} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {method}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <p>
        Cartloom&apos;s checkout is a demo flow — no real payment is ever charged — but it
        mirrors the options a live store would offer:
      </p>
      <ul>
        <li>Credit and debit cards (Visa, Mastercard, RuPay)</li>
        <li>Cash on Delivery</li>
      </ul>
      <h2>Is my card information safe?</h2>
      <p>
        Since this is a demo storefront, card details entered at checkout are never sent
        anywhere or stored — the form only exists to show what a real checkout looks like.
      </p>
    </StaticPage>
  );
}

export default PaymentsPage;
