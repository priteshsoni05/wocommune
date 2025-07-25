import { Profile } from "@/hooks/useProfile";

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection = ({ profile }: AboutSectionProps) => {
  const detailedBio = profile.bio || 
    `Hello! I'm ${profile.display_name || 'a dedicated professional'} with years of experience helping individuals and businesses achieve their goals. I believe in providing personalized guidance and support to help you overcome challenges and reach your full potential.

Whether you're looking to advance your career, develop new skills, or solve specific problems, I'm here to provide the expertise and mentorship you need. My approach is collaborative, practical, and focused on delivering real results.

I'm passionate about sharing knowledge and helping others succeed. Let's work together to turn your challenges into opportunities for growth and success.`;

  return (
    <section className="py-12 border-b border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
          About {profile.display_name?.split(' ')[0] || 'Me'}
        </h2>
        <div className="prose prose-lg max-w-none text-muted-foreground">
          {detailedBio.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};