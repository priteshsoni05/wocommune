import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveSidebar, SidebarTrigger } from '@/components/ui/responsive-sidebar';

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ sidebar, header, children, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border lg:hidden">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger 
              isOpen={sidebarOpen} 
              onOpenChange={setSidebarOpen}
            />
            {header}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <ResponsiveSidebar isOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
        {sidebar}
      </ResponsiveSidebar>

      {/* Main Content */}
      <div className={cn(
        "flex flex-col",
        isMobile ? "lg:ml-80" : "lg:ml-80"
      )}>
        {/* Desktop Header */}
        {!isMobile && header && (
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border hidden lg:block">
            <div className="p-4">
              {header}
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}