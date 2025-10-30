import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-green-600 shadow-[0_-0_25px_rgba(0,255,100,0.2)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        {/* About */}
        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold text-green-500">MindMap</h3>
          <p className="text-gray-300">
            Turning PDFs into interactive mind maps for easier learning and productivity.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-green-400">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="hover:text-green-400 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/signup"
                className="hover:text-green-400 transition-colors duration-200"
              >
                Signup
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-green-400">Follow Us</h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 rounded-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-black transition-all duration-300"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-black transition-all duration-300"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-black transition-all duration-300"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-black transition-all duration-300"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-sm text-gray-400 py-4 border-t border-green-700">
        © 2025 <span className="text-green-400 font-semibold">MindMap</span>. All rights reserved.
      </div>
    </footer>
  );
}
