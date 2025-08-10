import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/nicolas-lobos-b5VHELeW4Qw-unsplash.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HelpanionFooter } from "@/components/helpanion/HelpanionFooter";
import { Menu } from "lucide-react";

const Home: React.FC = () => {
  useEffect(() => {
    document.title = "Walker's Odyssey – Your trusted companion";
    const desc = "Connecting you with guidance, community, and inspiration to walk your path with purpose.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    // canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with brand and burger */}
      <header className="relative z-10">
        <div className="container mx-auto py-4 flex items-center justify-center">
          <div className="absolute right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuItem asChild>
                  <Link to="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/get-help">Commune</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#">Shop</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link to="/" className="text-sm tracking-widest uppercase font-brand">WALKER'S ODYSSEY</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 h-full container mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h1>Your trusted companion for every step</h1>
          <p className="max-w-2xl text-muted-foreground">
            Connecting you with guidance, community, and inspiration to walk your path with purpose.
          </p>
        </div>
        <div className="absolute right-4 bottom-4 z-10">
          <Button asChild variant="secondary" size="sm" className="btn-sm">
            <Link to="/about">Know Us</Link>
          </Button>
        </div>
      </section>

      {/* WO Commune */}
      <main>
        <section className="container mx-auto py-12 space-y-6">
          <h2 className="text-muted-foreground">wo commune</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="#" className="group">
              <Card className="h-48 md:h-56 transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>Join Events</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-between h-24 md:h-28 text-muted-foreground">
                  <span>Network and grow</span>
                </CardContent>
              </Card>
            </Link>

            <Link to="/get-help" className="group">
              <Card className="h-48 md:h-56 border-primary/40 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>Get Help, Meet Your Helpanion</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-between h-24 md:h-28 text-muted-foreground">
                  <span>Seek help</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Shop */}
        <section className="container mx-auto pb-16 space-y-6">
          <h2 className="text-muted-foreground">Shop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="#" className="group">
              <Card className="h-48 md:h-56 transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>Walkmate</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-between h-24 md:h-28 text-muted-foreground" />
              </Card>
            </a>

            <a href="#" className="group">
              <Card className="h-48 md:h-56">
                <CardHeader>
                  <CardTitle>The planner you’re looking for has finally arrived at WO Commune</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-between h-24 md:h-28 text-muted-foreground">
                  <Button variant="outline" size="sm">Shop Now</Button>
                </CardContent>
              </Card>
            </a>
          </div>
        </section>
      </main>

      <HelpanionFooter />
    </div>
  );
};

export default Home;