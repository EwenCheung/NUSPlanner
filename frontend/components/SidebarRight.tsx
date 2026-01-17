import React from 'react';

interface SidebarRightProps {
  isOpen: boolean;
  toggle: () => void;
  onAddModule: () => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ isOpen, toggle, onAddModule }) => {
  return (
    <div className="relative z-30 shrink-0 h-full flex items-start">
        {/* Toggle Handle */}
        <button 
            onClick={toggle}
            className="h-full w-3.5 bg-white border-l border-y border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors z-50 focus:outline-none border-r-0 group absolute left-0 top-0 -translate-x-full"
            title={isOpen ? "Collapse AI Assistant" : "Expand AI Assistant"}
        >
            <div className="h-12 w-1 bg-slate-300 rounded-full group-hover:bg-slate-400 transition-colors"></div>
        </button>

        <aside className={`h-full bg-white border-l border-slate-200 shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${isOpen ? 'w-[420px]' : 'w-0 border-none'}`}>
            <div className="w-[420px] flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                <h2 className="text-sm font-bold uppercase tracking-wider">AI Assistant</h2>
                </div>
                <button onClick={toggle} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-[20px]">close_fullscreen</span>
                </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
                
                {/* Dummy History: User Message */}
                <div className="flex gap-4 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-orange-100 border border-white shadow-sm overflow-hidden shrink-0">
                        <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1.5 flex-1 flex flex-col items-end">
                        <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-sm">
                            Hi, I need help planning my modules for Year 2.
                        </div>
                    </div>
                </div>

                {/* Dummy History: Bot Message */}
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                    <div className="space-y-1.5 flex-1">
                        <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 leading-relaxed shadow-sm border border-slate-200">
                           Sure! Could you tell me which focus area or specialisation you are interested in?
                        </div>
                    </div>
                </div>

                 {/* Dummy History: User Message */}
                 <div className="flex gap-4 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-orange-100 border border-white shadow-sm overflow-hidden shrink-0">
                        <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
                    </div>
                     <div className="space-y-1.5 flex-1 flex flex-col items-end">
                        <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-sm">
                            I'm planning to specialise in Artificial Intelligence.
                        </div>
                    </div>
                </div>

                {/* Current Bot Message */}
                <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="space-y-1.5 flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Planner AI</div>
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 leading-relaxed shadow-sm border border-slate-200">
                        Hello! Based on your focus area in <strong className="text-slate-900">Artificial Intelligence</strong>, I recommend taking CS3243 early.
                    </div>
                </div>
                </div>

                {/* Module Recommendation Card */}
                <div className="ml-12 relative group">
                {/* Connecting Line (visual hack) */}
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-slate-200 -z-10"></div>

                <div className="bg-white rounded-xl border border-primary/20 shadow-sm overflow-hidden p-1 space-y-1">
                    <div className="p-3 pb-2 flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-bold text-primary">CS3243: Intro to AI</h3>
                            <p className="text-xs text-slate-500 mt-0.5">4 Units | Prereq: CS2040S</p>
                        </div>
                        <button className="text-primary hover:text-primary/80">
                            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                        </button>
                    </div>

                    {/* Card Image */}
                    <div className="mx-3 h-32 rounded-lg bg-slate-900 overflow-hidden relative">
                        <img 
                            src="https://picsum.photos/400/200?grayscale" 
                            alt="AI Visualization" 
                            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    {/* Action Button */}
                    <div className="p-3">
                        <button 
                            onClick={onAddModule}
                            className="w-full bg-primary hover:bg-blue-900 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-[16px]">add_circle</span>
                            Add to Plan (Y2S2)
                        </button>
                    </div>
                </div>
                </div>

                {/* Charts Section */}
                <div className="ml-12 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <span className="material-symbols-outlined text-[18px] text-primary">bar_chart</span>
                        Workload Distribution
                    </div>
                    
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        {/* Chart Item 1 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-slate-500 uppercase">Lecture/Tutorial</span>
                                <span className="font-bold text-slate-800">3 hrs/wk</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[35%] rounded-full"></div>
                            </div>
                        </div>
                        {/* Chart Item 2 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-slate-500 uppercase">Project / Lab</span>
                                <span className="font-bold text-slate-800">4 hrs/wk</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[45%] rounded-full"></div>
                            </div>
                        </div>
                        {/* Chart Item 3 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-slate-500 uppercase">Self-Study</span>
                                <span className="font-bold text-slate-800">5 hrs/wk</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary/60 w-[55%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags Section */}
                <div className="ml-12 space-y-2">
                    <h4 className="text-xs font-bold text-slate-700">Review Sentiment</h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-wide border border-blue-100">Heavy Workload</span>
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide border border-slate-200">Amazing Prof</span>
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide border border-slate-200">Math Intensive</span>
                    </div>
                </div>

            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Ask about module mapping or workload..." 
                        className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-blue-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px] filled">send</span>
                    </button>
                </div>
            </div>
            </div>
        </aside>
    </div>
  );
};

export default SidebarRight;