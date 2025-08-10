import React, { useEffect } from "react";

const About: React.FC = () => {
  useEffect(() => {
    document.title = "About – Walker's Odyssey";
    const desc = "About us, mission, vision, and brand story of Walker's Odyssey.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/about";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto py-12 space-y-8">
        <h1>About Walker's Odyssey</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h2>About Us</h2>
            <p className="text-muted-foreground">We’re building a warm, human-first space that connects walkers with guidance, community, and inspiration.</p>
          </article>
          <article>
            <h2>Mission</h2>
            <p className="text-muted-foreground">To help people walk their path with purpose through supportive tools, gatherings, and experienced helpanions.</p>
          </article>
          <article>
            <h2>Vision</h2>
            <p className="text-muted-foreground">A world where everyone finds their way with confidence, compassion, and community.</p>
          </article>
          <article>
            <h2>Brand Story</h2>
            <p className="text-muted-foreground">Walker's Odyssey began as a simple idea: journeys are better together. Our brand reflects calm, clarity, and companionship.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default About;
