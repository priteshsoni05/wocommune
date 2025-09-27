import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GetHelpHierarchy } from '@/components/helpanion/GetHelpHierarchy';

export default function WOCommuneSlate() {
  const [isGetHelpOpen, setIsGetHelpOpen] = useState(false);

  return (
    <div className="safe-area-x" style={{ backgroundColor: "#193232", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", marginTop: "0px" }}>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 flex items-center justify-between h-12 md:h-12">

        {/* Left section - Get Help Button */}
        <div className="flex-1">
          <Dialog open={isGetHelpOpen} onOpenChange={setIsGetHelpOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-4 text-sm font-medium leading-none border border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                Get Help
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Find the Right Help</DialogTitle>
              </DialogHeader>
              <GetHelpHierarchy onClose={() => setIsGetHelpOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Center Text - WO COMMUNE only */}
        <div className="text-center">
          <span className="font-semibold text-sm sm:text-base tracking-wider" style={{ color: "hsl(40, 20%, 98%)" }}>
            WO COMMUNE
          </span>
        </div>
        
        {/* Right section - matches logo layout */}
        <div className="flex-1 flex justify-end items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.linkedin.com/showcase/wo-commune"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-7 h-7 sm:w-8 sm:h-8 rounded-full items-center justify-center leading-none transition-colors" 
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "hsl(40, 20%, 98%)" }} 
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; e.currentTarget.style.color = "white"; }} 
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune LinkedIn"
            >
              <Linkedin className="block w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <a
              href="https://www.instagram.com/wo_commune"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-7 h-7 sm:w-8 sm:h-8 rounded-full items-center justify-center leading-none transition-colors" 
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "hsl(40, 20%, 98%)" }} 
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; e.currentTarget.style.color = "white"; }} 
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune Instagram"
            >
              <Instagram className="block w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <a
              href="https://wocommune.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-7 h-7 sm:w-8 sm:h-8 rounded-full items-center justify-center leading-none transition-colors" 
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "hsl(40, 20%, 98%)" }} 
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; e.currentTarget.style.color = "white"; }} 
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune Substack"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="block w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.539 24V10.812H1.46zM22.539 0H1.46v2.836h21.08V0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}