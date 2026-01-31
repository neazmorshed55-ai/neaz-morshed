
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-gray-100 bg-white">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <p className="text-gray-500 text-sm">© 2024 by Maya Nelson.</p>
          <p className="text-gray-400 text-xs mt-1">Created with React & Tailwind</p>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</span>
            <span className="text-sm font-medium">123-456-7890</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
            <span className="text-sm font-medium">hello@mayanelson.com</span>
          </div>
        </div>
        
        <div className="flex gap-4">
          {['LinkedIn', 'Dribbble', 'Behance'].map(social => (
            <a key={social} href="#" className="text-sm font-bold hover:text-blue-600 transition-colors uppercase tracking-widest">
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
