import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, GraduationCap, Users, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface NavigationItem {
  id: string;
  label: string;
  children?: NavigationItem[];
}

const hierarchyData: NavigationItem[] = [
  {
    id: 'alumni',
    label: 'Alumni',
    children: [
      {
        id: 'indian',
        label: 'Indian',
        children: [
          { id: 'iim', label: 'IIM' },
          { id: 'isb', label: 'ISB' },
          { id: 'xlri', label: 'XLRI' },
          { id: 'iit', label: 'IIT' },
          { id: 'nit', label: 'NIT' },
          { id: 'nift', label: 'NIFT' },
          { id: 'nid', label: 'NID' },
          { id: 'icai', label: 'ICAI' },
        ]
      },
      {
        id: 'foreign',
        label: 'Foreign',
        children: [
          { id: 'london-fashion', label: 'London School of Fashion' },
        ]
      }
    ]
  },
  {
    id: 'people',
    label: 'People',
    children: [
      { id: 'founders', label: 'Founders' },
      { id: 'consultants', label: 'Consultants' },
      { id: 'chartered-accountants', label: 'Chartered Accountants' },
      { id: 'engineers', label: 'Engineers' },
      { id: 'marketers', label: 'Marketers' },
      { id: 'designers', label: 'Designers' },
      { id: 'merchandisers', label: 'Merchandisers' },
      { id: 'buyers', label: 'Buyers' },
      { id: 'writers', label: 'Writers' },
      { id: 'storytellers', label: 'Storytellers' },
    ]
  },
  {
    id: 'help-areas',
    label: 'Help Areas',
    children: [
      { id: 'finance', label: 'Finance' },
      { id: 'fashion', label: 'Fashion' },
      { id: 'marketing', label: 'Marketing' },
      { id: 'writing', label: 'Writing' },
    ]
  }
];

interface GetHelpHierarchyProps {
  onClose?: () => void;
}

export function GetHelpHierarchy({ onClose }: GetHelpHierarchyProps) {
  const [navigationStack, setNavigationStack] = useState<NavigationItem[]>([]);
  const [currentLevel, setCurrentLevel] = useState<NavigationItem[]>(hierarchyData);
  const navigate = useNavigate();

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      // Navigate deeper into hierarchy
      setNavigationStack(prev => [...prev, { id: 'current', label: item.label, children: currentLevel }]);
      setCurrentLevel(item.children);
    } else {
      // This is a leaf node - navigate to filtered results
      const category = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1].label.toLowerCase() : 'general';
      navigate(`/helpanions?category=${encodeURIComponent(category)}&filter=${encodeURIComponent(item.label)}`);
      onClose?.();
    }
  };

  const handleBack = () => {
    if (navigationStack.length > 0) {
      const previousLevel = navigationStack[navigationStack.length - 1];
      setCurrentLevel(previousLevel.children || hierarchyData);
      setNavigationStack(prev => prev.slice(0, -1));
    }
  };

  const getCurrentTitle = () => {
    if (navigationStack.length === 0) return 'Get Help';
    return navigationStack[navigationStack.length - 1].label;
  };

  const getIcon = (itemId: string) => {
    if (itemId === 'alumni') return <GraduationCap className="h-5 w-5" />;
    if (itemId === 'people') return <Users className="h-5 w-5" />;
    if (itemId === 'help-areas') return <HelpCircle className="h-5 w-5" />;
    return null;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {navigationStack.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-1 h-auto"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-lg font-semibold text-primary">
            {getCurrentTitle()}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {currentLevel.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleItemClick(item)}
              className="w-full justify-between h-auto p-3 text-left hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                {getIcon(item.id)}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.children && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}