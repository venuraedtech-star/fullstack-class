import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";

function BagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 8h12l-1 12.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L6 8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const blobs = [
  { size: 340, top: "-10%", left: "-8%", duration: 14, delay: 0 },
  { size: 260, top: "55%", left: "60%", duration: 18, delay: 1 },
  { size: 200, top: "70%", left: "-6%", duration: 16, delay: 2 },
];

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Branding panel — hidden on narrow viewports so mobile gets the form full-width */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 md:flex">
        {blobs.map((blob, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 blur-3xl"
            style={{ width: blob.size, height: blob.size, top: blob.top, left: blob.left }}
            animate={{ y: [0, 24, 0], x: [0, 16, 0] }}
            transition={{
              duration: blob.duration,
              delay: blob.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-sm px-10 text-center text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-semibold">
            <BagIcon className="h-8 w-8" />
            Cartloom
          </Link>
          <p className="mt-4 text-blue-100">
            Your storefront, managed beautifully — products, orders, and customers,
            all in one place.
          </p>
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center overflow-y-auto bg-white px-6 py-12 dark:bg-gray-950 md:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full">
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
