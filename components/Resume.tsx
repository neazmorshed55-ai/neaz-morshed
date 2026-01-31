
import React from 'react';
import { RESUME_EXPERIENCE } from '../constants';

const Resume: React.FC = () => {
  return (
    <section id="resume" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-3xl font-bold relative inline-block">
            RESUME
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600"></span>
          </h2>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all shadow-md">
            DOWNLOAD CV
          </button>
        </div>

        <div className="space-y-12">
          {RESUME_EXPERIENCE.map((exp, idx) => (
            <div key={exp.id} className="flex flex-col md:flex-row gap-8 relative">
              <div className="md:w-1/4">
                <span className="text-xl font-bold text-blue-600">{exp.year}</span>
              </div>
              <div className="md:w-3/4 pb-12 border-b border-gray-100 last:border-0">
                <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                <h4 className="text-gray-500 font-medium mb-4 uppercase text-sm tracking-widest">{exp.company}</h4>
                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
              </div>
              {/* Timeline dot decoration */}
              <div className="hidden md:block absolute left-[calc(25%-1.25rem)] top-2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-8">Education</h3>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <span className="text-blue-600 font-bold">2014 - 2018</span>
              <span className="font-bold text-lg">University of Design & Arts</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">Master in Visual Communication</h4>
            <p className="text-gray-500 italic">Los Angeles, CA</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
