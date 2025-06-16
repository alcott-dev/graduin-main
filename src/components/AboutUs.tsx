import { Target, Award, Heart } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To simplify the university application process and make higher education accessible to all students across South Africa.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We believe in transparency, accessibility, and empowering students to make informed decisions about their future.',
    },
    {
      icon: Award,
      title: 'Our Impact',
      description: 'Helping thousands of students find their perfect university match and secure their place in higher education.',
    },
  ];

  const handleGetStarted = () => {
    // Navigate to home page
    window.dispatchEvent(new CustomEvent('changePage', { detail: 'home' }));
  };

  return (
    <div className="flex-1 md:ml-16 min-h-screen pt-20 md:pt-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Who We Are</h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-slate-600 mb-8">
              GraduIn.com is a company that was founded on the idea that technology has the ability to help make the lives of many people easier and more efficient. We recognized that the process of applying to multiple universities and institutions can be overwhelming, time-consuming, and stressful for students and their families.
            </p>
            <p className="text-lg text-slate-600">
              Our platform streamlines this process by allowing students to apply to multiple institutions with a single application, saving time and reducing the complexity of pursuing higher education in South Africa.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of students who have simplified their university application process with Graduin.</p>
          <button 
            onClick={handleGetStarted}
            className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;