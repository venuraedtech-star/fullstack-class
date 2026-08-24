import { Link } from "react-router-dom";
import StaticPage from "../components/StaticPage";
import { ReturnBoxIcon } from "../components/StaticPageIcons";

function ReturnsPage() {
  return (
    <StaticPage
      title="Returns"
      subtitle="How to send an item back."
      Icon={ReturnBoxIcon}
      gradient="from-success to-[#12633b]"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Return Window</h2>
          <p className="text-3xl font-semibold text-success">7 days</p>
          <p className="mt-1 text-sm text-gray-500">from the date of delivery</p>
          <Link
            to="/return-policy"
            className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
          >
            See full eligibility rules →
          </Link>
        </div>
      }
    >
      <h2>Starting a return</h2>
      <ul>
        <li>Go to your order history and select the item you&apos;d like to return</li>
        <li>Choose a reason and confirm the pickup address</li>
        <li>Pack the item in its original packaging, if possible</li>
        <li>Hand it to the courier when they arrive — no need to print anything</li>
      </ul>
      <h2>Refund timing</h2>
      <p>
        Once the returned item passes a quality check, refunds are issued to the original
        payment method within 5–7 business days. Cash on Delivery orders are refunded to
        a bank account you provide during the return.
      </p>
    </StaticPage>
  );
}

export default ReturnsPage;
