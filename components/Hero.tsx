
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-50 rounded-full blur-3xl -z-10 opacity-50"></div>

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12 max-w-6xl">
        {/* Left Card */}
        <div className="w-full md:w-1/2 bg-white shadow-[20px_20px_60px_rgba(0,0,0,0.05)] rounded-2xl p-8 md:p-12 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-8 border-4 border-white shadow-lg">
              <img
                src="https://picsum.photos/seed/maya/400/400"
                alt="Maya Nelson"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Maya Nelson</h1>
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <p className="text-lg text-gray-500 font-light tracking-widest uppercase mb-8">Lead UI/UX Designer</p>
            
            <div className="flex gap-4 w-full mt-4">
              <a href="#resume" className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-black transition-colors text-center shadow-lg">RESUME</a>
              <a href="#projects" className="flex-1 border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-all text-center">PROJECTS</a>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 hidden lg:block">
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-xs uppercase tracking-widest font-medium opacity-80">Years Experience</p>
            </div>
          </div>
        </div>

        {/* Right Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-6xl md:text-8xl font-extrabold text-gray-900 leading-tight mb-8">Hello</h2>
          <h3 className="text-2xl font-semibold mb-6">Here's who I am & what I do</h3>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
            I am a results-oriented designer with a passion for creating impactful digital experiences.
            Specializing in UI/UX design, branding, and strategic product development, I help businesses
            connect with their audiences through meaningful design solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
