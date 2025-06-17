import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

interface FooterProps {
  onPageChange?: (page: string) => void;
}

const Footer = ({ onPageChange }: FooterProps) => {
  const mainLinks = [
    { name: 'Home', path: 'home' },
    { name: 'About Us', path: 'about' },
    { name: 'How It Works', path: 'how-it-works' },
    { name: 'Institutions', path: 'institutions' },
    { name: 'Contact Us', path: 'contact' },
  ];
  
  const quickLinks = [
    { name: 'Student Accommodation', path: 'accommodation' },
    { name: 'Course Finder', path: 'course-finder' },
    { name: 'Private Institutions', path: 'institutions', filter: 'private' },
    { name: 'Traditional Universities', path: 'institutions', filter: 'traditional' },
    { name: 'Universities Of Technology', path: 'institutions', filter: 'technology' },
  ];
  
  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/graduin' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/graduin' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/graduin' },
    { name: 'BlueSky (Twitter)', icon: Twitter, url: 'https://twitter.com/graduin' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleLogoClick = () => {
    if (onPageChange) {
      onPageChange('home');
    }
  };

  const handleDeveloperClick = () => {
    window.open('https://alcott.digital/', '_blank');
  };

  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200 py-12 px-6 md:ml-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={handleLogoClick}>
              <img 
                src="https://i.postimg.cc/bwm6H2tP/Graduin-Logo.png" 
                alt="Graduin Logo" 
                className="h-8 w-auto object-contain hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-slate-600 mb-6">
              Simplifying university applications for South African students. Apply to multiple institutions with a single application.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <link.icon size={20} className="text-slate-600" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-4">Navigation</h3>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href="#" 
                    onClick={(e) => handleClick(e, link.path)}
                    className="text-slate-600 hover:text-purple-600 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href="#" 
                    onClick={(e) => handleClick(e, link.path)}
                    className="text-slate-600 hover:text-purple-600 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-4">Newsletter</h3>
            <p className="text-slate-600 mb-4">Subscribe for updates on application deadlines and opportunities.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-1.5 rounded-lg">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm">© 2025 Graduin. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a 
              href="https://policies.google.com/privacy?hl=en-US" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 text-sm"
            >
              Privacy Policy
            </a>
            <a 
              href="https://policies.google.com/terms?hl=en-US" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 text-sm"
            >
              Terms of Service
            </a>
            <a 
              href="https://policies.google.com/technologies/cookies?hl=en-US" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 text-sm"
            >
              Cookie Policy
            </a>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-slate-600 text-sm">Design & Developed by</span>
            <img 
              src="https://i.postimg.cc/SQCV1pJD/Alcott-Web-Space-r0j9urza7a8inxjrrk37iebt7sibve45xz5se48zp4.png" 
              alt="Alcott Digital" 
              className="w-[60px] h-auto object-contain cursor-pointer hover:scale-105 transition-transform"
              onClick={handleDeveloperClick}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;