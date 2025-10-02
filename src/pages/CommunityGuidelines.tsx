import { Footer } from '@/components/common/Footer';
import GlobalHeader from '@/components/common/GlobalHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePersistence } from '@/hooks/useRolePersistence';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Profile = {
  id?: string;
  user_id?: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  status?: string | null;
  created_at?: string | null;
};

const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

const deriveFirstName = (profile: any, user: any) => {
  const meta = user?.user_metadata || {};
  const candidates = [
    profile?.display_name,
    meta.given_name,
    meta.full_name || meta.name,
  ].filter(Boolean) as string[];

  if (candidates.length) {
    const first = String(candidates[0]).trim().split(/\s+/)[0];
    return titleCase(first);
  }

  if (user?.email) {
    const local = user.email.split('@')[0];
    const first = local.split(/[._-]+/)[0];
    return titleCase(first);
  }

  return 'Friend';
};

export default function CommunityGuidelines() {
  const { user, signOut } = useAuth();
  const { clearRoleData, getDashboardPath, hasValidRole } = useRolePersistence();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, avatar_url, created_at')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
    };

    loadProfile();
  }, [user]);

  const displayName = useMemo(() => deriveFirstName(profile, user), [profile, user]);

  const avatarContent = useMemo((): { type: 'image' | 'initial'; value: string } => {
    if (profile?.avatar_url) return { type: 'image' as const, value: profile.avatar_url };
    const initial = (profile?.display_name?.[0] || user?.email?.[0] || 'U').toUpperCase();
    return { type: 'initial' as const, value: initial };
  }, [profile, user]);

  const dashboardPath = useMemo(() => {
    if (!user) return '/wo-commune';
    if (!hasValidRole) {
      return '/helpanion-dashboard';
    }
    return getDashboardPath();
  }, [user, hasValidRole, getDashboardPath]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalHeader
        user={user}
        displayName={displayName}
        avatarContent={avatarContent}
        dashboardPath={dashboardPath}
        clearRoleData={clearRoleData}
        signOut={signOut}
        navigate={navigate}
      />

      <div className="h-8 md:h-10" />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Community Guidelines</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8">
            Welcome to Commune.
          </p>
          
          <p className="text-gray-700 mb-8">
            We're building a space where people can connect with honesty, empathy, and safety. To keep it meaningful, here are the non-negotiables:
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Respect First</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Treat every conversation as you'd want to be treated — with kindness, patience, and dignity.</li>
              <li>No hate speech, discrimination, bullying, or harassment of any kind.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Privacy Matters</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Respect the confidentiality of conversations.</li>
              <li>Do not record, screenshot, or share personal stories without explicit consent.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Authenticity Over Noise</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Be yourself. No impersonations, fake accounts, or misleading information.</li>
              <li>Spam, solicitation, or unrelated promotions are not allowed.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Safe and Supportive Space</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Handle sensitive topics (mental health, finances, relationships, etc.) with care.</li>
              <li>If you feel unsafe, report immediately — our team will act swiftly.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Zero Tolerance for Abuse</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Any form of sexual harassment, exploitation, abuse, or inappropriate conduct will result in immediate and permanent removal, with potential legal action.</li>
              <li>Harmful, explicit, or unlawful behavior of any kind will not be tolerated.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Action and Belonging</h2>
            <p className="text-gray-700">
              Commune isn't just for talking; it's for growing. Share, listen, and inspire action in yourself and others.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Enforcement Policy</h2>
            <p className="text-gray-700 mb-6">
              We take these guidelines seriously. Here's how we act:
            </p>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Minor Violations (e.g., spamming, off-topic promotion):</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>1st Strike → Warning.</li>
                <li>2nd Strike → Temporary suspension.</li>
                <li>3rd Strike → Permanent removal.</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Severe Violations (e.g., hate speech, harassment, threats, sexual misconduct, illegal activity):</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Immediate and permanent removal without warning.</li>
                <li>Escalation to legal authorities if required.</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Commitment</h2>
            <p className="text-gray-700 mb-4">
              We promise to protect your safety, privacy, and dignity. In return, we ask you to honor the community and help us create a space where belonging thrives.
            </p>
            <p className="text-gray-700 font-medium">
              Because at the end of the day, we're all walking this Odyssey together.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
