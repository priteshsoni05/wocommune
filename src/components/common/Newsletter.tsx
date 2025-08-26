export function Newsletter() {
  const PINE = "#2C5F50";
  
  return (
    <section className="bg-[#F3F2EE] py-10">
      <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Walk with us
          </h4>
          <p className="text-sm text-gray-700">Stories, guidance, and events — straight to your inbox.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <a
            href="https://wocommune.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2 rounded-md font-semibold"
            style={{ backgroundColor: PINE, color: "#fff" }}
          >
            Subscribe on Substack
          </a>
        </div>
      </div>
    </section>
  );
}