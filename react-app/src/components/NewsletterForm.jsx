import { useState } from "react";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim() === "") return;
    console.log("Subscribed:", email);
    setSubmitted(true);
  }
  return (
    <div className="mt-10 bg-slate-50 border border-gray-200 rounded-xl p-6 text-center">
      {submitted ? (
        <p className="text-green-700 font-medium">
          Thanks - You are Subscribed!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

export default NewsletterForm;
