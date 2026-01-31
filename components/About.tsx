
import React from 'react';
import { SKILLS } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-8 relative inline-block">
              ABOUT ME
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600"></span>
            </h2>
            <p className="text-gray-600 leading-loose mb-6">
              I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.
            </p>
            <p className="text-gray-600 leading-loose mb-8">
              This is a great space to write a long text about your company and your services. You can use this space to go into a little more detail about your company.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-blue-600 mb-2">Philosophy</h4>
                <p className="text-sm text-gray-500">Design is not just what it looks like and feels like. Design is how it works.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-blue-600 mb-2">Process</h4>
                <p className="text-sm text-gray-500">From empathy-driven research to pixel-perfect high fidelity prototypes.</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-8 relative inline-block">
              MY SKILLS
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600"></span>
            </h2>
            <div className="space-y-6">
              {SKILLS.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex flex-wrap gap-4">
              {['Figma', 'Adobe XD', 'Sketch', 'Webflow', 'React', 'Tailwind'].map(tool => (
                <span key={tool} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
