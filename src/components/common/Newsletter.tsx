export function Newsletter() {
  const PINE = "#193232";
  
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-2xl p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="text-center md:text-left">
            <h4 className="text-base md:text-xl font-bold text-gray-900 mb-1">Walk with us</h4>
            <p className="text-sm md:text-base" style={{ color: "#193232" }}>Stories, guidance, and events — straight to your inbox.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <a
              href="https://wocommune.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              Subscribe on Substack
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}