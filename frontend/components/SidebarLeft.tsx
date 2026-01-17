import React, { useState } from 'react';

const SidebarLeft: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hasMinor, setHasMinor] = useState(true);
  const [hasSecondMajor, setHasSecondMajor] = useState(false);
  const [hasExchange, setHasExchange] = useState(true);

  return (
    <div className="relative z-20 shrink-0 h-full flex items-start">
      {/* Sidebar Container */}
      <div 
        className={`h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${isOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 border-none'}`}
      >
        <div className="w-80 flex flex-col h-full"> {/* Inner fixed width container to prevent layout shifting during collapse */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Plan Constraints</h2>
            <button className="text-slate-400 hover:text-primary hover:rotate-90 transition-all duration-300">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {/* Form Group */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Year of Admission</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8 cursor-pointer hover:border-slate-300 transition-colors outline-none font-medium">
                    <option>AY24/25</option>
                    <option>AY23/24</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Faculty</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8 cursor-pointer hover:border-slate-300 transition-colors outline-none font-medium">
                    <option>School of Computing</option>
                    <option>College of Humanities and Sciences</option>
                    <option>School of Business</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Primary Major</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8 cursor-pointer hover:border-slate-300 transition-colors outline-none font-medium">
                    <option>Computer Science</option>
                    <option>Information Systems</option>
                    <option>Computer Engineering</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Focus Area / Specialisation</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8 cursor-pointer hover:border-slate-300 transition-colors outline-none font-medium">
                    <option>Artificial Intelligence</option>
                    <option>Database Systems</option>
                    <option>Networking</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            {/* Toggles */}
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">2nd Major?</label>
                    <button 
                        onClick={() => setHasSecondMajor(!hasSecondMajor)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${hasSecondMajor ? 'bg-green-500' : 'bg-slate-200'}`}
                    >
                        <span className={`${hasSecondMajor ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                    </button>
                </div>
                {hasSecondMajor && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Select 2nd Major...</option>
                      <option>Mathematics</option>
                      <option>Management</option>
                      <option>Economics</option>
                    </select>
                  </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700">Minor(s)</label>
                        <button 
                            onClick={() => setHasMinor(!hasMinor)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${hasMinor ? 'bg-green-500' : 'bg-slate-200'}`}
                        >
                            <span className={`${hasMinor ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                        </button>
                    </div>
                    
                    {hasMinor && (
                       <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                          <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Select Minor...</option>
                            <option selected>Public Health</option>
                            <option>Management</option>
                            <option>Interactive Media</option>
                          </select>
                        </div>
                    )}
                </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700">Exchange Program (SEP)?</label>
                        <button 
                            onClick={() => setHasExchange(!hasExchange)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${hasExchange ? 'bg-green-500' : 'bg-slate-200'}`}
                        >
                            <span className={`${hasExchange ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                        </button>
                    </div>
                    {hasExchange && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
                           <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Target Semester</label>
                             <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/20">
                               <option>Year 3 Semester 1</option>
                               <option selected>Year 3 Semester 2</option>
                               <option>Year 4 Semester 1</option>
                             </select>
                           </div>
                        </div>
                    )}
                </div>
            </div>
          </div>
          
          <div className="p-5 border-t border-slate-100 bg-white">
            <button className="w-full bg-accent hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all text-sm active:scale-95">
                Generate Study Plan
            </button>
          </div>
        </div>
      </div>

      {/* Full Height Toggle Bar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-full bg-white border-r border-y border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all duration-300 z-50 focus:outline-none border-l-0 group ${isOpen ? 'w-3.5' : 'w-8'}`}
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <div className="h-12 w-1 bg-slate-300 rounded-full group-hover:bg-slate-400 transition-colors"></div>
      </button>
    </div>
  );
};

export default SidebarLeft;