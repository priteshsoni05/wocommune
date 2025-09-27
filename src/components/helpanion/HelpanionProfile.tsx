import { useState, useEffect, useRef } from "react";
import { Profile } from "@/hooks/useOptimizedProfile";
import { useFormPersistence } from "@/hooks/useFormPersistence";
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

// --- Enhancements: Required fields for completion meter and validation ---
const REQUIRED_FIELDS = [
  "display_name",
  "username",
  "bio",
  "skills",
  "avatar_url"
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
  const [usernameError, setUsernameError] = useState("");

  // Custom options hooks
  const { customOptions: customSchools, addCustomOption: addCustomSchool } = useCustomOptions('school');
  const { customOptions: customRoles, addCustomOption: addCustomRole } = useCustomOptions('role');

  // Use Case custom logic
  const [showCustomUseCase, setShowCustomUseCase] = useState(false);
  const [customUseCase, setCustomUseCase] = useState("");
  const [customUseCases, setCustomUseCases] = useState<string[]>([]);
  const [useCaseLoading, setUseCaseLoading] = useState(false);

  // Use form persistence hook for profile form data
  const { 
    formData, 
    updateFormData, 
    resetFormData,
    isLoaded 
  } = useFormPersistence({
    key: "helpanion_profile",
    initialValues: {
      display_name: "",
      username: "",
      bio: "",
      short_bio: "",
      email: "",
      phone: "",
      avatar_url: "",
      school: "",
      role: "",
      use_case: "",
      skills: "",
      linkedin_url: "",
      instagram_url: "",
      portfolio_url: "",
      website_url: ""
    }
  });

  // Initialize form data with profile data when loaded
  useEffect(() => {
    if (profile && isLoaded) {
      const profileData = {
        display_name: profile.display_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        short_bio: profile.short_bio || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || "",
        school: profile.school || "",
        role: profile.profession || "",
        use_case: profile.use_case || "",
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || "",
        linkedin_url: profile.linkedin_url || "",
        instagram_url: profile.instagram_url || "",
        portfolio_url: profile.portfolio_url || "",
        website_url: profile.website_url || ""
      };
      
      // Always sync with the latest profile data from database
      updateFormData(profileData);
    }
  }, [profile, isLoaded]);

  // --- Enhancement: Profile completion calculation ---
  const completion = Math.round(
    REQUIRED_FIELDS.filter((key) => {
      const value = formData[key as keyof typeof formData];
      if (Array.isArray(value)) return value.length > 0;
      return value && typeof value === 'string' && value.trim();
    }).length /
    REQUIRED_FIELDS.length * 100
  );

  // This useEffect is no longer needed as we handle initialization in the previous useEffect

  // Fetch custom use cases from Supabase
  useEffect(() => {
    const fetchCustomUseCases = async () => {
      setUseCaseLoading(true);
      const { data, error } = await supabase.from("custom_options").select("*").eq("option_type", "use_case");
      if (data) {
        setCustomUseCases(data.map((item: any) => item.option_value));
      }
      setUseCaseLoading(false);
    };
    fetchCustomUseCases();
  }, []);

  const addCustomUseCase = async (value: string) => {
    if (
      useCaseOptions.some(
        (opt) => opt.toLowerCase() === value.trim().toLowerCase()
      ) ||
      customUseCases.some(
        (opt) => opt.toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      toast({
        title: "Duplicate Value",
        description: "This use case/expertise area already exists.",
        variant: "destructive",
      });
      return { error: "duplicate" };
    }
    const { data, error } = await supabase
      .from("custom_options")
      .insert({ option_type: "use_case", option_value: value.trim(), user_id: user?.id || '' })
      .select();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add the new use case. Please try again.",
        variant: "destructive",
      });
      return { error };
    } else {
      setCustomUseCases((prev) => [...prev, value.trim()]);
      toast({
        title: "Added!",
        description: "Your expertise area was added for all users.",
      });
      return { data };
    }
  };

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

  // --- Enhancement: Username normalizer and uniqueness check ---
  const handleUsernameChange = (value: string) => {
    const normalized = value.replace(/\s/g, "").toLowerCase();
    updateFormData({ username: normalized });
    setUsernameError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUsernameError("");

    // Skip required field validation for now to focus on the update issue
    console.log('Form data before validation:', formData);

    // --- Enhancement: Check username uniqueness ---
    if (formData.username) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", formData.username)
        .neq("id", profile.id);
      if (existing && existing.length > 0) {
        toast({
          title: "Username taken",
          description: "Please choose a different username.",
          variant: "destructive",
        });
        setUsernameError("Username already taken");
        setLoading(false);
        return;
      }
    }

    try {
      // Custom school value
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
      // Custom role value
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
      // Custom use case value
      let useCaseValue = formData.use_case;
      if (showCustomUseCase && customUseCase.trim()) {
        const useCaseResult = await addCustomUseCase(customUseCase);
        if (useCaseResult.error) {
          toast({
            title: "Error",
            description: "Failed to save custom expertise area.",
            variant: "destructive",
          });
          return;
        }
        useCaseValue = customUseCase;
        setShowCustomUseCase(false);
        setCustomUseCase("");
      }
      // Create update data, filtering out any empty/null role values that could cause enum errors
      const updateData: any = {
        display_name: formData.display_name,
        username: formData.username,
        bio: formData.bio,
        short_bio: formData.short_bio,
        email: formData.email,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
        school: schoolValue,
        use_case: useCaseValue,
        skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()) : formData.skills,
        linkedin_url: formData.linkedin_url,
        instagram_url: formData.instagram_url,
        portfolio_url: formData.portfolio_url,
        website_url: formData.website_url,
      };

      // Include profession field
      if (roleValue) {
        updateData.profession = roleValue;
      }
      
      console.log('Attempting to update profile with data:', updateData);
      const result = await updateProfile(updateData);
      console.log('Update profile result:', result);
      
      if (result?.error) {
        console.error('Profile update error details:', result.error);
        toast({
          title: "Error",
          description: `Failed to update profile: ${result.error.message || 'Please try again.'}`,
          variant: "destructive",
        });
      } else {
        console.log('Profile updated successfully');
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        // Clear persisted form data since profile was successfully saved
        resetFormData();
      }
    } catch (error) {
      console.error('Unexpected error during profile update:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
    if (field === "username") setUsernameError("");
  };

  return (
    <div className="p-3 sm:p-4 lg:p-8 space-y-4 lg:space-y-6">
      <div className="space-y-1 lg:space-y-2">
        <h1>My Profile</h1>
        <p className="text-muted-foreground">
          Complete your profile to start helping others
        </p>
      </div>

      {/* Remove duplicate progress bar - using unified one in sidebar only */}

      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Upload Profile Photo
              {formData.avatar_url && <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success" />}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
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
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell us about yourself
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name <span className="text-red-500">*</span></Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="Choose a unique username"
                  required
                />
                {usernameError && (
                  <div className="text-red-500 text-xs mt-1">{usernameError}</div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_bio">Short Bio / Tagline</Label>
              <Input
                id="short_bio"
                value={formData.short_bio}
                onChange={(e) => handleInputChange('short_bio', e.target.value)}
                placeholder="I help with..."
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                A short one-line description that appears below your name on your public profile
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio <span className="text-red-500">*</span></Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about your experience, background, and what you offer."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Background, Role */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Background</CardTitle>
            <CardDescription>
              Help others understand your expertise and background
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* School */}
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
              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Profession</Label>
                {showCustomRole ? (
                  <div className="flex gap-2">
                    <Input
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="Enter your profession"
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
                      <SelectValue placeholder="Select your profession" />
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

            {/* Use Case / Expertise Area */}
            <div className="space-y-2">
              <Label htmlFor="use_case">Use Case / Expertise Area</Label>
              {showCustomUseCase ? (
                <div className="flex gap-2">
                  <Input
                    value={customUseCase}
                    onChange={(e) => setCustomUseCase(e.target.value)}
                    placeholder="Enter your expertise area"
                    className="flex-1"
                    maxLength={50}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={useCaseLoading}
                    onClick={async () => {
                      if (customUseCase.trim().length < 3) {
                        toast({
                          title: "Too Short",
                          description: "Please enter at least 3 characters.",
                          variant: "destructive",
                        });
                        return;
                      }
                      const result = await addCustomUseCase(customUseCase);
                      if (result.data) {
                        handleInputChange("use_case", customUseCase.trim());
                        setShowCustomUseCase(false);
                        setCustomUseCase("");
                      }
                    }}
                  >
                    {customUseCase.trim() ? "Add" : "Cancel"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowCustomUseCase(false);
                      setCustomUseCase("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Select
                  value={formData.use_case}
                  onValueChange={(value) => {
                    if (value === "add-new") {
                      setShowCustomUseCase(true);
                    } else {
                      handleInputChange("use_case", value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What type of help do you offer?" />
                  </SelectTrigger>
                  <SelectContent>
                    {useCaseOptions.map((useCase) => (
                      <SelectItem key={useCase} value={useCase}>
                        {useCase}
                      </SelectItem>
                    ))}
                    {customUseCases.map((useCase) => (
                      <SelectItem key={`custom-${useCase}`} value={useCase}>
                        {useCase}
                      </SelectItem>
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

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Tags/Skills <span className="text-red-500">*</span></Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="UI/UX, JavaScript, Product Strategy, etc. (comma-separated)"
                required
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
