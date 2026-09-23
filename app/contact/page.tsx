export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 w-full flex-1 text-center">
      <h1 className="text-4xl font-serif text-forest mb-6">Contact</h1>
      <p className="text-lg text-charcoal-light font-sans mb-10">
        If you would like to reach out regarding my writings, you may do so via email.
      </p>
      
      <div className="bg-parchment p-8 rounded-lg border border-[#eae2d3] mb-12">
        <h2 className="text-xl font-serif text-charcoal mb-4">Email</h2>
        <a 
          href="mailto:author@example.com" 
          className="text-2xl md:text-3xl font-serif text-forest hover:text-forest-dark transition-colors"
        >
          author@example.com
        </a>
      </div>

      <div>
        <h2 className="text-2xl font-serif text-forest mb-6">Social Handles</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#" className="px-6 py-3 bg-white text-forest rounded shadow-sm hover:shadow transition-shadow border border-parchment">
            @instagram_handle
          </a>
          <a href="#" className="px-6 py-3 bg-white text-forest rounded shadow-sm hover:shadow transition-shadow border border-parchment">
            @twitter_handle
          </a>
        </div>
      </div>
    </div>
  );
}
