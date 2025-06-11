
import { FileText, Send, CheckCircle, PlayCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Create Your Profile',
      description: 'Fill out your academic information, personal details, and course preferences once.',
      step: '01'
    },
    {
      icon: Send,
      title: 'Select Institutions',
      description: 'Choose from hundreds of universities and institutions across South Africa.',
      step: '02'
    },
    {
      icon: CheckCircle,
      title: 'Submit Applications',
      description: 'Send your application to multiple institutions with just one click.',
      step: '03'
    }
  ];

  const features = [
    'Single application for multiple institutions',
    'Real-time application tracking',
    'Document management system',
    'Application deadline reminders',
    'Direct communication with institutions',
    'Course recommendation engine'
  ];

  return (
    <div className="flex-1 md:ml-16 min-h-screen pt-20 md:pt-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <span className="hover:text-purple-600 cursor-pointer">Home</span>
          <span>/</span>
          <span className="text-slate-800">How It Works</span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Simple Steps to Apply to Multiple Institutions</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Graduin simplifies the university application process by allowing you to apply to multiple institutions with a single application. Here's how it works:
          </p>
        </div>

        {/* What is Graduin Section */}
        <div className="mb-16 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">What is Graduin?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-slate-600 mb-6">
                Graduin is South Africa's leading university application platform that streamlines the application process for students seeking higher education opportunities.
              </p>
              <p className="text-slate-600 mb-6">
                Our innovative platform eliminates the need to fill out multiple application forms, saving you time and reducing stress during this crucial period of your academic journey.
              </p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <PlayCircle className="text-white" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Watch Our Demo</h3>
              <p className="text-slate-600">See how Graduin works in action</p>
            </div>
          </div>
        </div>

        {/* How to Apply Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How to Apply</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 card-hover">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 mt-4">
                    <step.icon className="text-purple-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Media Section */}
        <div className="mb-16 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Graduin on eNCA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
              <PlayCircle className="text-slate-500" size={64} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Featured on eNCA News</h3>
              <p className="text-lg text-slate-600 mb-6">
                Graduin was featured on eNCA, highlighting our innovative approach to simplifying university applications for South African students.
              </p>
              <p className="text-slate-600 mb-6">
                The feature showcased how our platform is transforming the higher education landscape by making applications more accessible and efficient.
              </p>
              <button className="button-primary">
                <PlayCircle size={20} className="mr-2" />
                Watch Interview
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Applications?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of students who have streamlined their university application process.</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
            Start Your Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
