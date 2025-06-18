import { useState } from 'react';
import { X, CheckCircle, Mail } from 'lucide-react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

interface FullApplicationModalProps {
  onClose: () => void;
}

const FullApplicationModal = ({ onClose }: FullApplicationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    idNumber: '',
    passportNumber: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    homeLanguage: '',
    
    // Contact Details
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    
    // Next of Kin
    kinName: '',
    kinRelationship: '',
    kinPhone: '',
    kinEmail: '',
    kinAddress: '',
    
    // Academic Information
    schoolName: '',
    matricYear: '',
    matricResults: '',
    apsScore: '',
    subjects: '',
    
    // Study Preferences
    preferredCourse1: '',
    preferredCourse2: '',
    preferredCourse3: '',
    studyMode: '',
    
    // Financial Information
    paymentMethod: '',
    financialAid: '',
    
    // Institution Selection
    selectedInstitutions: [] as string[],
    
    // Documents
    documentUrls: [] as string[]
  });

  const southAfricanInstitutions = [
    // Traditional Universities
    'University of Cape Town (UCT)',
    'University of the Witwatersrand (Wits)',
    'University of Pretoria (UP)',
    'Stellenbosch University',
    'University of KwaZulu-Natal (UKZN)',
    'Rhodes University',
    'University of the Free State (UFS)',
    'North-West University (NWU)',
    'University of Limpopo (UL)',
    'University of Fort Hare',
    'University of Zululand',
    'University of Venda',
    'Sol Plaatje University',
    'University of Mpumalanga',
    
    // Universities of Technology
    'Cape Peninsula University of Technology (CPUT)',
    'Tshwane University of Technology (TUT)',
    'Durban University of Technology (DUT)',
    'Vaal University of Technology (VUT)',
    'Central University of Technology (CUT)',
    'Mangosuthu University of Technology (MUT)',
    'Walter Sisulu University (WSU)',
    
    // TVET Colleges
    'Boland TVET College',
    'Buffalo City TVET College',
    'Capricorn TVET College',
    'Central Johannesburg TVET College',
    'College of Cape Town TVET',
    'Eastcape Midlands TVET College',
    'Ekurhuleni East TVET College',
    'Ekurhuleni West TVET College',
    'False Bay TVET College',
    'Flavius Mareka TVET College',
    'Gert Sibande TVET College',
    'Goldfields TVET College',
    'Ikhala TVET College',
    'Ingwe TVET College',
    'King Hintsa TVET College',
    'King Sabata Dalindyebo TVET College',
    'Lephalale TVET College',
    'Letaba TVET College',
    'Lovedale TVET College',
    'Majuba TVET College',
    'Maluti TVET College',
    'Mnambithi TVET College',
    'Mopani South East TVET College',
    'Motheo TVET College',
    'Nkangala TVET College',
    'Northern Cape Rural TVET College',
    'Northern Cape Urban TVET College',
    'Northlink TVET College',
    'Orbit TVET College',
    'Port Elizabeth TVET College',
    'Sekhukhune TVET College',
    'South Cape TVET College',
    'South West Gauteng TVET College',
    'Southern Cape TVET College',
    'Taletso TVET College',
    'Thekwini TVET College',
    'Umfolozi TVET College',
    'Umgungundlovu TVET College',
    'University of Johannesburg TVET College',
    'Vhembe TVET College',
    'Waterberg TVET College',
    'West Coast TVET College',
    'Western Cape TVET College',
    
    // Private Institutions
    'AFDA (The South African School of Motion Picture Medium and Live Performance)',
    'Boston City Campus',
    'CTI Education Group',
    'Damelin',
    'Eduvos',
    'IIE (The Independent Institute of Education)',
    'Inscape Design College',
    'Milpark Education',
    'Monash South Africa',
    'Pearson Institute of Higher Education',
    'Regent Business School',
    'Richfield Graduate Institute',
    'STADIO Higher Education',
    'The Design School Southern Africa',
    'Varsity College',
    'Vega School'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleInstitutionToggle = (institution: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInstitutions: prev.selectedInstitutions.includes(institution)
        ? prev.selectedInstitutions.filter(i => i !== institution)
        : [...prev.selectedInstitutions, institution]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submissionData = {
        ...formData,
        uploadedDocuments: formData.documentUrls.join(', '),
        selectedInstitutionsList: formData.selectedInstitutions.join(', '),
        submissionDate: new Date().toISOString(),
        _subject: 'Full University Application - Graduin',
        _captcha: 'false'
      };

      const response = await fetch('https://formsubmit.co/submissions@graduin.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        alert('There was an error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };

  const handleEmailDocuments = () => {
    const subject = encodeURIComponent('University Application Documents - ' + formData.firstName + ' ' + formData.lastName);
    const body = encodeURIComponent(`Dear Graduin Team,

Please find attached my certified digital copies of documents for my university application.

Applicant Details:
Name: ${formData.firstName} ${formData.lastName}
ID/Passport: ${formData.idNumber || formData.passportNumber}
Email: ${formData.email}
Phone: ${formData.phone}

Selected Institutions: ${formData.selectedInstitutions.join(', ')}

Uploaded Documents: ${formData.documentUrls.join(', ')}

Best regards,
${formData.firstName} ${formData.lastName}`);
    
    window.open(`mailto:submissions@graduin.app?subject=${subject}&body=${body}`);
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Application Submitted!</h3>
            <p className="text-slate-600 mb-6">Your application has been successfully submitted. Please email your certified documents using the button below.</p>
            
            <div className="space-y-3">
              <button
                onClick={handleEmailDocuments}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                <Mail size={20} />
                Email Documents
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
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
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Passport Number</label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nationality *</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Home Language *</label>
                <input
                  type="text"
                  name="homeLanguage"
                  value={formData.homeLanguage}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Details & Next of Kin</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-700 mb-4">Your Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Province *</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-slate-700 mb-4">Next of Kin Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="kinName"
                    value={formData.kinName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Relationship *</label>
                  <select
                    name="kinRelationship"
                    value={formData.kinRelationship}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Relationship</option>
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="sibling">Sibling</option>
                    <option value="spouse">Spouse</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="kinPhone"
                    value={formData.kinPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="kinEmail"
                    value={formData.kinEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Previous School Name *</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">APS Score</label>
                <input
                  type="number"
                  name="apsScore"
                  value={formData.apsScore}
                  onChange={handleInputChange}
                  min="0"
                  max="42"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Study Mode Preference</label>
                <select
                  name="studyMode"
                  value={formData.studyMode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Study Mode</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="distance">Distance Learning</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Matric Subjects & Results</label>
                <textarea
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="e.g., Mathematics: 75%, English: 80%, Physical Science: 70%..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-slate-700 mb-4">Course Preferences</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Choice Course *</label>
                  <input
                    type="text"
                    name="preferredCourse1"
                    value={formData.preferredCourse1}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Second Choice Course</label>
                  <input
                    type="text"
                    name="preferredCourse2"
                    value={formData.preferredCourse2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Third Choice Course</label>
                  <input
                    type="text"
                    name="preferredCourse3"
                    value={formData.preferredCourse3}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash/Self-funded</option>
                  <option value="loan">Student Loan</option>
                  <option value="bursary">Bursary</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="nsfas">NSFAS</option>
                  <option value="company">Company Sponsored</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Financial Aid Required</label>
                <select
                  name="financialAid"
                  value={formData.financialAid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Option</option>
                  <option value="yes">Yes, I need financial aid</option>
                  <option value="no">No, I don't need financial aid</option>
                  <option value="partial">Partial financial aid needed</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Select Institutions</h3>
            <p className="text-slate-600 mb-4">Select all institutions you would like to apply to (multiple selections allowed):</p>
            
            <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-xl p-4">
              <div className="grid grid-cols-1 gap-2">
                {southAfricanInstitutions.map((institution, index) => (
                  <label key={index} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedInstitutions.includes(institution)}
                      onChange={() => handleInstitutionToggle(institution)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700">{institution}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {formData.selectedInstitutions.length > 0 && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Selected Institutions ({formData.selectedInstitutions.length}):</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedInstitutions.map((institution, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {institution}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Document Upload</h3>
            <p className="text-slate-600 mb-4">
              Upload your certified digital copies of documents here.
            </p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8">
              <FileUploaderRegular
                sourceList="local, camera, facebook, gdrive"
                filesViewMode="grid"
                gridShowFileNames={true}
                classNameUploader="uc-purple"
                pubkey="82dd7ec1dfce34a06bc3"
                onCommonUploadSuccess={(e) => {
                  const urls = e.detail.successEntries.map(entry => entry.cdnUrl);
                  setFormData(prev => ({ ...prev, documentUrls: [...prev.documentUrls, ...urls] }));
                }}
              />
            </div>

            {formData.documentUrls.length > 0 && (
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">Uploaded Documents:</h4>
                <ul className="space-y-1">
                  {formData.documentUrls.map((url, index) => (
                    <li key={index} className="text-sm text-green-700">
                      ✓ Document {index + 1}: {url}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Required Documents:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• ID/Passport copy</li>
                <li>• Matric Certificate</li>
                <li>• Academic Transcripts</li>
                <li>• Proof of Address</li>
              </ul>
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
          <h2 className="text-2xl font-bold text-slate-800">University Application</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step}
                  </div>
                  {step < 6 && (
                    <div className={`w-8 h-0.5 mx-1 ${
                      currentStep > step ? 'bg-purple-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {currentStep > 1 ? 'Previous' : 'Cancel'}
            </button>
            
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FullApplicationModal;