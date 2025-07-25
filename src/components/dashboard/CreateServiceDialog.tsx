import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface CreateServiceDialogProps {
  children: React.ReactNode;
}

export const CreateServiceDialog: React.FC<CreateServiceDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [category, setCategory] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [loading, setLoading] = useState(false);

  const { createService } = useServices();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const { error } = await createService({
        title,
        description: description || null,
        price_per_hour: pricePerHour ? parseFloat(pricePerHour) : null,
        category: category || null,
        duration_minutes: parseInt(durationMinutes),
        is_active: true
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create service"
        });
      } else {
        toast({
          title: "Service created!",
          description: "Your new service is now available for booking"
        });
        setOpen(false);
        // Reset form
        setTitle('');
        setDescription('');
        setPricePerHour('');
        setCategory('');
        setDurationMinutes('60');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Service
          </DialogTitle>
          <DialogDescription>
            Add a new service that people can book with you
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Career Coaching, Math Tutoring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you'll help with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price per Hour ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="25.00"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={durationMinutes} onValueChange={setDurationMinutes}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career">Career & Business</SelectItem>
                <SelectItem value="education">Education & Tutoring</SelectItem>
                <SelectItem value="health">Health & Wellness</SelectItem>
                <SelectItem value="creative">Creative & Arts</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="life">Life Coaching</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};