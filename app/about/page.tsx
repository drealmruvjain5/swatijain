import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif text-forest mb-6">About the Author</h1>
        <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-parchment shadow-sm relative">
          <Image src="/swati-jain.jpeg" alt="Swati Jain" fill className="object-cover" priority />
        </div>
      </header>
      
      <div className="text-lg text-charcoal font-serif leading-relaxed space-y-6">
        <p>
          Welcome to my quiet corner of the internet. I have spent most of my life observing the gentle rhythms of the world—the way light filters through old trees, the unspoken words between friends, and the profound silence that follows a storm.
        </p>
        <p>
          Here, I share my thoughts, memories, and reflections. Some take the shape of poetry, capturing fleeting moments before they dissolve. Others are essays and stories, exploring the deeper undercurrents of our shared human experience.
        </p>
        <p>
          I write in both English and Hindi, honoring the two linguistic currents that have shaped my understanding of the world. Thank you for visiting, and I hope you find something here that resonates with your own journey.
        </p>

        <hr className="border-parchment my-8" />
        
        <div>
          <h2 className="text-2xl font-serif text-forest mb-4">Connect with me</h2>
          <div className="flex flex-wrap gap-4 text-base font-sans">
            <a href="#" className="px-6 py-3 bg-parchment text-forest rounded-full hover:bg-[#eae2d3] transition-colors border border-[#eae2d3]">
              Instagram Handle
            </a>
            <a href="#" className="px-6 py-3 bg-parchment text-forest rounded-full hover:bg-[#eae2d3] transition-colors border border-[#eae2d3]">
              Twitter / X Handle
            </a>
            <a href="#" className="px-6 py-3 bg-parchment text-forest rounded-full hover:bg-[#eae2d3] transition-colors border border-[#eae2d3]">
              Facebook Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
