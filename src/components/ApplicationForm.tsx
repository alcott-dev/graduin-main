import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, Upload } from 'lucide-react';
import { useApplicationCart } from '../contexts/ApplicationCartContext';
import { useToast } from '@/hooks/use-toast';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInstitution?: {
    id: string;
    name: string;
    location: string;
    type: string;
    students: string;
    established: string;
    applicationFee: number;
    courses: string[];
    requirements: string[];
    deadlines: string[];
  } | null;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ isOpen, onClose, selectedInstitution }) => {
  const { cartItems, addToCart, removeFromCart, clearCart, getTotalFee } = useApplicationCart();
  const { toast } = useToast();
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    previousSchool: '',
    matricYear: '',
    matricResults: '',
    preferredCourse1: '',
    preferredCourse2: '',
    preferredCourse3: '',
    motivation: '',
    accommodation: 'no',
    financialAid: 'no',
    studyMode: 'fulltime'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddToCart = () => {
    if (selectedInstitution) {
      addToCart({
        id: selectedInstitution.id,
        name: selectedInstitution.name,
        location: selectedInstitution.location,
        type: selectedInstitution.type,
        applicationFee: selectedInstitution.applicationFee
      });
      toast({
        title: "Added to Application Cart",
        description: `${selectedInstitution.name} has been added to your application cart.`,
      });
    }
  };

  const calculateDynamicAmount = () => {
    let baseAmount = cartItems.length > 0 ? getTotalFee() : selectedInstitution?.applicationFee || 0;
    
    // Add study mode fee
    if (formData.studyMode === 'fulltime') {
      baseAmount += 500; // Additional processing fee for full-time
    } else if (formData.studyMode === 'parttime') {
      baseAmount += 300; // Additional processing fee for part-time
    }
    
    // Add accommodation fee if needed
    if (formData.accommodation === 'yes') {
      baseAmount += 200; // Accommodation processing fee
    }
    
    return baseAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAmount = calculateDynamicAmount();
    const institutions = cartItems.length > 0 ? cartItems : [selectedInstitution];
    
    // Prepare form data for FormSubmit
    const submissionData = {
      // Hidden fields for FormSubmit configuration
      _captcha: 'false',
      _template: 'table',
      _next: 'https://graduin.app/thank-you',
      _subject: 'University Application Submission - Graduin',
      
      // Application data
      full_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      id_number: formData.idNumber,
      date_of_birth: formData.dateOfBirth,
      address: `${formData.address}, ${formData.city}, ${formData.province}, ${formData.postalCode}`,
      guardian_name: formData.guardianName,
      guardian_phone: formData.guardianPhone,
      guardian_email: formData.guardianEmail,
      previous_school: formData.previousSchool,
      matric_year: formData.matricYear,
      matric_results: formData.matricResults,
      preferred_course_1: formData.preferredCourse1,
      preferred_course_2: formData.preferredCourse2,
      preferred_course_3: formData.preferredCourse3,
      motivation: formData.motivation,
      study_mode: formData.studyMode,
      accommodation_needed: formData.accommodation,
      financial_aid_needed: formData.financialAid,
      institutions: institutions.map(inst => inst?.name).join(', '),
      institution_types: institutions.map(inst => inst?.type).join(', '),
      total_application_fee: totalAmount,
      uploaded_documents: documentUrls.join(', '),
      submission_date: new Date().toISOString(),
      application_id: `APP-${Date.now()}`
    };

    try {
      // Create a form element for FormSubmit
      const form = document.createElement('form');
      form.action = 'https://formsubmit.co/submissions@graduin.app';
      form.method = 'POST';
      form.target = '_blank';
      form.style.display = 'none';

      // Add all form fields
      Object.entries(submissionData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      // Submit to FormSubmit
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // Show success message
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully. Redirecting to payment...",
      });

      // Redirect to PayFast after a short delay
      setTimeout(() => {
        redirectToPayFast(totalAmount, institutions);
      }, 2000);

      // Clear form and close modal
      clearCart();
      resetForm();
      onClose();

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const redirectToPayFast = (amount: number, institutions: any[]) => {
    const institutionNames = institutions.map(inst => inst?.name || '').join(', ');
    
    // PayFast credentials (using the ones already in your code)
    const merchantId = '13208346';
    const merchantKey = 'xux5xm3dc4fec';
    
    // Create PayFast form
    const form = document.createElement('form');
    form.action = 'https://www.payfast.co.za/eng/process';
    form.method = 'post';
    form.style.display = 'none';

    const fields = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: 'https://graduin.app/payment-success',
      cancel_url: 'https://graduin.app/payment-cancelled',
      notify_url: 'https://graduin.app/api/payfast-notify',
      amount: amount.toFixed(2),
      item_name: `University Application Fee - ${institutionNames}`,
      item_description: `Application processing fee for ${institutionNames}`,
      name_first: formData.firstName,
      name_last: formData.lastName,
      email_address: formData.email,
      cell_number: formData.phone
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', idNumber: '',
      dateOfBirth: '', address: '', city: '', province: '', postalCode: '',
      guardianName: '', guardianPhone: '', guardianEmail: '', previousSchool: '',
      matricYear: '', matricResults: '', preferredCourse1: '', preferredCourse2: '',
      preferredCourse3: '', motivation: '', accommodation: 'no', financialAid: 'no',
      studyMode: 'fulltime'
    });
    setDocumentUrls([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {selectedInstitution ? `Apply to ${selectedInstitution.name}` : 'Application Form'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {selectedInstitution && (
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{selectedInstitution.name}</h3>
                  <p className="text-slate-600">{selectedInstitution.location} • {selectedInstitution.type}</p>
                  <p className="text-sm text-slate-500">Students: {selectedInstitution.students} • Established: {selectedInstitution.established}</p>
                  <p className="text-lg font-semibold text-purple-600 mt-2">Base Application Fee: R{selectedInstitution.applicationFee}</p>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Available Courses</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {selectedInstitution.courses.map((course, index) => (
                      <li key={index}>• {course}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Requirements</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {selectedInstitution.requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Application Cart ({cartItems.length} institutions)
              </h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3 mb-2">
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.location} • R{item.applicationFee}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <p className="font-semibold text-lg">Base Total: R{getTotalFee()}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Province *</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Province</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="North West">North West</option>
                  <option value="Western Cape">Western Cape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Guardian/Parent Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Guardian Name *</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Guardian Phone *</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Guardian Email *</label>
                  <input
                    type="email"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Previous School *</label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Matric Year *</label>
                  <input
                    type="number"
                    name="matricYear"
                    value={formData.matricYear}
                    onChange={handleInputChange}
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Matric Results/APS Score</label>
                <input
                  type="text"
                  name="matricResults"
                  value={formData.matricResults}
                  onChange={handleInputChange}
                  placeholder="e.g., APS: 35, Mathematics: 70%, English: 65%"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Study Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Study Mode *</label>
                  <select
                    name="studyMode"
                    value={formData.studyMode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="fulltime">Full-time (+R500 processing fee)</option>
                    <option value="parttime">Part-time (+R300 processing fee)</option>
                    <option value="distance">Distance Learning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Need Accommodation?</label>
                  <select
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (+R200 processing fee)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Choice Course *</label>
                  <input
                    type="text"
                    name="preferredCourse1"
                    value={formData.preferredCourse1}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Second Choice Course</label>
                  <input
                    type="text"
                    name="preferredCourse2"
                    value={formData.preferredCourse2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Third Choice Course</label>
                  <input
                    type="text"
                    name="preferredCourse3"
                    value={formData.preferredCourse3}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Document Upload</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Required Documents *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6">
                  <FileUploaderRegular
                    sourceList="local, camera, facebook, gdrive"
                    filesViewMode="grid"
                    gridShowFileNames={true}
                    classNameUploader="uc-purple"
                    pubkey="82dd7ec1dfce34a06bc3"
                    onCommonUploadSuccess={(e) => {
                      const urls = e.detail.successEntries.map(entry => entry.cdnUrl);
                      setDocumentUrls(prev => [...prev, ...urls]);
                    }}
                  />
                  {documentUrls.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">✓ {documentUrls.length} document(s) uploaded</p>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">Please upload: ID document, Matric certificate, Academic transcripts</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Motivation Letter</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={4}
                placeholder="Please explain why you want to study at this institution and your career goals..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Need Financial Aid?</label>
              <select
                name="financialAid"
                value={formData.financialAid}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {/* Dynamic Amount Display */}
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Total Application Fee</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Application Fee:</span>
                  <span>R{cartItems.length > 0 ? getTotalFee() : selectedInstitution?.applicationFee || 0}</span>
                </div>
                {formData.studyMode === 'fulltime' && (
                  <div className="flex justify-between">
                    <span>Full-time Processing Fee:</span>
                    <span>R500</span>
                  </div>
                )}
                {formData.studyMode === 'parttime' && (
                  <div className="flex justify-between">
                    <span>Part-time Processing Fee:</span>
                    <span>R300</span>
                  </div>
                )}
                {formData.accommodation === 'yes' && (
                  <div className="flex justify-between">
                    <span>Accommodation Processing Fee:</span>
                    <span>R200</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-purple-600">R{calculateDynamicAmount()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Submit Application (R{calculateDynamicAmount()})
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;