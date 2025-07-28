import { useState, useEffect, useRef } from "react";
import { Profile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, CheckCircle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomOptions } from "@/hooks/useCustomOptions";

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
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customSchool, setCustomSchool] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [showCustomSchool, setShowCustomSchool] = useState(false);
  const [showCustomRole, setShowCustomRole] = useState(false);
  
  // Custom options hooks
  const { customOptions: customSchools, addCustomOption: addCustomSchool } = useCustomOptions('school');
  const { customOptions: customRoles, addCustomOption: addCustomRole } = useCustomOptions('role');
  
  const [formData, setFormData] = useState({
    display_name: profile.display_name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    email: profile.email || "",
    phone: profile.phone || "",
    avatar_url: profile.avatar_url || "",
    school: profile.school || "",
    role: profile.role || "",
    use_case: profile.use_case || "",
    skills: profile.skills || "",
    linkedin_url: profile.linkedin_url || "",
    instagram_url: profile.instagram_url || "",
    portfolio_url: profile.portfolio_url || "",
    website_url: profile.website_url || ""
  });

  // Load existing profile data when component mounts or profile changes
  useEffect(() => {
    // Only update form data if it's different from current state to avoid overwriting user input
    const newFormData = {
      display_name: profile.display_name || "",
      username: profile.username || "",
      bio: profile.bio || "",
      email: profile.email || "",
      phone: profile.phone || "",
      avatar_url: profile.avatar_url || "",
      school: profile.school || "",
      role: profile.role || "",
      use_case: profile.use_case || "",
      skills: profile.skills || "",
      linkedin_url: profile.linkedin_url || "",
      instagram_url: profile.instagram_url || "",
      portfolio_url: profile.portfolio_url || "",
      website_url: profile.website_url || ""
    };
    
    // Only update if the form data is actually different (avoid infinite updates)
    setFormData(prevData => {
      const hasChanges = Object.keys(newFormData).some(key => 
        prevData[key as keyof typeof prevData] !== newFormData[key as keyof typeof newFormData]
      );
      return hasChanges ? newFormData : prevData;
    });
  }, [profile]);

  const uploadImage = async (file: File) => {
    if (!user) return null;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      handleInputChange('avatar_url', imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Form submission started with data:', formData);

    try {
      // Handle custom school addition
      let schoolValue = formData.school;
      if (showCustomSchool && customSchool.trim()) {
        const schoolResult = await addCustomSchool(customSchool);
        if (schoolResult.error) {
          toast({
            title: "Error",
            description: "Failed to save custom school option.",
            variant: "destructive",
          });
          return;
        }
        schoolValue = customSchool;
        setShowCustomSchool(false);
        setCustomSchool("");
      }

      // Handle custom role addition
      let roleValue = formData.role;
      if (showCustomRole && customRole.trim()) {
        const roleResult = await addCustomRole(customRole);
        if (roleResult.error) {
          toast({
            title: "Error",
            description: "Failed to save custom role option.",
            variant: "destructive",
          });
          return;
        }
        roleValue = customRole;
        setShowCustomRole(false);
        setCustomRole("");
      }
      
      const updateData = {
        display_name: formData.display_name,
        username: formData.username,
        bio: formData.bio,
        email: formData.email,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
        school: schoolValue,
        role: roleValue,
        use_case: formData.use_case,
        skills: formData.skills,
        linkedin_url: formData.linkedin_url,
        instagram_url: formData.instagram_url,
        portfolio_url: formData.portfolio_url,
        website_url: formData.website_url,
      };
      
      console.log('Updating profile with data:', updateData);
      const result = await updateProfile(updateData);

      console.log('Profile update result:', result);
      
      if (result.error) {
        console.error('Profile update error:', result.error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Profile updated successfully:', result.data);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        
        // Update form data with the new values
        setFormData(prev => ({
          ...prev,
          school: schoolValue,
          role: roleValue
        }));
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
    console.log(`Updating field ${field} to:`, value);
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Photo"}
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
                {showCustomSchool ? (
                  <div className="flex gap-2">
                    <Input
                      value={customSchool}
                      onChange={(e) => setCustomSchool(e.target.value)}
                      placeholder="Enter your school/college"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (customSchool.trim()) {
                          const result = await addCustomSchool(customSchool);
                          if (result.data) {
                            handleInputChange('school', customSchool);
                            setShowCustomSchool(false);
                            setCustomSchool("");
                          }
                        } else {
                          setShowCustomSchool(false);
                          setCustomSchool("");
                        }
                      }}
                    >
                      {customSchool.trim() ? "Add" : "Cancel"}
                    </Button>
                  </div>
                ) : (
                  <Select 
                    value={formData.school} 
                    onValueChange={(value) => {
                      if (value === "add-new") {
                        setShowCustomSchool(true);
                      } else {
                        handleInputChange('school', value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your school/college" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolOptions.map((school) => (
                        <SelectItem key={school} value={school}>{school}</SelectItem>
                      ))}
                      {customSchools.map((school) => (
                        <SelectItem key={`custom-${school}`} value={school}>{school}</SelectItem>
                      ))}
                      <SelectItem value="add-new">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add New...
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Current Role / Field</Label>
                {showCustomRole ? (
                  <div className="flex gap-2">
                    <Input
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="Enter your role/field"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (customRole.trim()) {
                          const result = await addCustomRole(customRole);
                          if (result.data) {
                            handleInputChange('role', customRole);
                            setShowCustomRole(false);
                            setCustomRole("");
                          }
                        } else {
                          setShowCustomRole(false);
                          setCustomRole("");
                        }
                      }}
                    >
                      {customRole.trim() ? "Add" : "Cancel"}
                    </Button>
                  </div>
                ) : (
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => {
                      if (value === "add-new") {
                        setShowCustomRole(true);
                      } else {
                        handleInputChange('role', value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                      {customRoles.map((role) => (
                        <SelectItem key={`custom-${role}`} value={role}>{role}</SelectItem>
                      ))}
                      <SelectItem value="add-new">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add New...
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="use_case">Use Case / Expertise Area</Label>
              <Select value={formData.use_case} onValueChange={(value) => handleInputChange('use_case', value)}>
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
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio</Label>
                <Input
                  id="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Personal Website</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
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