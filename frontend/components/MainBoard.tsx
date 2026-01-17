import React, { useState, useRef, useMemo } from 'react';
import { AcademicYear, Semester } from '../types';

interface StagedModule {
  id: string;
  code: string;
  type: 'taken' | 'exempted';
  mcs: number;
}

interface MainBoardProps {
  planData: AcademicYear[];
}

// Mock Requirements Data
const REQUIREMENTS = [
    {
        category: "Common Curriculum",
        requiredUnits: 40,
        courses: [
            { code: "CS1101S", title: "Digital Literacy" },
            { code: "ES2660", title: "Critique and Expression" },
            { code: "GEC%", title: "Cultures and Connections" },
            { code: "GEA1000", title: "Data Literacy" },
            { code: "GES%", title: "Singapore Studies" },
            { code: "GEN%", title: "Communities and Engagement" },
        ]
    },
    {
        category: "Computer Science Foundation",
        requiredUnits: 36,
        courses: [
             { code: "CS1231S", title: "Discrete Structures" },
             { code: "CS2030S", title: "Programming Methodology II" },
             { code: "CS2040S", title: "Data Structures & Algos" },
             { code: "CS2100", title: "Computer Organisation" },
             { code: "CS2106", title: "Operating Systems" },
             { code: "CS3230", title: "Design & Analysis of Algorithms" },
        ]
    },
    {
        category: "CS Breadth & Depth",
        requiredUnits: 32,
        courses: [
             { code: "Focus Area 1", title: "Area Primary" },
             { code: "Focus Area 2", title: "Area Primary" },
             { code: "Focus Area 3", title: "Area Primary (4k+)" },
             { code: "Elective 4k+", title: "Computer Science" },
             { code: "Elective 4k+", title: "Computer Science" },
             { code: "Elective 4k+", title: "Computer Science" },
             { code: "Ind. Experience", title: "ATAP / SIP / FYP" },
             { code: "Project/Elective", title: "Team Project / Other" },
        ]
    },
    {
        category: "Math & Sciences",
        requiredUnits: 12,
        courses: [
            { code: "MA1521", title: "Calculus for Computing" },
            { code: "MA1522", title: "Linear Algebra" },
            { code: "ST2334", title: "Probability & Statistics" },
        ]
    },
    {
        category: "Unrestricted Electives",
        requiredUnits: 40,
        courses: [
            { code: "UE 1", title: "General Elective" },
            { code: "UE 2", title: "General Elective" },
            { code: "UE 3", title: "General Elective" },
            { code: "UE 4", title: "General Elective" },
            { code: "UE 5", title: "General Elective" },
            { code: "UE 6", title: "General Elective" },
            { code: "UE 7", title: "General Elective" },
            { code: "UE 8", title: "General Elective" },
            { code: "UE 9", title: "General Elective" },
            { code: "UE 10", title: "General Elective" },
        ]
    }
];

const MainBoard: React.FC<MainBoardProps> = ({ planData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverSemId, setDragOverSemId] = useState<number | null>(null);
  const [addingModuleSemId, setAddingModuleSemId] = useState<number | null>(null);
  
  // Drag to scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingScroll, setIsDraggingScroll] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Bottom panel state
  const [isBottomOpen, setIsBottomOpen] = useState(true);
  const [isBottomExpanded, setIsBottomExpanded] = useState(false);
  
  // Progression Panel State
  const [isProgressionExpanded, setIsProgressionExpanded] = useState(true);

  // Staging Area State
  const [stagedModules, setStagedModules] = useState<StagedModule[]>([
    { id: '1', code: 'CS1010', type: 'taken', mcs: 4 },
    { id: '2', code: 'MA1301', type: 'exempted', mcs: 4 }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [newModuleCode, setNewModuleCode] = useState('');
  const [newModuleType, setNewModuleType] = useState<'taken' | 'exempted'>('taken');

  // Calculations
  const allTakenModules = useMemo(() => {
     const planMods = planData.flatMap(y => y.semesters.flatMap(s => s.modules.map(m => m.code)));
     const stagedMods = stagedModules.map(m => m.code);
     return new Set([...planMods, ...stagedMods]);
  }, [stagedModules, planData]);

  const totalMCs = useMemo(() => {
     return allTakenModules.size * 4; // Simplified: 4 MCs per module
  }, [allTakenModules]);
  
  const GRADUATION_MCS = 160;
  const progressPercent = Math.min(100, Math.round((totalMCs / GRADUATION_MCS) * 100));

  const checkRequirement = (reqCode: string) => {
      if (reqCode.endsWith('%')) {
          // Wildcard check (simplified)
          const prefix = reqCode.slice(0, -1);
          return Array.from(allTakenModules).some(code => code.startsWith(prefix));
      }
      return allTakenModules.has(reqCode);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverSemId(null);
  };

  const handleDragEnter = (semId: number) => {
    if (isDragging) {
      setDragOverSemId(semId);
    }
  };

  // Scroll Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[draggable="true"], button, input, .no-drag')) return;
      setIsDraggingScroll(true);
      if (scrollContainerRef.current) {
          setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
          setStartY(e.pageY - scrollContainerRef.current.offsetTop);
          setScrollLeft(scrollContainerRef.current.scrollLeft);
          setScrollTop(scrollContainerRef.current.scrollTop);
      }
  };

  const handleMouseLeave = () => {
      setIsDraggingScroll(false);
  };

  const handleMouseUp = () => {
      setIsDraggingScroll(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDraggingScroll || !scrollContainerRef.current) return;
      e.preventDefault();
      
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walkX = (x - startX) * 1.5;
      scrollContainerRef.current.scrollLeft = scrollLeft - walkX;

      const y = e.pageY - scrollContainerRef.current.offsetTop;
      const walkY = (y - startY) * 1.5;
      scrollContainerRef.current.scrollTop = scrollTop - walkY;
  };

  const openAddModal = () => {
    setEditingModuleId(null);
    setNewModuleCode('');
    setNewModuleType('taken');
    setIsModalOpen(true);
  };

  const openEditModal = (module: StagedModule) => {
    setEditingModuleId(module.id);
    setNewModuleCode(module.code);
    setNewModuleType(module.type);
    setIsModalOpen(true);
  }

  const handleSaveModule = () => {
    if (newModuleCode.trim()) {
      if (editingModuleId) {
        // Update existing
        setStagedModules(prev => prev.map(m => 
            m.id === editingModuleId 
            ? { ...m, code: newModuleCode.toUpperCase(), type: newModuleType } 
            : m
        ));
      } else {
        // Add new
        setStagedModules(prev => [
            ...prev,
            {
            id: Date.now().toString(),
            code: newModuleCode.toUpperCase(),
            type: newModuleType,
            mcs: 4
            }
        ]);
      }
      
      setNewModuleCode('');
      setNewModuleType('taken');
      setEditingModuleId(null);
      setIsModalOpen(false);
    }
  };

  const totalStagedMCs = stagedModules.reduce((acc, mod) => acc + mod.mcs, 0);

  return (
    <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      
      {/* Progression Dashboard */}
      <div className="bg-white border-b border-slate-200 shadow-sm shrink-0 z-10">
        {/* Summary Bar */}
        <div className="px-8 py-3 flex items-center gap-8 justify-between">
            <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-2 min-w-[140px]">
                    <span className="material-symbols-outlined text-green-600">school</span>
                    <span className="text-sm font-bold text-slate-700">Graduation Progress</span>
                </div>
                
                <div className="flex-1 max-w-2xl">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-slate-500">
                           {totalMCs} <span className="text-slate-400 font-normal">/ {GRADUATION_MCS} MCs</span>
                        </span>
                        <span className="text-xs font-bold text-primary">{progressPercent}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setIsProgressionExpanded(!isProgressionExpanded)}
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
                <span>{isProgressionExpanded ? 'Hide Details' : 'View Requirements'}</span>
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isProgressionExpanded ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
        </div>

        {/* Detailed Checklist (Scrollable Row) */}
        {isProgressionExpanded && (
            <div className="px-8 pb-4 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x">
                    {REQUIREMENTS.map((category, idx) => {
                         const fulfilledCount = category.courses.filter(c => checkRequirement(c.code)).length;
                         
                         return (
                        <div key={idx} className="space-y-3 min-w-[280px] max-w-[280px] snap-start">
                            <div className="flex items-center justify-between sticky top-0 bg-white z-10">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide truncate" title={category.category}>{category.category}</h4>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{fulfilledCount}/{category.courses.length}</span>
                            </div>
                            <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                                {category.courses.map((course) => {
                                    const isDone = checkRequirement(course.code);
                                    return (
                                        <div key={course.code} className={`flex items-start gap-2.5 p-2 rounded-lg border ${isDone ? 'bg-green-50/50 border-green-100' : 'bg-white border-slate-100'}`}>
                                            <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-green-500 text-white' : 'bg-slate-100 border border-slate-300'}`}>
                                                {isDone && <span className="material-symbols-outlined text-[12px]">check</span>}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={`text-xs font-bold ${isDone ? 'text-slate-700' : 'text-slate-500'}`}>{course.code}</div>
                                                <div className="text-[10px] text-slate-400 truncate" title={course.title}>{course.title}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        )}
      </div>

      {/* Top Part: Timeline Board */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto custom-scrollbar bg-grid-pattern cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
          <div className="flex h-full p-8 gap-8 min-w-max">
            {planData.map((year) => {
                const yearTotalUnits = year.semesters.reduce((acc, sem) => acc + (sem.isExchange ? 0 : sem.modules.length * 4), 0);

                return year.semesters.length > 0 ? (
              <div key={year.year} className="w-80 flex flex-col h-full pointer-events-none">
                {/* Year Header */}
                <div className="flex justify-between items-end mb-6 pb-2 border-b border-transparent shrink-0 pointer-events-auto">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{year.label}</h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">{year.academicYear}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{yearTotalUnits} MCs</span>
                  </div>
                </div>

                {/* Semesters Container */}
                <div className="flex-1 space-y-8 overflow-y-visible pr-2 pb-10 pointer-events-auto no-drag">
                  {year.semesters.map((sem) => {
                    const currentSemUnits = sem.modules.length * 4;
                    const isDragTarget = isDragging && dragOverSemId === sem.id;
                    const isSearching = addingModuleSemId === sem.id;

                    return (
                    <div 
                        key={sem.id} 
                        className={`flex flex-col gap-3 transition-colors rounded-xl p-2 -m-2 ${isDragTarget ? 'bg-blue-50/50' : ''} ${sem.isExchange ? 'h-full max-h-[220px]' : ''}`}
                        onDragEnter={() => handleDragEnter(sem.id)}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        
                      {/* Semester Header */}
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isDragTarget ? 'text-primary' : (sem.isExchange ? 'text-orange-600 uppercase tracking-wider' : 'text-slate-600')}`}>
                                {sem.name}
                            </span>
                            {sem.isExchange && (
                                <span className="material-symbols-outlined text-orange-400 text-[18px]">flight_takeoff</span>
                            )}
                        </div>
                        {!sem.isExchange && <span className="text-[10px] font-medium text-slate-400">{currentSemUnits} MCs</span>}
                      </div>

                      {/* Modules List & Bottom Action */}
                      <div className="space-y-2 relative">
                        
                        {/* Existing Modules */}
                        {sem.modules.map((mod) => (
                        <div 
                            key={mod.code} 
                            draggable="true"
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            className={`bg-white p-3.5 rounded-lg border shadow-sm transition-all cursor-grab active:cursor-grabbing group ${
                                mod.hasError 
                                ? 'border-red-500 bg-red-50 ring-1 ring-red-500' 
                                : 'border-slate-200 hover:border-primary/50 hover:shadow-md'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className={`text-xs font-bold ${mod.hasError ? 'text-red-700' : 'text-slate-800'}`}>{mod.code}</div>
                                        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${mod.hasError ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                            4 MCs
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-medium line-clamp-1 ${mod.hasError ? 'text-red-600' : 'text-slate-500'}`}>{mod.title}</div>
                                    
                                    {mod.hasError && (
                                        <div className="flex items-center gap-1 mt-2 text-red-600 bg-red-100/50 p-1.5 rounded">
                                            <span className="material-symbols-outlined text-[14px]">error</span>
                                            <span className="text-[10px] font-bold leading-none">{mod.errorMessage}</span>
                                        </div>
                                    )}
                                </div>
                                {!mod.hasError && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                        <span className="material-symbols-outlined text-slate-300 text-[16px]">drag_indicator</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        ))}

                        {/* Drop Zone Placeholder */}
                        {isDragTarget && !sem.isExchange && (
                            <div className="h-16 border-2 border-dashed border-primary/40 bg-primary/5 rounded-lg flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center gap-1 text-primary">
                                    <span className="material-symbols-outlined text-[20px]">add_to_photos</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Drop Here</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Bottom Element Logic */}
                        {sem.isExchange ? (
                            <div className="h-32 bg-white/60 border-2 border-dashed border-orange-200 rounded-lg flex flex-col items-center justify-center gap-2 text-center p-4">
                                <span className="material-symbols-outlined text-orange-400 text-[32px]">public</span>
                                <div>
                                <p className="text-xs font-bold text-orange-600">Exchange Semester</p>
                                <p className="text-[10px] font-medium text-slate-500 leading-tight mt-1">Modules mapped via EduRec</p>
                                </div>
                            </div>
                        ) : isSearching ? (
                            <div className="relative animate-in fade-in zoom-in-95 duration-200 z-50">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                                <input 
                                    autoFocus
                                    type="text"
                                    placeholder="Search modules..."
                                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-primary/20 rounded-lg text-xs font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-xl text-slate-700 placeholder:text-slate-400"
                                    onBlur={() => setTimeout(() => setAddingModuleSemId(null), 200)}
                                />
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Suggested Modules
                                    </div>
                                    <button className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex flex-col gap-0.5 border-b border-slate-50 group">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-slate-800 group-hover:text-primary">ST2334</span>
                                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Partner Match</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 group-hover:text-primary/70">Partner University: PS2201</span>
                                    </button>
                                    <button className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex flex-col gap-0.5 group">
                                        <span className="font-bold text-xs text-slate-800 group-hover:text-primary">CS3243</span>
                                        <span className="text-[10px] text-slate-500 group-hover:text-primary/70">Introduction to AI</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setAddingModuleSemId(sem.id)}
                                className={`w-full border border-slate-200 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 bg-slate-50/50 text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group ${sem.modules.length === 0 ? 'h-20' : 'h-14'}`}
                            >
                                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">add_circle</span>
                                <span className="text-[10px] font-medium">Add Modules</span>
                            </button>
                        )}
                      </div>
                    </div>
                  )}})}
                </div>
              </div>
              ) : (
                <div key={year.year} className="w-10 pointer-events-none"></div> 
              )
            })}
          </div>
      </div>

      {/* Bottom Part: Staging Area */}
      <div 
        className={`bg-white border-t border-slate-200 shrink-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out flex flex-col ${
            isBottomOpen 
                ? (isBottomExpanded ? 'h-[28rem]' : 'h-[16rem]') 
                : 'h-8' 
        }`}
      >
           {/* Pull Up Handle with Minimize Button */}
           <div 
             className="h-8 flex items-center justify-center relative bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group"
             onClick={() => !isBottomOpen && setIsBottomOpen(true)}
           >
              {!isBottomOpen && (
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">layers</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Staging Area</span>
                 </div>
              )}

              {isBottomOpen && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsBottomOpen(false); }}
                    className="flex items-center justify-center w-12 h-6 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded transition-colors"
                    title="Minimize"
                  >
                     <span className="material-symbols-outlined text-[22px]">vertical_align_bottom</span>
                  </button>
              )}
              
              {isBottomOpen && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); setIsBottomExpanded(!isBottomExpanded); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-500 rounded hover:bg-slate-200/50 transition-colors"
                    title={isBottomExpanded ? "Restore Height" : "Maximize Height"}
                 >
                    <span className="material-symbols-outlined text-[18px]">{isBottomExpanded ? 'unfold_less' : 'unfold_more'}</span>
                 </button>
              )}
           </div>

           <div className={`p-6 flex-1 overflow-hidden flex flex-col ${!isBottomOpen ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-cyan-500">layers</span>
                        Course Taken / Exempted Course (Drag to Plan)
                    </h3>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">
                        Total MCs: <span className="text-slate-800 text-xs ml-1">{totalStagedMCs}</span>
                    </div>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar h-full items-start">
                    {/* Fixed 'Approved' Box */}
                    <div 
                        draggable 
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        className="w-56 h-32 shrink-0 border-2 border-cyan-400 border-dashed rounded-xl bg-cyan-50/30 flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:bg-cyan-50 transition-colors group relative"
                    >
                        <span className="material-symbols-outlined text-cyan-400 group-hover:scale-110 transition-transform">check_circle</span>
                        <span className="text-xs font-bold text-cyan-700">Approved to ignore pre-req</span>
                    </div>
                    
                    {/* Dynamic Staged Modules */}
                    {stagedModules.map(mod => (
                      <div 
                          key={mod.id}
                          draggable 
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          className="w-56 h-32 shrink-0 border border-cyan-200 border-b-4 border-b-cyan-400 rounded-xl bg-white flex flex-col items-center justify-center gap-1 shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all relative group"
                      >
                          <button 
                            onClick={() => openEditModal(mod)}
                            className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                            title="Edit"
                          >
                               <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <div className="text-sm font-bold text-slate-800">{mod.code}</div>
                          <div className="text-[10px] font-medium text-slate-500">{mod.type === 'taken' ? 'Course Taken' : 'Exempted Course'}</div>
                          <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 mt-1">{mod.mcs} MCs</div>
                      </div>
                    ))}

                    {/* Add Module Box */}
                    <div className="relative h-32 shrink-0">
                         <button 
                           onClick={openAddModal}
                           className="w-48 h-full border-2 border-slate-300 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-cyan-400 hover:text-cyan-500 hover:bg-cyan-50/10 transition-all cursor-pointer"
                         >
                            <span className="material-symbols-outlined text-[28px]">add_circle</span>
                            <span className="text-xs font-bold">Add Course</span>
                         </button>
                    </div>
                </div>
           </div>
      </div>

      {/* Add/Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-xl shadow-2xl w-96 p-6 space-y-6 animate-in zoom-in-95 slide-in-from-bottom-5 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">{editingModuleId ? 'Edit Course' : 'Add Course'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Module Code</label>
                  <input 
                    type="text"
                    value={newModuleCode} 
                    onChange={e => setNewModuleCode(e.target.value)} 
                    placeholder="e.g. CS1231S"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all uppercase placeholder:normal-case"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={() => setNewModuleType('taken')}
                       className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${newModuleType === 'taken' ? 'bg-cyan-50 border-cyan-500 text-cyan-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                     >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Course Taken
                     </button>
                     <button 
                       onClick={() => setNewModuleType('exempted')}
                       className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${newModuleType === 'exempted' ? 'bg-cyan-50 border-cyan-500 text-cyan-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                     >
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                        Exempted
                     </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveModule}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                {editingModuleId ? 'Save Changes' : 'Add Course'}
              </button>
           </div>
        </div>
      )}
    </main>
  );
};

export default MainBoard;