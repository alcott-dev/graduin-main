import { useState, useEffect } from 'react';
import { X, MapPin, Wifi, Car, Shield, Bed, ExternalLink } from 'lucide-react';

interface PropertyModalProps {
  property: any;
  onClose: () => void;
}

const PropertyModal = ({ property, onClose }: PropertyModalProps) => {
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Set property data directly from props
    setPropertyData({
      ...property,
      description: property.description || `Beautiful student accommodation located in ${property.address || property.location}. This property offers excellent amenities and is perfect for students looking for comfortable and affordable housing.`,
      images: property.gallery || [property.image],
      amenities: property.features || ['Wi-Fi', 'Security', 'Furnished']
    });
    setLoading(false);
  }, [property]);

  const nextImage = () => {
    if (propertyData?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyData.images.length);
    }
  };

  const prevImage = () => {
    if (propertyData?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length);
    }
  };

  const handleViewFullGallery = () => {
    if (propertyData.link) {
      window.open(propertyData.link, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-4"></div>
            <div className="h-64 bg-slate-200 rounded mb-4"></div>
            <div className="h-4 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-slate-800">{propertyData.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Property Images Gallery */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-full h-64 rounded-xl overflow-hidden">
                <img 
                  src={propertyData.images[currentImageIndex]} 
                  alt={propertyData.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {propertyData.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    ←
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    →
                  </button>
                </>
              )}
            </div>
            
            {/* Gallery thumbnails and View Full Gallery button */}
            <div className="flex items-center justify-between mt-4">
              {propertyData.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto flex-1">
                  {propertyData.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${propertyData.title} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${
                        index === currentImageIndex ? 'ring-2 ring-purple-500' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
              
              {propertyData.link && (
                <button
                  onClick={handleViewFullGallery}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors ml-4"
                >
                  <ExternalLink size={16} />
                  View Full Gallery
                </button>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-slate-500" />
                <span className="text-slate-600">{propertyData.address || 'Address unavailable'}</span>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-slate-800 mb-2">Price</h3>
                <p className="text-2xl font-bold text-purple-600">{propertyData.price}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {propertyData.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                    {amenity === 'Wi-Fi' && <Wifi size={16} />}
                    {amenity === 'Security' && <Shield size={16} />}
                    {amenity === 'Parking' && <Car size={16} />}
                    {amenity === 'Furnished' && <Bed size={16} />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-800 mb-3">Description</h3>
            <p className="text-slate-600 leading-relaxed">{propertyData.description}</p>
          </div>

          {/* Google Maps */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-800 mb-3">Location</h3>
            {propertyData.mapEmbed ? (
              <div 
                className="w-full h-64 rounded-xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: propertyData.mapEmbed }}
              />
            ) : (
              <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">Map view of {propertyData.address || 'Address unavailable'}</p>
                  <p className="text-xs text-slate-400 mt-1">Interactive map would be integrated here</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
              +27 82 899 8535
            </button>
            <button className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
              Save Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;