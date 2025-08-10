// Home.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/nicolas-lobos-b5VHELeW4Qw-unsplash.jpg";
import heroHelp from "@/assets/hero-helpanion.jpg";
import heroSketch from "@/assets/hero-sketch.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpanionFooter } from "@/components/helpanion/HelpanionFooter";
import { Menu } from "lucide-react";

const Home: React.FC = () => {
  useEffect(() => {
    document.title = "Walker's Odyssey – Your trusted companion";
    const desc =
      "Connecting you with guidance, community, and inspiration to walk your path with purpose.";
    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/";

    // Prevent horizontal scroll gap
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col snap-y snap-mandatory overflow-y-auto overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen snap-start w-full">
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/60 w-full h-full" />

        {/* Header */}
        <div className="absolute top-0 left-0 w-full z-20">
          <div className="container mx-auto py-4 flex items-center justify-center relative">
            <div className="absolute right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    className="bg-transparent hover:bg-transparent focus-visible:bg-transparent"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-48 z-50 bg-transparent backdrop-blur-sm border-none shadow-none"
                >
                  <DropdownMenuItem asChild className="bg-transparent">
                    <Link to="/about">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="bg-transparent">
                    <Link to="/get-help">Commune</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="bg-transparent">
                    <a href="#">Shop</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link
              to="/"
              className="tracking-widest font-bold"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "24px", // 25% smaller than original
                color: "#636363",
              }}
            >
              WALKER'S ODYSSEY
            </Link>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 h-full container mx-auto flex flex-col items-center justify-center text-center gap-4 px-4">
          <h2
            style={{
              fontSize: "50px",
              fontFamily: "'Source Sans Pro', sans-serif",
              color: "#000000",
            }}
            className="max-w-full"
          >
            Your trusted companion for every step
          </h2>
          <div className="w-12 border-t-2 border-black my-2" />
          <p
            style={{
              fontSize: "24px",
              fontFamily: "'Source Sans Pro', sans-serif",
              color: "#000000",
            }}
            className="max-w-3xl"
          >
            Connecting you with guidance, community, and inspiration to walk your
            path with purpose.
          </p>
        </div>

        <div className="absolute right-4 bottom-4 z-20">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="px-0 bg-transparent hover:bg-transparent"
          >
            <Link to="/about">Know us</Link>
          </Button>
        </div>
      </section>

      {/* WO Commune */}
      <main className="snap-start w-full">
        <section className="container mx-auto py-8 space-y-6">
          <h2 className="text-muted-foreground">wo commune</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
            <Link to="#" className="group">
              <Card className="h-full aspect-[4/3] overflow-hidden transition-shadow group-hover:shadow-md">
                <div className="relative h-full w-full">
                  <img
                    src={heroSketch}
                    alt="Join Events"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/40" />
                  <div className="relative p-4 flex flex-col justify-between h-full">
                    <h3 className="text-xl font-semibold">Join Events</h3>
                    <span className="text-muted-foreground">
                      Network and grow
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/get-help" className="group">
              <Card className="h-full aspect-[4/3] overflow-hidden border-primary/40 hover:border-primary transition-colors">
                <div className="relative h-full w-full">
                  <img
                    src={heroHelp}
                    alt="Get Help, Meet Your Helpanion"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/40" />
                  <div className="relative p-4 flex flex-col justify-between h-full">
                    <h3 className="text-xl font-semibold">
                      Get Help, Meet Your Helpanion
                    </h3>
                    <span className="text-muted-foreground">Seek help</span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Shop */}
        <section className="container mx-auto pb-16 space-y-6 snap-start w-full">
          <h2 className="text-muted-foreground">Shop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
            <a href="#" className="group">
              <Card className="h-full aspect-[4/3] overflow-hidden transition-shadow group-hover:shadow-md">
                <div className="relative h-full w-full">
                  <img
                    src={heroHelp}
                    alt="Walkmate"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/40" />
                  <div className="relative p-4 flex flex-col justify-between h-full">
                    <h3 className="text-xl font-semibold">Walkmate</h3>
                  </div>
                </div>
              </Card>
            </a>

            <a href="#" className="group">
              <Card className="h-full aspect-[4/3] overflow-hidden">
                <div className="relative h-full w-full">
                  <img
                    src={heroSketch}
                    alt="WO Commune Planner"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/40" />
                  <div className="relative p-4 flex flex-col justify-between h-full">
                    <h3 className="text-xl font-semibold">
                      The planner you’re looking for has finally arrived at WO
                      Commune
                    </h3>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-3 bg-transparent hover:bg-transparent"
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
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
