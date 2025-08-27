import { Link } from 'react-router-dom';
import { Linkedin, Instagram } from 'lucide-react';
import { ContactModal } from './ContactModal';

export function Footer() {
  const pipeline =
    (import.meta.env.VITE_PIPELINE_MARKER as string | undefined) ?? 'main';

  return (
    <footer className="bg-[#FAF9F6] text-[#2B2B2B] border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Brand block */}
          <div>
            <h5 className="text-xl font-heading mb-4">
              WALKER'S ODYSSEY
            </h5>
            <p className="text-sm text-gray-600 max-w-[320px] leading-relaxed">
              Your trusted companion for every step - connecting you with guidance, community, and
              inspiration to walk your path with purpose.
            </p>
          </div>

          {/* Brand links */}
          <div>
            <h6 className="font-semibold mb-3">Brand</h6>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/about#brand-story" className="hover:underline">Brand Story</Link></li>
              <li><Link to="/about#vision" className="hover:underline">Vision</Link></li>
            </ul>
          </div>

          {/* Commune links */}
          <div>
            <h6 className="font-semibold mb-3">Commune</h6>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><Link to="/get-help" className="hover:underline">Know Commune</Link></li>
              <li><Link to="/get-help" className="hover:underline">Join Commune</Link></li>
              <li><Link to="/helpanions" className="hover:underline">Become a Helpanion</Link></li>
              <li><Link to="#" className="hover:underline">Community Guidelines</Link></li>
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h6 className="font-semibold mb-3">Get in touch</h6>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <ContactModal>
                  <button className="hover:underline cursor-pointer">Contact Us</button>
                </ContactModal>
              </li>
              <li><a href="mailto:commune@walkersodyssey.com" className="hover:underline">Write Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright and social links on the right */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
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