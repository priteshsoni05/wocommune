import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import { GraduationCap, Users, HelpCircle, ChevronRight } from 'lucide-react';

const categoryData = [
  {
    id: 'alumni',
    title: 'Alumni',
    icon: <GraduationCap className="h-4 w-4" />,
    subcategories: [
      {
        title: 'Indian Institutions',
        items: ['IIM', 'ISB', 'XLRI', 'IIT', 'NIT', 'NIFT', 'NID', 'ICAI']
      },
      {
        title: 'Foreign Institutions', 
        items: ['London School of Fashion']
      }
    ]
  },
  {
    id: 'people',
    title: 'People',
    icon: <Users className="h-4 w-4" />,
    subcategories: [
      {
        title: 'Business & Leadership',
        items: ['Founders', 'Consultants', 'Chartered Accountants']
      },
      {
        title: 'Technology & Design',
        items: ['Engineers', 'Designers']
      },
      {
        title: 'Marketing & Content',
        items: ['Marketers', 'Writers', 'Storytellers']
      },
      {
        title: 'Fashion & Retail',
        items: ['Merchandisers', 'Buyers']
      }
    ]
  },
  {
    id: 'help-areas',
    title: 'Help Areas',
    icon: <HelpCircle className="h-4 w-4" />,
    subcategories: [
      {
        title: 'Professional Fields',
        items: ['Finance', 'Fashion', 'Marketing', 'Writing']
      }
    ]
  }
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function GetHelpDropdown() {
  return (
    <NavigationMenu className="z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-7 px-4 text-sm font-medium leading-none border border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white transition-all duration-200">
            Get Help
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover/100 border border-border">
            <div className="w-[800px] p-6 grid grid-cols-3 gap-6">
              {categoryData.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2">
                    {category.icon}
                    <span>{category.title}</span>
                  </div>
                  
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.title} className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {subcategory.title}
                      </h4>
                      <ul className="space-y-1">
                        {subcategory.items.map((item) => (
                          <li key={item}>
                            <Link
                              to={`/helpanions?category=${slugify(category.title)}&filter=${slugify(item)}`}
                              className="text-sm text-foreground hover:text-primary transition-colors duration-200 flex items-center justify-between group py-1"
                            >
                              <span>{item}</span>
                              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <div className="border-t border-border bg-muted/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Browse All Categories</p>
                  <p className="text-xs text-muted-foreground">Explore our complete directory of Helpanions</p>
                </div>
                <Link
                  to="/helpanions"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors duration-200"
                >
                  View All
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}