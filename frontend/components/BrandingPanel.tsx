import React from 'react';

const BrandingPanel: React.FC = () => {
  return (
    <div className="w-full md:w-5/12 bg-nus-blue flex flex-col justify-center items-center p-12 text-white relative overflow-hidden min-h-[40vh] md:min-h-screen">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] border-4 border-white rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] border-2 border-white rounded-full"></div>
      </div>
      
      <div className="z-10 flex flex-col items-center max-w-md text-center">
        <div className="mb-8">
          <div className="size-20 bg-white p-4 rounded-xl shadow-2xl flex items-center justify-center text-nus-blue">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>
        <h1 className="text-5xl font-black mb-4 tracking-tight font-display flex">
          <span className="text-primary">NUS</span>
          <span className="text-white">Planner</span>
        </h1>
        <p className="text-xl font-light opacity-90 leading-relaxed font-display">
          Your NUS degree, planned correctly.
        </p>
        <div className="mt-12 h-1 w-24 bg-primary rounded-full"></div>
      </div>
    </div>
  );
};

export default BrandingPanel;
