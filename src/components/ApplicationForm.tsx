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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
    financialAid: 'no'
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

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.phone && 
           formData.idNumber && 
           formData.dateOfBirth && 
           formData.address && 
           formData.city && 
           formData.province && 
           formData.postalCode && 
           formData.guardianName && 
           formData.guardianPhone && 
           formData.guardianEmail && 
           formData.previousSchool && 
           formData.matricYear && 
           formData.preferredCourse1 && 
           documentUrls.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields and upload your documents.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const totalFee = cartItems.length > 0 ? getTotalFee() : selectedInstitution?.applicationFee || 0;
      const institutions = cartItems.length > 0 ? cartItems : [selectedInstitution];
      
      const applicationData = {
        ...formData,
        institutions: institutions.map(inst => inst?.name).join(', '),
        institutionTypes: institutions.map(inst => inst?.type).join(', '),
        totalApplicationFee: totalFee,
        uploadedDocuments: documentUrls.join(', '),
        submissionDate: new Date().toISOString(),
        applicationId: `APP-${Date.now()}`,
        _subject: 'University Application Submission - Graduin',
        _captcha: 'false'
      };

      const response = await fetch('https://formsubmit.co/submissions@graduin.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        if (totalFee === 0) {
          // Free application - show success popup
          setShowSuccess(true);
        } else {
          // Paid application - proceed to payment
          setShowPaymentForm(true);
        }
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', idNumber: '',
      dateOfBirth: '', address: '', city: '', province: '', postalCode: '',
      guardianName: '', guardianPhone: '', guardianEmail: '', previousSchool: '',
      matricYear: '', matricResults: '', preferredCourse1: '', preferredCourse2: '',
      preferredCourse3: '', motivation: '', accommodation: 'no', financialAid: 'no'
    });
    setDocumentUrls([]);
  };

  const handlePayment = () => {
    const totalFee = cartItems.length > 0 ? getTotalFee() : selectedInstitution?.applicationFee || 0;
    const institutionNames = cartItems.length > 0 
      ? cartItems.map(item => item.name).join(', ')
      : selectedInstitution?.name || '';

    // Create PayFast payment form
    const form = document.createElement('form');
    form.action = 'https://www.payfast.co.za/eng/process';
    form.method = 'post';
    form.target = '_blank';

    const fields = {
      merchant_id: '13208346',
      merchant_key: 'xux5xm3dc4fec',
      return_url: 'https://graduin.app/success',
      cancel_url: 'https://graduin.app/cancelled',
      notify_url: 'https://graduin.app/api/payfast-notify',
      amount: totalFee.toFixed(2),
      item_name: `University Application Fee - ${institutionNames}`,
      name_first: formData.firstName,
      name_last: formData.lastName,
      email_address: formData.email
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

    clearCart();
    resetForm();
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    clearCart();
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Loading overlay
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-800">Submitting Application...</h3>
          <p className="text-slate-600 mt-2">Please wait while we process your application.</p>
        </div>
      </div>
    );
  }

  // Success modal for free applications
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Application Received!</h3>
            <p className="text-slate-600 mb-6">We have received your application. Since the application fee is free, no payment is required.</p>
            <button
              onClick={handleSuccessClose}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment form modal
  if (showPaymentForm) {
    const totalFee = cartItems.length > 0 ? getTotalFee() : selectedInstitution?.applicationFee || 0;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Payment Required</h3>
          <p className="text-slate-600 mb-6">
            Your application has been submitted successfully. Please proceed to payment to complete your application.
          </p>
          <div className="mb-6">
            <p className="text-lg font-semibold text-purple-600">
              Total Amount: R{totalFee}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPaymentForm(false)}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  <p className="text-lg font-semibold text-purple-600 mt-2">Application Fee: R{selectedInstitution.applicationFee}</p>
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
                <p className="font-semibold text-lg">Total Application Fee: R{getTotalFee()}</p>
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
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Course Preferences</h4>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">ID Document Upload *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6">
                  <FileUploaderRegular
                    sourceList="local, camera"
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
                    <div className="mt-4">
                      <p className="text-sm text-green-600 mb-2">✓ {documentUrls.length} document(s) uploaded</p>
                      <div className="space-y-1">
                        {documentUrls.map((url, index) => (
                          <p key={index} className="text-xs text-slate-500 truncate">Document {index + 1}: {url}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">Please upload a clear copy of your ID document or passport</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Need Accommodation?</label>
                <select
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
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
                disabled={!isFormValid() || isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : `Submit Application (R${cartItems.length > 0 ? getTotalFee() : selectedInstitution?.applicationFee || 0})`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;