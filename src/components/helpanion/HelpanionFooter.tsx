import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function HelpanionFooter() {
  return (
    <footer className="bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-foreground">WO Commune</h3>
            <p className="text-sm text-muted-foreground">
              Part of Walker's Odyssey - connecting help seekers with people who've walked the path before.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Platform</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About WO Commune
              </Link>
              <Link to="/auth" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Join
              </Link>
              <Link to="/events" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Events
              </Link>
              <Link to="/products" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Products
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Community</h4>
            <div className="space-y-2">
              <Link to="/helpanion" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Find a Helpanion
              </Link>
              <Link to="/auth" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Become a Helpanion
              </Link>
              <Link to="/guidelines" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Community Guidelines
              </Link>
              <Link to="/support" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Get in Touch</h4>
            <div className="space-y-2">
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <a href="mailto:hello@wocommune.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                hello@wocommune.com
              </a>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Twitter</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Instagram</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.293C3.851 14.81 3.28 13.553 3.28 12.017c0-1.536.571-2.793 1.846-3.678.875-.803 2.026-1.293 3.323-1.293s2.448.49 3.323 1.293c1.275.885 1.846 2.142 1.846 3.678 0 1.536-.571 2.793-1.846 3.678-.875.803-2.026 1.293-3.323 1.293zm7.071 0c-1.297 0-2.448-.49-3.323-1.293-1.275-.885-1.846-2.142-1.846-3.678 0-1.536.571-2.793 1.846-3.678.875-.803 2.026-1.293 3.323-1.293s2.448.49 3.323 1.293c1.275.885 1.846 2.142 1.846 3.678 0 1.536-.571 2.793-1.846 3.678-.875.803-2.026 1.293-3.323 1.293z"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Walker's Odyssey. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}