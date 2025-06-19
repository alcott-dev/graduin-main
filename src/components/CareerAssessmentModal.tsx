import { useState } from 'react';
import { X, Download, FileImage, FileText, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CareerAssessmentModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  options: { value: string; label: string; category: string }[];
}

interface Results {
  primaryCareer: string;
  secondaryCareer: string;
  personality: string;
  description: string;
  recommendedFields: string[];
  studyRecommendations: string[];
}

interface UserData {
  nameSurname: string;
  idPassport: string;
  email: string;
  cellphone: string;
  school: string;
}

const CareerAssessmentModal = ({ onClose }: CareerAssessmentModalProps) => {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'assessment', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [userData, setUserData] = useState<UserData>({
    nameSurname: '',
    idPassport: '',
    email: '',
    cellphone: '',
    school: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "What department did you study in high school?",
      options: [
        { value: "sciences", label: "Sciences (Mathematics, Physics, Chemistry, Life Sciences)", category: "STEM" },
        { value: "arts", label: "Arts (Languages, History, Geography)", category: "Humanities" },
        { value: "commerce", label: "Commerce (Business Studies, Economics, Accounting)", category: "Business" },
        { value: "mixed", label: "Mixed subjects from different departments", category: "General" }
      ]
    },
    {
      id: 2,
      question: "Which type of activities do you enjoy most?",
      options: [
        { value: "analytical", label: "Solving complex problems and analyzing data", category: "STEM" },
        { value: "creative", label: "Creating, designing, and expressing ideas", category: "Creative" },
        { value: "social", label: "Helping people and working in teams", category: "Social" },
        { value: "leadership", label: "Leading projects and making decisions", category: "Business" }
      ]
    },
    {
      id: 3,
      question: "What motivates you most in your work?",
      options: [
        { value: "innovation", label: "Creating new solutions and innovations", category: "STEM" },
        { value: "impact", label: "Making a positive impact on society", category: "Social" },
        { value: "success", label: "Achieving financial success and recognition", category: "Business" },
        { value: "expression", label: "Self-expression and artistic fulfillment", category: "Creative" }
      ]
    },
    {
      id: 4,
      question: "How do you prefer to work?",
      options: [
        { value: "independent", label: "Independently with minimal supervision", category: "Independent" },
        { value: "team", label: "In collaborative teams", category: "Social" },
        { value: "structured", label: "In structured, organized environments", category: "Business" },
        { value: "flexible", label: "In flexible, creative environments", category: "Creative" }
      ]
    },
    {
      id: 5,
      question: "What type of challenges excite you?",
      options: [
        { value: "technical", label: "Technical and scientific challenges", category: "STEM" },
        { value: "interpersonal", label: "Understanding and helping people", category: "Social" },
        { value: "strategic", label: "Strategic planning and business growth", category: "Business" },
        { value: "artistic", label: "Creative and artistic challenges", category: "Creative" }
      ]
    },
    {
      id: 6,
      question: "Which subjects did you perform best in?",
      options: [
        { value: "math_science", label: "Mathematics and Sciences", category: "STEM" },
        { value: "languages", label: "Languages and Literature", category: "Humanities" },
        { value: "business_studies", label: "Business Studies and Economics", category: "Business" },
        { value: "arts_culture", label: "Arts and Cultural Studies", category: "Creative" }
      ]
    },
    {
      id: 7,
      question: "What type of environment do you thrive in?",
      options: [
        { value: "laboratory", label: "Laboratories and research facilities", category: "STEM" },
        { value: "office", label: "Professional office environments", category: "Business" },
        { value: "community", label: "Community and social settings", category: "Social" },
        { value: "studio", label: "Creative studios and workshops", category: "Creative" }
      ]
    },
    {
      id: 8,
      question: "What are your long-term career goals?",
      options: [
        { value: "research", label: "Conducting research and making discoveries", category: "STEM" },
        { value: "entrepreneurship", label: "Starting my own business", category: "Business" },
        { value: "service", label: "Serving and helping communities", category: "Social" },
        { value: "artistry", label: "Creating meaningful art and content", category: "Creative" }
      ]
    }
  ];

  const calculateResults = (): Results => {
    const categories: Record<string, number> = {
      STEM: 0,
      Business: 0,
      Social: 0,
      Creative: 0,
      Humanities: 0,
      General: 0,
      Independent: 0
    };

    // Count category preferences
    Object.values(answers).forEach(answer => {
      questions.forEach(q => {
        const option = q.options.find(opt => opt.value === answer);
        if (option) {
          categories[option.category] = (categories[option.category] || 0) + 1;
        }
      });
    });

    // Determine primary and secondary careers
    const sortedCategories = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .filter(([,count]) => count > 0);

    const primaryCategory = sortedCategories[0]?.[0] || 'General';
    const secondaryCategory = sortedCategories[1]?.[0] || 'General';

    const careerMap: Record<string, { career: string; personality: string; description: string; fields: string[]; studies: string[] }> = {
      STEM: {
        career: "Science, Technology, Engineering & Mathematics",
        personality: "Analytical Problem Solver",
        description: "You have a natural aptitude for logical thinking, problem-solving, and working with complex systems. You enjoy understanding how things work and finding innovative solutions.",
        fields: ["Engineering", "Computer Science", "Medicine", "Research", "Data Science", "Biotechnology"],
        studies: ["Bachelor of Engineering", "Bachelor of Science", "Bachelor of Computer Science", "Bachelor of Medicine", "Bachelor of Technology"]
      },
      Business: {
        career: "Business & Entrepreneurship",
        personality: "Strategic Leader",
        description: "You have strong leadership qualities and business acumen. You're motivated by success, enjoy strategic thinking, and have the potential to excel in business environments.",
        fields: ["Business Management", "Finance", "Marketing", "Entrepreneurship", "Consulting", "Economics"],
        studies: ["Bachelor of Commerce", "Bachelor of Business Administration", "Bachelor of Economics", "Bachelor of Accounting", "MBA"]
      },
      Social: {
        career: "Social Services & Human Development",
        personality: "Empathetic Helper",
        description: "You're naturally drawn to helping others and making a positive impact on society. You work well with people and are motivated by meaningful relationships and social change.",
        fields: ["Social Work", "Psychology", "Education", "Healthcare", "Non-profit", "Human Resources"],
        studies: ["Bachelor of Social Work", "Bachelor of Psychology", "Bachelor of Education", "Bachelor of Nursing", "Bachelor of Public Health"]
      },
      Creative: {
        career: "Creative Arts & Design",
        personality: "Innovative Creator",
        description: "You have a strong creative drive and artistic vision. You're motivated by self-expression, innovation, and creating meaningful content that resonates with others.",
        fields: ["Graphic Design", "Media Production", "Architecture", "Fine Arts", "Writing", "Digital Media"],
        studies: ["Bachelor of Fine Arts", "Bachelor of Design", "Bachelor of Architecture", "Bachelor of Media Studies", "Bachelor of Creative Writing"]
      },
      Humanities: {
        career: "Humanities & Liberal Arts",
        personality: "Thoughtful Communicator",
        description: "You excel in communication, critical thinking, and understanding human culture and society. You're drawn to knowledge, research, and meaningful discourse.",
        fields: ["Law", "Journalism", "History", "Philosophy", "Literature", "International Relations"],
        studies: ["Bachelor of Arts", "Bachelor of Laws", "Bachelor of Journalism", "Bachelor of Philosophy", "Bachelor of International Studies"]
      }
    };

    const primaryCareerInfo = careerMap[primaryCategory] || careerMap['General'];
    const secondaryCareerInfo = careerMap[secondaryCategory] || careerMap['General'];

    return {
      primaryCareer: primaryCareerInfo.career,
      secondaryCareer: secondaryCareerInfo.career,
      personality: primaryCareerInfo.personality,
      description: primaryCareerInfo.description,
      recommendedFields: primaryCareerInfo.fields,
      studyRecommendations: primaryCareerInfo.studies
    };
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit user data to formsubmit.co before starting assessment
      const response = await fetch('https://formsubmit.co/submissions@graduin.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          _subject: 'Career Assessment Started - Graduin',
          _captcha: 'false',
          submissionDate: new Date().toISOString()
        })
      });

      if (response.ok) {
        setCurrentStep('assessment');
      } else {
        alert('There was an error submitting your information. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting user data:', error);
      alert('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate results and show them
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setCurrentStep('results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const downloadAsPDF = async () => {
    const element = document.getElementById('results-content');
    if (!element || !results) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('career-assessment-results.pdf');
  };

  const downloadAsImage = async () => {
    const element = document.getElementById('results-content');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const link = document.createElement('a');
    link.download = 'career-assessment-results.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Loading/Success Overlay
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-800">Submitting Information...</h3>
          <p className="text-slate-600 mt-2">Please wait while we process your information.</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
            <h2 className="text-2xl font-bold text-slate-800">Your Career Assessment Results</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          <div id="results-content" className="p-8 bg-white">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-white">🎯</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Congratulations {userData.nameSurname}!</h3>
              <p className="text-lg text-slate-600">Here are your personalized career recommendations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-purple-800 mb-3">Primary Career Path</h4>
                <p className="text-lg font-semibold text-slate-800 mb-2">{results.primaryCareer}</p>
                <p className="text-sm text-slate-600">{results.description}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-green-800 mb-3">Personality Type</h4>
                <p className="text-lg font-semibold text-slate-800 mb-2">{results.personality}</p>
                <p className="text-sm text-slate-600">Secondary path: {results.secondaryCareer}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-4">Recommended Fields</h4>
                <ul className="space-y-2">
                  {results.recommendedFields.map((field, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-700">{field}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-4">Study Recommendations</h4>
                <ul className="space-y-2">
                  {results.studyRecommendations.map((study, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-700">{study}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white text-center">
              <h4 className="text-xl font-bold mb-2">Next Steps</h4>
              <p className="mb-4">Ready to pursue your ideal career path? Explore universities and courses that align with your results!</p>
              <div className="text-sm opacity-90">
                <p>Generated by Graduin Career Assessment • {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            <div className="flex gap-4 justify-center">
              <button
                onClick={downloadAsPDF}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                <FileText size={20} />
                Download as PDF
              </button>
              <button
                onClick={downloadAsImage}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                <FileImage size={20} />
                Download as Image
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'form') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800">Career Assessment - Personal Information</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          <form onSubmit={handleUserFormSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name & Surname *</label>
              <input
                type="text"
                name="nameSurname"
                value={userData.nameSurname}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ID / Passport Number *</label>
              <input
                type="text"
                name="idPassport"
                value={userData.idPassport}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your ID or passport number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Valid Email Address *</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cellphone Number *</label>
              <input
                type="tel"
                name="cellphone"
                value={userData.cellphone}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your cellphone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">School (Previous / Current) *</label>
              <input
                type="text"
                name="school"
                value={userData.school}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your school name"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Start Assessment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Career Assessment Test</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm text-slate-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    answers[currentQuestion] === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option.value}
                    checked={answers[currentQuestion] === option.value}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAssessmentModal;