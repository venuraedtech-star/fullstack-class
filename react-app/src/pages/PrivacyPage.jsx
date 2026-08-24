import StaticPage from "../components/StaticPage";
import { ShieldIcon } from "../components/StaticPageIcons";

const COLLECTED = ["Name and email", "Password (hashed, never plain text)", "Shipping address", "Cart contents"];

function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      subtitle="What we collect and why."
      Icon={ShieldIcon}
      gradient="from-brand to-ink"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">What We Collect</h2>
          <ul className="space-y-2">
            {COLLECTED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <h2>Information We Collect</h2>
      <ul>
        <li>Account details you provide: name, email, and password</li>
        <li>Order details: shipping address and items purchased (stored locally in this demo)</li>
      </ul>
      <h2>How We Use It</h2>
      <p>
        Account information is used to sign you in and personalize your dashboard.
        Passwords are never stored in plain text — they&apos;re hashed before saving. We
        don&apos;t sell or share your data with third parties.
      </p>
      <h2>Cookies &amp; Local Storage</h2>
      <p>
        Cartloom keeps your session (login state, cart, and theme preference) in your
        browser&apos;s local storage so it persists between visits. Clearing your browser
        data will sign you out and empty your cart.
      </p>
      <p className="text-gray-500">
        This policy is a demo document written for a teaching project and isn&apos;t a
        legally binding agreement.
      </p>
    </StaticPage>
  );
}

export default PrivacyPage;
