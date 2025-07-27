import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

interface SeekHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindHelpanions: (filters: string[]) => void;
}

export function SeekHelpModal({ isOpen, onClose, onFindHelpanions }: SeekHelpModalProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const backgroundOptions = [
    'NIFT Grads', 'NID Grads', 'IIT Grads', 'IIM Grads', 'XLRI Grads', 'ISB Grads', 'Dropouts'
  ];

  const fieldOptions = [
    'Founders', 'Fashion Designers', 'CAs', 'Product Marketers', 'Engineers', 
    'Consultants', 'Business Analysts', 'Product Managers'
  ];

  const serviceOptions = [
    '1:1 Conversation', '3-Month Mentorship', 'Collaborate on a project', 
    'Graphic Designer', 'Video Editor', 'UX Writer', 'More...'
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleFindHelpanions = () => {
    onFindHelpanions(selectedFilters);
    onClose();
  };

  const renderFilterSection = (options: string[], title: string) => (
    <div className="space-y-4">
      <h3 className="font-medium text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option}
            variant={selectedFilters.includes(option) ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => toggleFilter(option)}
          >
            {option}
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Find Your Helpanion</DialogTitle>
          <p className="text-muted-foreground">
            Filter by background, field, or service type to find the right person for your journey.
          </p>
        </DialogHeader>

        <Tabs defaultValue="background" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="background">By Background</TabsTrigger>
            <TabsTrigger value="field">By Field</TabsTrigger>
            <TabsTrigger value="service">By Service Type</TabsTrigger>
          </TabsList>

          <TabsContent value="background" className="mt-6">
            {renderFilterSection(backgroundOptions, "Educational Background")}
          </TabsContent>

          <TabsContent value="field" className="mt-6">
            {renderFilterSection(fieldOptions, "Professional Field")}
          </TabsContent>

          <TabsContent value="service" className="mt-6">
            {renderFilterSection(serviceOptions, "Service Type")}
          </TabsContent>
        </Tabs>

        {selectedFilters.length > 0 && (
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium mb-2">Selected Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter) => (
                <Badge key={filter} variant="secondary">
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleFindHelpanions} 
            className="flex-1"
            disabled={selectedFilters.length === 0}
          >
            <Search className="mr-2 h-4 w-4" />
            Find Helpanions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}