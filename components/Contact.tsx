
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold mb-8 relative inline-block">
              CONTACT
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600"></span>
            </h2>
            <p className="text-gray-600 mb-12">
              Looking for a creative partner for your next project? Let's talk about how we can work together.
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2">Phone</h4>
                <p className="text-lg">123-456-7890</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2">Email</h4>
                <p className="text-lg">hello@mayanelson.com</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2">Follow Me</h4>
                <div className="flex gap-4 mt-2">
                  {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map(social => (
                    <a key={social} href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                      <span className="sr-only">{social}</span>
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">First Name *</label>
                  <input type="text" className="w-full bg-white border-b-2 border-gray-200 focus:border-blue-600 outline-none px-0 py-3 transition-colors" required />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name *</label>
                  <input type="text" className="w-full bg-white border-b-2 border-gray-200 focus:border-blue-600 outline-none px-0 py-3 transition-colors" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                  <input type="email" className="w-full bg-white border-b-2 border-gray-200 focus:border-blue-600 outline-none px-0 py-3 transition-colors" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                  <input type="text" className="w-full bg-white border-b-2 border-gray-200 focus:border-blue-600 outline-none px-0 py-3 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                  <textarea rows={4} className="w-full bg-white border-b-2 border-gray-200 focus:border-blue-600 outline-none px-0 py-3 transition-colors resize-none"></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button className="bg-blue-600 text-white px-12 py-4 rounded-full font-bold hover:bg-black transition-all shadow-xl">
                    SEND MESSAGE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
