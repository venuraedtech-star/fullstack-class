import { useState } from "react";
import StaticPage from "../components/StaticPage";
import { ChatIcon } from "../components/StaticPageIcons";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand";

  return (
    <StaticPage
      title="Contact Us"
      subtitle="Have a question about an order or the platform? Send it over."
      Icon={ChatIcon}
      gradient="from-[#7A3B69] to-[#4F2350]"
      aside={
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Other Ways to Reach Us</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-800">support@cartloom.example</dd>
            </div>
            <div>
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-medium text-gray-800">+91 80 1234 5678</dd>
            </div>
            <div>
              <dt className="text-gray-500">Hours</dt>
              <dd className="font-medium text-gray-800">Mon–Sat, 9am–7pm</dd>
            </div>
          </dl>
        </div>
      }
    >
      {submitted ? (
        <div className="rounded-sm bg-success/10 px-4 py-3 text-success">
          Thanks, {form.name.trim() || "there"} — we&apos;ve received your message and
          will get back to you soon. (This is a demo form; nothing is sent.)
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className={inputClass}
            placeholder="Your name"
            required
            value={form.name}
            onChange={handleChange("name")}
          />
          <input
            type="email"
            className={inputClass}
            placeholder="Your email"
            required
            value={form.email}
            onChange={handleChange("email")}
          />
          <textarea
            className={`${inputClass} min-h-32 resize-y`}
            placeholder="How can we help?"
            required
            value={form.message}
            onChange={handleChange("message")}
          />
          <button
            type="submit"
            className="rounded-sm bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
          >
            Send Message
          </button>
        </form>
      )}
    </StaticPage>
  );
}

export default ContactPage;
