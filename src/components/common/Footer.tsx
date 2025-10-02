import { Link } from 'react-router-dom';
import { Linkedin, Instagram } from 'lucide-react';
import { ContactModal } from './ContactModal';

export function Footer() {
  const pipeline =
    (import.meta.env.VITE_PIPELINE_MARKER as string | undefined) ?? 'main';

  return (
    <footer className="bg-white text-[#2B2B2B] border-t border-gray-200">
      <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        {/* Brand block */}
        <div className="mb-8">
          <h5 className="text-xl font-heading mb-3">
            WALKER'S ODYSSEY
          </h5>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-nowrap overflow-x-auto">
            Your trusted companion for every step - connecting you with guidance, community, and inspiration to walk your path with purpose.
          </p>
        </div>

        {/* Navigation rows */}
        <div className="space-y-3">
          {/* Brand links */}
          <div className="flex items-center gap-x-4 whitespace-nowrap overflow-x-auto">
            <h6 className="font-semibold text-sm">BRAND:</h6>
            <Link to="/about" className="text-sm text-gray-700 hover:underline">ABOUT</Link>
          </div>

          {/* Commune links */}
          <div className="flex items-center gap-x-4 whitespace-nowrap overflow-x-auto">
            <h6 className="font-semibold text-sm">COMMUNE:</h6>
            <Link to="/wo-commune" className="text-sm text-gray-700 hover:underline">KNOW COMMUNE</Link>
            <a href="https://wocommune.substack.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:underline">JOIN COMMUNE</a>
            <Link to="/auth?mode=signup&role=helpanion" className="text-sm text-gray-700 hover:underline">BECOME A HELPANION</Link>
            <Link to="/guidelines" className="text-sm text-gray-700 hover:underline">COMMUNITY GUIDELINES</Link>
          </div>

          {/* Get in touch */}
          <div className="flex items-center gap-x-4 whitespace-nowrap overflow-x-auto">
            <h6 className="font-semibold text-sm">GET IN TOUCH:</h6>
            <a href="mailto:commune@walkersodyssey.com" className="text-sm text-gray-700 hover:underline">WRITE US</a>
          </div>
        </div>

        {/* Bottom section with copyright and social links on the right */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p>© {new Date().getFullYear()} Walker's Odyssey. All rights reserved.</p>
              <span>
                Pipeline:
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 font-mono text-[10px] text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  {pipeline}
                </span>
              </span>
            </div>
            
            {/* Social icons on the right */}
            <div className="flex items-center gap-3">
              <a 
                href="https://www.linkedin.com/company/walkers-odyssey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#2B2B2B] hover:text-black transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/walkers_odyssey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#2B2B2B] hover:text-black transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}