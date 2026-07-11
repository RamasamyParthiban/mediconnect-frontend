import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 px-8 py-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-white">
        🏥 MediConnect
      </Link>
      <div className="flex gap-6">
        <Link to="/about" className="text-gray-400 hover:text-white font-medium">About</Link>
        <Link to="/contact" className="text-gray-400 hover:text-white font-medium">Contact us</Link>
        <Link to="/terms" className="text-gray-400 hover:text-white font-medium">Terms and Conditions</Link>
      </div>

      <div className="text-gray-400 text-sm">Copyright © 2026 MediConnect. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
