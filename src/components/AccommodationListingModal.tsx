import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

interface AccommodationListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  // Personal Details
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  
  // Property Details
  propertyName: string;
  address: string;
  city: string;
  province: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  description: string;
  amenities: string[];
  photoUrls: string[];
  
  // Subscription
  selectedTier: 'basic' | 'standard' | 'premium' | null;
}

const AccommodationListingModal = ({ isOpen, onClose }: AccommodationListingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    propertyName: '',
    address: '',
    city: '',
    province: '',
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    price: 0,
    description: '',
    amenities: [],
    photoUrls: [],
    selectedTier: null
  });

  const tiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: 149,
      features: [
        '1 listing allowed',
        'Basic contact details (email or WhatsApp only)',
        'Limited photo uploads (up to 5)',
        'No visibility boost'
      ],
      target: 'Small landlords'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 349,
      features: [
        'Up to 3 listings',
        'Full contact info access',
        'More photos (up to 10)',
        'Google Maps location integration',
        'Moderate visibility boost'
      ],
      target: 'Owners with multiple rooms'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 699,
      features: [
        'Up to 10 listings',
        'All Standard features included',
        'Verified Badge',
        'Video upload or virtual tour',
        'Enhanced visibility (top 10%)',
        'Featured in email marketing'
      ],
      target: 'Student complex managers'
    }
  ];

  const amenitiesList = [
    'Wi-Fi', 'Parking', 'Security', 'Laundry', 'Kitchen', 'Study Area',
    'Pool', 'Gym', 'Air Conditioning', 'Heating', 'Garden', 'Balcony'
  ];

  const provinces = [
    'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
    'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
  ];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const submissionData = {
      ...formData,
      uploadedPhotos: formData.photoUrls.join(', '),
      amenitiesList: formData.amenities.join(', '),
      submissionDate: new Date().toISOString(),
      _subject: 'Property Listing Application - Graduin',
      _captcha: 'false'
    };

    try {
      await fetch('https://formsubmit.co/submissions@graduin.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentRedirect = () => {
    const paymentUrls = {
      basic: 'https://payment.payfast.io/eng/process?cmd=_paynow&receiver=13208346&item_name=Basic+Listing+Subscription&email_confirmation=1&confirmation_address=submissions@graduin.app&return_url=https://graduin.app&amount=149&subscription_type=1&recurring_amount=149&cycles=0&frequency=3',
      standard: 'https://payment.payfast.io/eng/process?cmd=_paynow&receiver=13208346&item_name=Standard+Listing+Subscription&email_confirmation=1&confirmation_address=submissions@graduin.app&return_url=https://graduin.app&amount=349&subscription_type=1&recurring_amount=349&cycles=0&frequency=3',
      premium: 'https://payment.payfast.io/eng/process?cmd=_paynow&receiver=13208346&item_name=Premium+Listing+Subscription&email_confirmation=1&confirmation_address=submissions@graduin.app&return_url=https://graduin.app&amount=699&subscription_type=1&recurring_amount=699&cycles=0&frequency=3'
    };

    if (formData.selectedTier && paymentUrls[formData.selectedTier]) {
      window.open(paymentUrls[formData.selectedTier], '_blank');
    }
    
    onClose();
  };

  // Loading overlay
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-800">Submitting Application...</h3>
          <p className="text-slate-600 mt-2">Please wait while we process your listing application.</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Check className="text-green-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Application Submitted!</h3>
            <p className="text-slate-600 mb-6">Your property listing application has been submitted successfully! Please proceed to payment to activate your listing.</p>
            
            <div className="space-y-3">
              <button
                onClick={handlePaymentRedirect}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Proceed to Payment (R{formData.selectedTier ? tiers.find(t => t.id === formData.selectedTier)?.price : 0})
              </button>
              <button
                onClick={onClose}
                className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Choose Your Subscription Tier</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    formData.selectedTier === tier.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, selectedTier: tier.id as any }))}
                >
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-slate-800">{tier.name}</h4>
                    <p className="text-3xl font-bold text-purple-600">R{tier.price}</p>
                    <p className="text-sm text-slate-500">per month</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check size={16} className="text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-600 italic">Best for: {tier.target}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Personal Information & Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ID Number *</label>
                <input
                  type="text"
                  required
                  value={formData.idNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Property Listing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Name *</label>
                <input
                  type="text"
                  required
                  value={formData.propertyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyName: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Price (ZAR) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Province *</label>
                <select
                  required
                  value={formData.province}
                  onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Property Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                        } else {
                          setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Property Photos *</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6">
                <FileUploaderRegular
                  sourceList="local, camera, facebook, gdrive"
                  filesViewMode="grid"
                  gridShowFileNames={true}
                  classNameUploader="uc-purple"
                  pubkey="82dd7ec1dfce34a06bc3"
                  onCommonUploadSuccess={(e) => {
                    const urls = e.detail.successEntries.map(entry => entry.cdnUrl);
                    setFormData(prev => ({ ...prev, photoUrls: [...prev.photoUrls, ...urls] }));
                  }}
                />
                {formData.photoUrls.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.photoUrls.length} photos uploaded</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-slate-800">List Your Property</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      currentStep > step ? 'bg-purple-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {currentStep > 1 ? 'Previous' : 'Cancel'}
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && !formData.selectedTier}
                className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="button-primary"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationListingModal;