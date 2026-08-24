import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-8 bg-ink text-white">
      <div className="mx-auto grid max-w-[1248px] grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h4 className="mb-3 text-xs font-medium text-gray-400">ABOUT</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-white">About Cartloom</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-medium text-gray-400">HELP</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/payments" className="hover:text-white">Payments</Link></li>
            <li><Link to="/shipping" className="hover:text-white">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-medium text-gray-400">POLICY</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/return-policy" className="hover:text-white">Return Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-medium text-gray-400">SOCIAL</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Facebook</a></li>
            <li><a href="#" className="hover:text-white">Twitter</a></li>
            <li><a href="#" className="hover:text-white">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © 2026 Cartloom. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
