import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        {/* About */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">MindMap</h3>
          <p className="text-gray-200">
            Turning PDFs into interactive mind maps for easier learning and productivity.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/signup" className="hover:text-gray-300">Signup</a></li>
            <li><a href="/reset-password" className="hover:text-gray-300">Reset Password</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300"><Facebook size={20} /></a>
            <a href="#" className="hover:text-gray-300"><Twitter size={20} /></a>
            <a href="#" className="hover:text-gray-300"><Instagram size={20} /></a>
            <a href="#" className="hover:text-gray-300"><Github size={20} /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-300 py-4 border-t border-gray-200">
        © 2025 MindMap. All rights reserved.
      </div>
    </footer>
  );
}
