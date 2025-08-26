import { Link } from 'react-router-dom';
import { Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const pipeline =
    (import.meta.env.VITE_PIPELINE_MARKER as string | undefined) ?? 'main';

  return (
    <footer className="bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="space-y-3">
            <h3 className="text-2xl font-brand text-foreground">WALKER'S ODYSSEY</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your trusted companion for every step - connecting you with guidance, community, and
              inspiration to walk your path with purpose.
            </p>
          </div>

          {/* Brand links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Brand</h4>
            <nav className="space-y-2 text-sm">
              <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/about#brand-story" className="block text-muted-foreground hover:text-foreground transition-colors">Brand Story</Link>
              <Link to="/about#vision" className="block text-muted-foreground hover:text-foreground transition-colors">Vision</Link>
            </nav>
          </div>

          {/* Commune links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Commune</h4>
            <nav className="space-y-2 text-sm">
              <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">Know Commune</Link>
              <Link to="/auth?mode=signup&role=walker" className="block text-muted-foreground hover:text-foreground transition-colors">Join Commune</Link>
              <Link to="/auth?mode=signup&role=helpanion" className="block text-muted-foreground hover:text-foreground transition-colors">Become a Helpanion</Link>
              <Link to="/guidelines" className="block text-muted-foreground hover:text-foreground transition-colors">Community Guidelines</Link>
            </nav>
          </div>

          {/* Get in touch */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Get in touch</h4>
            <nav className="space-y-2 text-sm">
              <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
              <a href="mailto:commune@walkersodyssey.com" className="block text-muted-foreground hover:text-foreground transition-colors">Write Us</a>
            </nav>
          </div>
        </div>

        {/* Bottom section with social links */}
        <div className="mt-8 pt-4 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Walker's Odyssey. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/company/walkers-odyssey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/walkers_odyssey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
            
            <span className="text-xs text-muted-foreground">
              Pipeline:
              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {pipeline}
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}