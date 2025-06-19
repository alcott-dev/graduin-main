import { useState, useEffect } from 'react';
import { Search, Filter, Building, MapPin, Users, GraduationCap, ShoppingCart, University, School, BookOpen } from 'lucide-react';
import ApplicationForm from './ApplicationForm';
import { useApplicationCart } from '../contexts/ApplicationCartContext';

const Institutions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const { cartItems } = useApplicationCart();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch institutions from JSON file
    fetch('/graduin-instituions.json')
      .then(response => response.json())
      .then(data => setInstitutions(data))
      .catch(error => console.error('Error fetching institutions:', error));
  }, []);

  const institutionTypes = [
    { id: 'traditional', title: 'Traditional Universities', count: '20 institutions', color: 'bg-blue-500', icon: University },
    { id: 'technology', title: 'Universities of Technology', count: '6 institutions', color: 'bg-green-500', icon: Building },
    { id: 'private', title: 'Private Institutions', count: '25 institutions', color: 'bg-purple-500', icon: School },
  ];

  const searchSuggestions = institutions.filter(institution =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.categories.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.categories.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || institution.categories.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  const handleViewDetails = (institution: any) => {
    // Convert institution data to match expected format
    const formattedInstitution = {
      id: institution.name.toLowerCase().replace(/\s+/g, '-'),
      name: institution.name,
      location: 'South Africa', // Default location
      type: institution.categories.replace('Category:', '').trim(),
      students: '10,000+', // Default student count
      established: '1900', // Default establishment year
      applicationFee: parseFloat(institution.price.replace('R', '').replace(',', '')) || 0,
      courses: institution.description.split('Qualifications Offered Summary List:')[1]?.split(/[A-Z][a-z]+ [A-Z]/) || ['Various Programs'],
      requirements: ['Matric Certificate', 'Application Form', 'Supporting Documents'],
      deadlines: ['Application Deadline: Check with institution']
    };
    
    setSelectedInstitution(formattedInstitution);
    setIsApplicationFormOpen(true);
  };

  const handleSuggestionClick = (institution: any) => {
    setSearchTerm(institution.name);
    setShowSearchSuggestions(false);
  };

  const handleQuickAccessClick = (item: string) => {
    switch (item) {
      case 'Student Accommodation':
        window.dispatchEvent(new CustomEvent('changePage', { detail: 'accommodation' }));
        break;
      case 'Course Finder':
        window.dispatchEvent(new CustomEvent('changePage', { detail: 'course-finder' }));
        break;
      case 'Private Institutions':
        setSelectedType('private');
        break;
      case 'Traditional Universities':
        setSelectedType('traditional');
        break;
      case 'Universities of Technology':
        setSelectedType('technology');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex-1 md:ml-24 min-h-screen pt-20 md:pt-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold gradient-text mb-4">South African Institutions</h1>
            <p className="text-slate-600">Discover and apply to universities and institutions across South Africa through our comprehensive platform</p>
          </div>
          {cartItems.length > 0 && (
            <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
              <ShoppingCart size={20} />
              <span className="font-medium">{cartItems.length} in cart</span>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search institutions by name, location, or program..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => searchTerm.length > 0 && setShowSearchSuggestions(true)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            {/* Search Suggestions */}
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-60 overflow-y-auto">
                {searchSuggestions.slice(0, 5).map((institution, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(institution)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-slate-800">{institution.name}</div>
                    <div className="text-sm text-slate-500">{institution.categories}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Types</option>
              <option value="traditional">Traditional Universities</option>
              <option value="technology">Universities of Technology</option>
              <option value="private">Private Institutions</option>
            </select>
          </div>
        </div>

        {/* Institution Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Browse by Institution Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {institutionTypes.map((type) => (
              <div 
                key={type.id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 card-hover cursor-pointer"
                onClick={() => setSelectedType(type.id)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mb-4 flex items-center justify-center">
                  <type.icon className="text-purple-600" size={24} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{type.title}</h3>
                <p className="text-slate-500 text-sm">{type.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="mb-12" id="results-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {searchTerm || selectedType ? `Search Results (${filteredInstitutions.length})` : 'All Institutions'}
            </h2>
            {(searchTerm || selectedType) && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setShowSearchSuggestions(false);
                }}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((institution, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden card-hover cursor-pointer">
                <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
                  <img 
                    src="https://i.postimg.cc/qBWMRGX3/education.png" 
                    alt={institution.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="absolute top-3 right-3">
                    <Building className="text-purple-600" size={20} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-800 mb-2">{institution.name}</h3>
                  <div className="space-y-2 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Building size={16} />
                      <span>{institution.categories.replace('Category:', '').trim()}</span>
                    </div>
                    <div className="text-lg font-bold text-purple-600">
                      Application Fee: {institution.price}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-3">
                      {institution.description.split('Qualifications Offered Summary List:')[0]}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(institution)}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    View Details & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No institutions found matching your search criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setShowSearchSuggestions(false);
                }}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear search and view all institutions
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Student Accommodation', 'Course Finder', 'Private Institutions', 'Traditional Universities', 'Universities of Technology'].map((link, index) => (
              <button 
                key={index} 
                onClick={() => handleQuickAccessClick(link)}
                className="p-4 text-center hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <BookOpen className="text-purple-600" size={20} />
                </div>
                <span className="text-sm text-slate-600 font-medium">{link}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        selectedInstitution={selectedInstitution}
      />
    </div>
  );
};

export default Institutions;