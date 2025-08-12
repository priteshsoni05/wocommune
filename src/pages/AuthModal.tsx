import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: "walker" | "helpanion";
}

export default function AuthModal({ open, onOpenChange, defaultRole = "walker" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"walker" | "helpanion">(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { addRole } = useUserRoles();
  const { updateProfile } = useProfile();
  const { toast } = useToast();

  const handleEmailAuth = async () => {
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Welcome back!", description: `Logged in as ${role}` });
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;

        await addRole(role);

        if (role === "helpanion" && username) {
          await updateProfile({ username, last_active_role: "helpanion" });
        } else {
          await updateProfile({ last_active_role: "walker" });
        }

        toast({
          title: "Verify your email",
          description: "We've sent you a confirmation link to activate your account."
        });
      }
      onOpenChange(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "linkedin_oidc") => {
    setLoading(true);
    try {
      const redirectPath = role === "helpanion" ? "/helpanion-dashboard" : "/walker-dashboard";
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}${redirectPath}` }
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Sign In" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {mode === "login" ? "Access your WOCommune account" : "Join the WOCommune community"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4 space-y-4">
            <Button variant="outline" className="w-full" onClick={() => handleOAuth("google")} disabled={loading}>
              <Mail className="w-4 h-4 mr-2" /> Continue with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleOAuth("linkedin_oidc")} disabled={loading}>
              <LogIn className="w-4 h-4 mr-2" /> Continue with LinkedIn
            </Button>

            <div className="relative">
              <Separator className="w-full" />
              <span className="absolute left-1/2 -top-3 bg-background px-2 text-xs transform -translate-x-1/2">
                Or with Email
              </span>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleEmailAuth} disabled={loading}>
              {loading ? "Please wait..." : "Sign In"}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            {role === "helpanion" && (
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleEmailAuth} disabled={loading}>
              {loading ? "Please wait..." : "Create Account"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
