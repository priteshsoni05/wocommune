import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';

const categoryData = [
  {
    id: 'alumni',
    title: 'Alumni',
    icon: <GraduationCap className="h-4 w-4" />,
    subcategories: [
      {
        title: 'Premier Institutions',
        items: ['IIM', 'ISB', 'XLRI', 'IIT', 'NIT', 'NIFT', 'NID', 'ICAI']
      },
      {
        title: 'International',
        items: ['London School of Fashion']
      },
    ]
  },
  {
    id: 'people',
    title: 'People',
    icon: <Users className="h-4 w-4" />,
    subcategories: [
      {
        title: 'Business & Leadership',
        items: ['Founders', 'Consultants', 'Product Managers', 'Operations']
      },
      {
        title: 'Technology & Data',
        items: ['Engineers', 'Data Professionals', 'Designers']
      },
      {
        title: 'Marketing & Sales',
        items: ['Marketers', 'Writers', 'Sales Professionals', 'Customer Success']
      },
      {
        title: 'Finance & Fashion',
        items: ['Chartered Accountants', 'Finance Professionals', 'Fashion Professionals', 'Merchandisers']
      },
      {
        title: 'Support & Growth',
        items: ['HR Professionals', 'Students']
      }
    ]
  },
  {
    id: 'help-areas',
    title: 'Help Areas',
    icon: <HelpCircle className="h-4 w-4" />,
    subcategories: [
      {
        title: 'Core Business',
        items: ['Finance', 'Marketing', 'Business', 'Sales', 'Operations']
      },
      {
        title: 'Growth & Development',
        items: ['Career', 'Education', 'Consulting', 'Fashion', 'Writing']
      }
    ]
  }
];

export function GetHelpDropdown() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string, item: string) => {
    // Map category IDs to correct parameter names
    const categoryMap: { [key: string]: string } = {
      'alumni': 'alumni',
      'people': 'people', 
      'help-areas': 'helpAreas'
    };
    
    const categoryParam = categoryMap[category] || category;
    const searchParams = new URLSearchParams();
    searchParams.set(categoryParam, item);
    navigate(`/helpanions?${searchParams.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-7 px-2 text-sm font-bold leading-none bg-transparent hover:bg-transparent focus:bg-transparent transition-all duration-200 uppercase tracking-wider text-white hover:text-white/80 border-0"
        >
          GET HELP
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[calc(100vw-2rem)] sm:w-[500px] md:w-[650px] lg:w-[800px] bg-white border border-border shadow-lg z-[100] p-0"
        sideOffset={8}
      >
        {/* Scrollable content area */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categoryData.map((category) => (
              <div key={category.id} className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground border-b border-border pb-2">
                  {category.icon}
                  <span>{category.title}</span>
                </div>
                
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.title} className="space-y-1.5 md:space-y-2">
                    <h4 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {subcategory.title}
                    </h4>
                    <ul className="space-y-0.5 md:space-y-1">
                      {subcategory.items.map((item) => (
                        <li key={item}>
                          <button
                            onClick={() => handleCategoryClick(category.id, item)}
                            className="w-full text-left text-xs sm:text-sm text-foreground hover:text-primary transition-colors duration-200 flex items-center justify-between group py-1"
                          >
                            <span>{item}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom CTA - Fixed at bottom */}
        <div className="border-t border-border bg-muted/20 px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-foreground">Browse All Categories</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Explore our complete directory of Helpanions</p>
            </div>
            <button
              onClick={() => navigate('/helpanions')}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md text-white hover:opacity-90 transition-all duration-200 whitespace-nowrap"
              style={{ backgroundColor: '#193232' }}
            >
              View All
              <ChevronRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}