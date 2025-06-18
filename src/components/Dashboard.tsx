import { Search, ArrowRight, Building, BookOpen, Bed, FileText, Bot, Users, GraduationCap, Clock, ClipboardCheck, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AIAssistant from './AIAssistant';
import CareerAssessmentModal from './CareerAssessmentModal';
import ApplicationTrackingModal from './ApplicationTrackingModal';
import FullApplicationModal from './FullApplicationModal';
import PropertyModal from './PropertyModal';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard = ({ onPageChange }: DashboardProps) => {
  const [showAI, setShowAI] = useState(false);
  const [showCareerAssessment, setShowCareerAssessment] = useState(false);
  const [showApplicationTracking, setShowApplicationTracking] = useState(false);
  const [showFullApplication, setShowFullApplication] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  const logos = [
    'https://i.postimg.cc/SRHmN1Qg/img-702.png',
    'https://i.postimg.cc/Hs7pPm3R/img-987.png',
    'https://i.postimg.cc/yxDVKCKJ/img-cnbc-africa.png',
    'https://i.postimg.cc/HWNY2n0b/img-disrupt-africa.png',
    'https://i.postimg.cc/9MFmxqNY/img-enca.png',
    'https://i.postimg.cc/9fBXtB1f/img-hopealive.png',
    'https://i.postimg.cc/B6YqRQr9/img-vuuqa.png'
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch properties from JSON file
    fetch('/graduin-properties.json')
      .then(response => response.json())
      .then(data => setFeaturedProperties(data.slice(0, 4)))
      .catch(error => console.error('Error fetching properties:', error));

    // Logo carousel auto-rotation
    const logoInterval = setInterval(() => {
      setCurrentLogoIndex(prev => (prev + 4) % logos.length);
    }, 3000);

    return () => clearInterval(logoInterval);
  }, []);

  const actionCards = [
    { 
      id: 'career-assessment', 
      title: 'Take Assessment Test', 
      icon: ClipboardCheck,
      description: 'Discover your career path',
      isNew: true,
      buttonColor: 'bg-gradient-to-r from-emerald-400 to-teal-400'
    },
    { 
      id: 'course-finder', 
      title: 'Course Finder', 
      icon: BookOpen,
      description: 'Find your perfect course',
      isNew: false,
      buttonColor: 'bg-gradient-to-r from-blue-400 to-indigo-400'
    },
    { 
      id: 'institutions', 
      title: 'Universities', 
      icon: Building,
      description: 'Browse universities',
      isNew: false,
      buttonColor: 'bg-gradient-to-r from-purple-400 to-pink-400'
    },
    { 
      id: 'accommodation', 
      title: 'Accommodation', 
      icon: Bed,
      description: 'Find student housing',
      isNew: false,
      buttonColor: 'bg-gradient-to-r from-orange-400 to-red-400'
    },
    { 
      id: 'ai-assistant', 
      title: 'AI Assistant', 
      icon: Bot,
      description: 'Get instant help',
      isNew: true,
      buttonColor: 'bg-gradient-to-r from-cyan-400 to-blue-400'
    },
  ];

  const searchSuggestions = [
    { type: 'course', title: 'Computer Science', category: 'Technology' },
    { type: 'course', title: 'Medicine', category: 'Health Sciences' },
    { type: 'institution', title: 'University of Cape Town', category: 'Traditional University' },
    { type: 'institution', title: 'University of Witwatersrand', category: 'Traditional University' },
    { type: 'accommodation', title: 'Student Housing Johannesburg', category: 'Accommodation' },
    { type: 'accommodation', title: 'Cape Town Student Residence', category: 'Accommodation' },
  ];

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (id: string) => {
    if (id === 'course-finder' || id === 'institutions' || id === 'accommodation') {
      onPageChange(id);
    } else if (id === 'career-assessment') {
      setShowCareerAssessment(true);
    } else if (id === 'track') {
      setShowApplicationTracking(true);
    } else if (id === 'application') {
      setShowFullApplication(true);
    } else if (id === 'ai-assistant') {
      setShowAI(true);
    } else {
      console.log(`Selected ${id}`);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onPageChange('institutions');
    }
    setShowSearchSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchTerm(suggestion.title);
    setShowSearchSuggestions(false);
    if (suggestion.type === 'course') {
      onPageChange('course-finder');
    } else if (suggestion.type === 'institution') {
      onPageChange('institutions');
    } else if (suggestion.type === 'accommodation') {
      onPageChange('accommodation');
    }
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
  };

  const getCurrentLogos = () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push(logos[(currentLogoIndex + i) % logos.length]);
    }
    return result;
  };

  return (
    <div className="flex-1 md:ml-24 min-h-screen">
      {/* Main Header */}
      <div className="pt-20 md:pt-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text animate-fade-in">
          Launch Your Future - It Begins Here!
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8">
          <button 
            onClick={() => setShowCareerAssessment(true)}
            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm md:text-base"
          >
            <span>📋</span> Take Assessment
          </button>
          <button 
            onClick={() => onPageChange('course-finder')}
            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-purple-100 text-purple-700 rounded-full font-medium text-sm md:text-base"
          >
            <span>🎓</span> Find Courses
          </button>
          <button 
            onClick={() => onPageChange('institutions')}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors text-sm md:text-base"
          >
            <span>🏫</span> Universities
          </button>
          <button 
            onClick={() => onPageChange('accommodation')}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors text-sm md:text-base"
          >
            <span>🏠</span> Accommodation
          </button>
          <button 
            onClick={() => setShowAI(true)}
            className="relative flex items-center gap-2 px-3 md:px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors text-sm md:text-base border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-border rounded-full"
            style={{
              background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6) border-box',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
            }}
          >
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded text-xs font-bold">New</span>
            AI Assistant
          </button>
        </div>

        {/* Search Bar with Glow Effect */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search courses, universities, or accommodation..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchSuggestions(e.target.value.length > 0);
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => searchTerm.length > 0 && setShowSearchSuggestions(true)}
              className="w-full pl-12 pr-16 py-4 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg focus:shadow-purple-500/25 transition-all duration-300"
              style={{
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ArrowRight size={20} className="text-slate-600" />
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSearchSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-slate-800">{suggestion.title}</div>
                  <div className="text-sm text-slate-500">{suggestion.category}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* As Featured On Section */}
      <div className="px-6 mb-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-slate-600 mb-6">As Featured On</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
            <div className="flex items-center justify-center gap-8 md:gap-12 transition-transform duration-1000 ease-in-out">
              {getCurrentLogos().map((logo, index) => (
                <img 
                  key={`${currentLogoIndex}-${index}`}
                  src={logo} 
                  alt={`Featured Logo ${index + 1}`} 
                  className="h-12 md:h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {actionCards.map((card) => (
            <div
              key={card.id}
              className="relative group cursor-pointer"
              onClick={() => handleCardClick(card.id)}
            >
              <div className="aspect-square bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 card-hover">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mb-2 md:mb-4 mx-auto flex items-center justify-center">
                  <card.icon className="text-purple-600" size={16} />
                </div>
                <h3 className="font-medium text-slate-700 text-center text-xs md:text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-slate-500 text-center mb-2">{card.description}</p>
                <div className={`${card.buttonColor} text-white text-xs px-2 py-1 rounded-full text-center font-medium`}>
                  {card.title}
                </div>
                {card.isNew && (
                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    New
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Properties */}
      <div className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Featured Properties</h2>
            <button 
              onClick={() => onPageChange('accommodation')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <div 
                key={property.title} 
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden card-hover cursor-pointer"
                onClick={() => handlePropertyClick(property)}
              >
                <div className="aspect-[4/3] bg-cover bg-center relative" style={{backgroundImage: `url(${property.image})`}}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  {property.tag && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      {property.tag}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-slate-800 mb-1 text-sm">{property.title}</h3>
                  <p className="text-xs text-slate-500 mb-2">{property.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-purple-600">{property.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
      {showCareerAssessment && <CareerAssessmentModal onClose={() => setShowCareerAssessment(false)} />}
      {showApplicationTracking && <ApplicationTrackingModal onClose={() => setShowApplicationTracking(false)} />}
      {showFullApplication && <FullApplicationModal onClose={() => setShowFullApplication(false)} />}
      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;