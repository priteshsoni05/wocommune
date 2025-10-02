import { Link } from 'react-router-dom';

export function HelpanionFooter() {
  const pipeline =
    (import.meta.env.VITE_PIPELINE_MARKER as string | undefined) ?? 'main';

  return (
    <footer className="bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Brand block */}
        <div className="mb-8">
          <h3 className="text-2xl font-brand text-foreground mb-3">WALKER'S ODYSSEY</h3>
          <p className="text-sm text-muted-foreground whitespace-nowrap overflow-x-auto">
            Your trusted companion for every step - connecting you with guidance, community, and inspiration to walk your path with purpose.
          </p>
        </div>

        {/* Navigation rows */}
        <div className="space-y-3">
          {/* Brand links */}
          <div className="flex items-center gap-x-4 whitespace-nowrap overflow-x-auto">
            <h4 className="font-semibold text-sm text-foreground">BRAND:</h4>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ABOUT</Link>
          </div>

          {/* Commune links */}
          <div className="flex items-center gap-x-4 whitespace-nowrap overflow-x-auto">
            <h4 className="font-semibold text-sm text-foreground">COMMUNE:</h4>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">KNOW COMMUNE</Link>
            <Link to="/auth?mode=signup&role=walker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">JOIN COMMUNE</Link>
            <Link to="/auth?mode=signup&role=helpanion" className="text-sm text-muted-foreground hover:text-foreground transition-colors">BECOME A HELPANION</Link>
            <Link to="/guidelines" className="text-sm text-muted-foreground hover:text-foreground transition-colors">COMMUNITY GUIDELINES</Link>
          </div>

          {/* Get in touch */}
          <div className="flex items-center gap-x-4 whitespace-nowrap overflow-x-auto">
            <h4 className="font-semibold text-sm text-foreground">GET IN TOUCH:</h4>
            <a href="mailto:commune@walkersodyssey.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">WRITE US</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noreferrer">LINKEDIN</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noreferrer">INSTAGRAM</a>
          </div>
        </div>

        {/* Pipeline marker */}
        <div className="mt-8 pt-4 border-t border-border">
          <div className="flex justify-end">
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
