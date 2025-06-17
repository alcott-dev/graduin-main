import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

const GDPRNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('gdpr-accepted');
    if (!hasAccepted) {
      // Show notice after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr-accepted', 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Cookie className="text-purple-600" size={20} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 mb-2">Cookie Notice</h3>
          <p className="text-sm text-slate-600 mb-4">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept", you consent to our use of cookies.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              Accept
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRNotice;