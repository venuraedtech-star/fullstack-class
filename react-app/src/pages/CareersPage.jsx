import StaticPage from "../components/StaticPage";
import { BriefcaseIcon } from "../components/StaticPageIcons";

const OPEN_ROLES = [
  { title: "Frontend Engineer", team: "Storefront", location: "Remote" },
  { title: "Backend Engineer", team: "Platform", location: "Bengaluru" },
  { title: "Product Designer", team: "Design", location: "Remote" },
  { title: "Customer Support Associate", team: "Operations", location: "Bengaluru" },
];

const CULTURE_POINTS = [
  "Small team, real ownership",
  "Remote-friendly by default",
  "We ship in small, honest increments",
];

function CareersPage() {
  return (
    <StaticPage
      title="Careers at Cartloom"
      subtitle="Help us build a faster, friendlier place to shop."
      Icon={BriefcaseIcon}
      gradient="from-accent to-deal"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Why Work Here</h2>
          <ul className="space-y-2">
            {CULTURE_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <p>
        We&apos;re a small team obsessed with the details of online shopping — fast search,
        honest pricing, and a checkout that gets out of your way. If that sounds like your
        kind of problem to solve, we&apos;d love to hear from you.
      </p>

      <h2>Open Roles</h2>
      <ul className="!list-none space-y-3 !ml-0">
        {OPEN_ROLES.map((role) => (
          <li
            key={role.title}
            className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-gray-200 px-4 py-3"
          >
            <div>
              <p className="font-medium text-gray-900">{role.title}</p>
              <p className="text-xs text-gray-500">
                {role.team} · {role.location}
              </p>
            </div>
            <a
              href="mailto:careers@cartloom.example"
              className="text-sm font-medium text-brand hover:underline"
            >
              Apply via email
            </a>
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}

export default CareersPage;
