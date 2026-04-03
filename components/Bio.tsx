import Image from 'next/image';

const CONTACT_LINKS = [
  { id: 'instagram', href: 'https://instagram.com', src: '/instagram.png', text: 'Instagram', isExternal: true },
  { id: 'facebook', href: 'https://facebook.com', src: '/facebook.png', text: 'Facebook', isExternal: true },
  { id: 'github', href: 'https://github.com', src: '/github.png', text: 'Github', isExternal: true },
  { id: 'email', href: 'mailto:', src: '/gmail.png', text: 'Email', isExternal: false },
  { id: 'phone', href: 'tel:', src: '/phone.png', text: '+44 1234 567888', isExternal: false },
];

const BioSection = () => (
    <>
      {/* Bio Text */}
      <p className="text-slate-700 leading-relaxed text-sm md:text-base mb-4">
        Template for a photo album. A visual diary of the moments, people, and places we hold dear.
      </p>

      {/* Socials / Contact List */}
      <ul className="flex flex-col gap-2">
        {CONTACT_LINKS.map((link) => (
          <li key={link.id}>
            <a 
              href={link.href} 
              // Security and UX handling for external vs internal links
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
            >
              {/* Note: alt="" is perfectly correct here because the text next to it describes the link! */}
              <Image src={link.src} alt="" height={30} width={30} />
              <span className="text-blue-600 font-medium">{link.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );


export default function Bio() {
  return (
    <section className="w-full mx-auto p-4 bg-white text-slate-900">
      <div className="flex flex-row items-start gap-4 md:gap-8">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border border-slate-200">
            <Image 
              src="/pfp.png" 
              alt="Happy" 
              fill 
              priority 
              className="w-full h-full object-cover" 
              sizes="(max-width: 768px) 80px, 128px"
            />
          </div>
        </div>

        {/* Desktop Wrapper */}
        <div className="flex flex-col flex-grow">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Happy</h1>
            <p className="text-slate-500 text-sm">Full Stack Developer</p>
          </div>
          {/* Desktop Bio: Appears to the right of avatar */}
          <div className="hidden md:block mt-4">
            <BioSection />
          </div>
        </div>
      </div>

      {/* Mobile Bio: Appears below the avatar/name row */}
      <div className="block md:hidden mt-6">
        <BioSection />
      </div>
    </section>
  );
}