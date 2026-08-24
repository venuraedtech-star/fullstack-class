import StaticPage from "../components/StaticPage";
import { ScrollIcon } from "../components/StaticPageIcons";

function TermsPage() {
  return (
    <StaticPage
      title="Terms of Use"
      subtitle="The basics of using Cartloom."
      Icon={ScrollIcon}
      gradient="from-ink to-[#1c3436]"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Quick Summary</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              Shop for personal, lawful use
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              Keep your account credentials private
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              This is a teaching demo — no real transactions
            </li>
          </ul>
        </div>
      }
    >
      <h2>Using the Site</h2>
      <p>
        By browsing or placing an order on Cartloom, you agree to use the site for
        personal, lawful shopping purposes only. Prices, availability, and product details
        are shown in good faith but may change without notice.
      </p>
      <h2>Accounts</h2>
      <p>
        You&apos;re responsible for keeping your login credentials confidential and for
        any activity that happens under your account.
      </p>
      <h2>Demo Disclaimer</h2>
      <p>
        Cartloom is a teaching project built to demonstrate a full-stack e-commerce
        application. Orders, payments, and shipping shown here are simulated — no real
        transactions occur.
      </p>
    </StaticPage>
  );
}

export default TermsPage;
