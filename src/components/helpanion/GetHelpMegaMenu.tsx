import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const columns = [
  {
    heading: "Explore by Goal",
    groups: [
      {
        label: "College",
        items: ["Freshers", "Final Year", "Study Abroad", "Scholarships"],
      },
      {
        label: "Profession",
        items: ["Software", "Design", "Product", "Marketing", "Finance", "Data"],
      },
      {
        label: "Unconventional Paths",
        items: ["Gap Year", "Freelancing", "Creator", "Startup", "Social Impact"],
      },
      {
        label: "Career Switchers",
        items: [
          "Non‑tech to Tech",
          "Tech to Product",
          "Operations to PM",
          "Any to Design",
        ],
      },
      {
        label: "By Duration",
        items: ["15m Quick Advice", "30m Clarity Call", "60m Deep Dive", "Mentorship"],
      },
    ],
  },
  {
    heading: "Journeys",
    groups: [
      {
        label: "Events",
        items: ["Run Club", "Workshops", "Webinars", "Dinners", "Screenings"],
      },
      {
        label: "Conversations",
        items: ["Group Circles", "City Meets", "Online Huddles"],
      },
      {
        label: "1:1 Guidance",
        items: ["Quick Questions", "Career Maps", "Portfolio Reviews"],
      },
    ],
  },
  {
    heading: "Resources & Media",
    groups: [
      {
        label: "Podcasts",
        items: ["Walker Stories", "Career Pivots", "Industry Talks"],
      },
      {
        label: "Guides & Templates",
        items: ["Resume", "Interview", "Portfolio", "Scholarship"],
      },
      {
        label: "Community",
        items: ["Local Chapters", "Success Stories", "Community Guidelines"],
      },
    ],
  },
] as const;

export function GetHelpMegaMenu() {
  return (
    <NavigationMenu className="z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="bg-transparent hover:bg-transparent focus:bg-transparent px-0 py-1 text-foreground font-medium tracking-wide data-[state=open]:text-primary"
            aria-label="Open Get Help menu"
          >
            Get Help
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover/100">
            <div className="w-[92vw] max-w-[1000px] p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((col) => (
                <div key={col.heading}>
                  <h3 className="text-sm font-semibold mb-3 text-foreground/80">
                    {col.heading}
                  </h3>
                  <div className="space-y-4">
                    {col.groups.map((grp) => (
                      <div key={grp.label}>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                          {grp.label}
                        </p>
                        <ul className="space-y-1.5">
                          {grp.items.map((it) => (
                            <li key={it}>
                              <Link
                                to={`/get-help?category=${slugify(grp.label)}&topic=${slugify(it)}`}
                                className="text-sm text-foreground/80 hover:text-primary transition-colors"
                              >
                                {it}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default GetHelpMegaMenu;
