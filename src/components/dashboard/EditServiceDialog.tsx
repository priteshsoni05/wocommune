import { useState, useEffect } from "react";
import { useServices, Service } from "@/hooks/useServices";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EditServiceDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditServiceDialog = ({ service, open, onOpenChange }: EditServiceDialogProps) => {
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description || "");
  const [price, setPrice] = useState(service.price_per_hour?.toString() || "");
  const [category, setCategory] = useState(service.category || "");
  const [duration, setDuration] = useState(service.duration_minutes.toString());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(service.image_url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { updateService } = useServices();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      setTitle(service.title);
      setDescription(service.description || "");
      setPrice(service.price_per_hour?.toString() || "");
      setCategory(service.category || "");
      setDuration(service.duration_minutes.toString());
      setCurrentImageUrl(service.image_url);
      setImageFile(null);
    }
  }, [service, open]);

  const handleImageUpload = async (file: File) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('service-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('service-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file"
        });
        return;
      }

      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setCurrentImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    try {
      let imageUrl = currentImageUrl;

      if (imageFile) {
        setIsUploading(true);
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
        setIsUploading(false);
      }

      const result = await updateService(service.id, {
        title: title.trim(),
        description: description.trim() || null,
        price_per_hour: price ? parseFloat(price) : null,
        category: category || null,
        duration_minutes: parseInt(duration),
        image_url: imageUrl,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update service. Please try again."
        });
      } else {
        toast({
          title: "Service updated",
          description: "Your service has been updated successfully."
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update your service details. Make changes to improve your offering.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Service Name *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What service do you offer?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you'll help with..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price per hour</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutoring">Tutoring</SelectItem>
                <SelectItem value="tech-support">Tech Support</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="language">Language</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="art">Art & Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Service Image</Label>
            <div className="space-y-3">
              {(currentImageUrl || imageFile) && (
                <div className="relative">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : currentImageUrl!}
                    alt="Service preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="edit-image-upload"
                />
                <Label
                  htmlFor="edit-image-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  {currentImageUrl || imageFile ? 'Change Image' : 'Add Image'}
                </Label>
                <span className="text-sm text-muted-foreground">
                  Optional, max 5MB
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading || !title.trim()}
            >
              {isUploading ? "Uploading..." : isSubmitting ? "Updating..." : "Update Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};