export function Newsletter() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-futura-bold text-foreground mb-4">
          Join Our Newsletter
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Stories, guidance, and events — straight to your inbox.
        </p>
        <a
          href="https://wocommune.substack.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Subscribe on Substack
        </a>
      </div>
    </section>
  );
}