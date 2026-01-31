
import React from 'react';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">LATEST PROJECTS</h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-500 max-w-xl mx-auto">
            A selection of my recent works ranging from mobile applications to global branding projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/40 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white text-black px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all">
                    VIEW PROJECT
                  </span>
                </div>
              </div>
              <div className="p-8">
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">{project.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-4 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="border-2 border-black px-10 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-all">
            LOAD MORE
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
