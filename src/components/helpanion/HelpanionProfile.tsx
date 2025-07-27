import { useState } from "react";
import { Profile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, CheckCircle } from "lucide-react";

interface HelpanionProfileProps {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: any; data?: any }>;
}

const schoolOptions = [
  "NIFT", "IIM", "ISB", "IIT", "NIT", "BITS", "Delhi University", "Mumbai University", 
  "Bangalore University", "Anna University", "Dropout", "Self-taught", "Other"
];

const roleOptions = [
  "Founder", "CA", "Designer", "Product Manager", "Software Engineer", "Marketing Manager",
  "Business Analyst", "Consultant", "Teacher", "Student", "Freelancer", "Other"
];

const useCaseOptions = [
  "Early Career Guidance", "Freelance Help", "Mental Health", "Academic Support", 
  "Business Mentoring", "Creative Projects", "Technical Skills", "Life Coaching", "Other"
];

export const HelpanionProfile = ({ profile, updateProfile }: HelpanionProfileProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile.display_name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    email: profile.email || "",
    phone: profile.phone || "",
    avatar_url: profile.avatar_url || "",
    // Additional fields (we'll store these in bio for now as JSON)
    school: "",
    currentRole: "",
    useCase: "",
    skills: "",
    linkedin: "",
    instagram: "",
    portfolio: "",
    website: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile({
        display_name: formData.display_name,
        username: formData.username,
        bio: formData.bio,
        email: formData.email,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-lg text-muted-foreground">
          Complete your profile to start helping others
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Upload Profile Photo
              {formData.avatar_url && <CheckCircle className="h-5 w-5 text-success" />}
            </CardTitle>
            <CardDescription>
              Add a professional photo to build trust with those you'll help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="text-lg">
                  {formData.display_name?.charAt(0)?.toUpperCase() || 'H'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Profile Image URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Basic Information
              {formData.display_name && formData.username && <CheckCircle className="h-5 w-5 text-success" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Full Name *</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Unique Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="your-unique-username"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in your public profile URL
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio (280 characters max)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell people what makes you unique and how you can help..."
                maxLength={280}
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/280 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Background */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Background</CardTitle>
            <CardDescription>
              Help others understand your expertise and background
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school">School/College</Label>
                <Select value={formData.school} onValueChange={(value) => handleInputChange('school', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your school/college" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolOptions.map((school) => (
                      <SelectItem key={school} value={school}>{school}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentRole">Current Role / Field</Label>
                <Select value={formData.currentRole} onValueChange={(value) => handleInputChange('currentRole', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="useCase">Use Case / Expertise Area</Label>
              <Select value={formData.useCase} onValueChange={(value) => handleInputChange('useCase', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="What type of help do you offer?" />
                </SelectTrigger>
                <SelectContent>
                  {useCaseOptions.map((useCase) => (
                    <SelectItem key={useCase} value={useCase}>{useCase}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Tags/Skills</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="UI/UX, JavaScript, Product Strategy, etc. (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple skills with commas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Add your professional and social profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Personal Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="min-w-32">
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};