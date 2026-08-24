import StaticPage from "../components/StaticPage";
import { TruckIcon } from "../components/StaticPageIcons";

function ShippingPage() {
  return (
    <StaticPage
      title="Shipping Information"
      subtitle="Delivery timelines and coverage."
      Icon={TruckIcon}
      gradient="from-deal to-deal-dark"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Delivery Estimate</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Metro cities</dt>
              <dd className="font-medium text-gray-800">2–4 business days</dd>
            </div>
            <div>
              <dt className="text-gray-500">Other locations</dt>
              <dd className="font-medium text-gray-800">4–7 business days</dd>
            </div>
            <div>
              <dt className="text-gray-500">Shipping cost</dt>
              <dd className="font-medium text-success">Free, always</dd>
            </div>
          </dl>
        </div>
      }
    >
      <h2>Delivery Times</h2>
      <ul>
        <li>Metro cities: 2–4 business days</li>
        <li>Other locations: 4–7 business days</li>
      </ul>
      <h2>Shipping Charges</h2>
      <p>
        Standard delivery is free on every order — there&apos;s no minimum cart value
        required, and it applies automatically at checkout.
      </p>
      <h2>Order Tracking</h2>
      <p>
        Once an order ships, you&apos;ll be able to follow its status from your account.
        Order tracking is one of the features we&apos;re actively building out.
      </p>
    </StaticPage>
  );
}

export default ShippingPage;
