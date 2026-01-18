import React, { useState, useEffect } from 'react';
import BrandingPanel from './BrandingPanel';
import { generatePlan, savePlan, GeneratePlanRequest, GeneratePlanResponse } from '../api';

interface OnboardingFormData {
  matricYear: string;
  gradYear: string;
  faculty: string;
  major: string;
  focusArea: string;
}

interface NewUserOnboardingProps {
  userId: string;
  onComplete: (plan: GeneratePlanResponse) => void;
  onSkip: () => void;
}

const NewUserOnboarding: React.FC<NewUserOnboardingProps> = ({ userId, onComplete, onSkip }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>({
    matricYear: '',
    gradYear: '',
    faculty: '',
    major: '',
    focusArea: ''
  });
  const [showMajorTooltip, setShowMajorTooltip] = useState(false);

  // Reset major and focus area if faculty changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, major: '', focusArea: '' }));
  }, [formData.faculty]);

  // Reset focus area if major changes
  useEffect(() => {
    if (formData.major !== 'Computer Science') {
      setFormData(prev => ({ ...prev, focusArea: '' }));
    }
  }, [formData.major]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkip = async () => {
    // Create an empty plan so user won't see onboarding again
    try {
      await savePlan({
        minYear: '2024/2025',
        y1s1: [], y1s2: [],
        y2s1: [], y2s2: [],
        y3s1: [], y3s2: [],
        y4s1: [], y4s2: []
      }, 'My Plan', userId);
    } catch (error) {
      console.error('Error creating empty plan:', error);
    }
    onSkip();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Map form data to backend's expected format
      const request: GeneratePlanRequest = {
        degree: formData.faculty.toLowerCase(), // "computing" or "business"
        major: formData.major,
        focus_area: mapFocusArea(formData.focusArea),
        max_mcs: 20,
        max_hard_per_sem: 4
      };

      // Generate plan using backend
      const result = await generatePlan(request);

      if (result.success) {
        // Save the generated plan to database
        await savePlan(
          {
            minYear: formData.matricYear,
            ...result.plan.plan // y1s1: [...], y1s2: [...], etc.
          },
          'My Plan',
          userId
        );

        onComplete(result);
      } else {
        alert(result.message || 'Failed to generate plan. Please try again.');
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Something went wrong generating your plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Map focus area display names to backend values
  const mapFocusArea = (focusArea: string): string => {
    const mapping: Record<string, string> = {
      'Artificial Intelligence': 'AI',
      'Software Engineering': 'SoftwareEngineering',
      'Algorithms & Theory': 'Algorithms',
      'Computer Graphics and Games': 'none',
      'Computer Security': 'none',
      'Database Systems': 'none',
      'Multimedia Computing': 'none',
      'Networking and Distributed Systems': 'none',
      'Parallel Computing': 'none',
      'Programming Languages': 'none',
      '': 'none',
      'none': 'none'
    };
    return mapping[focusArea] || 'none';
  };

  const majorOptions: Record<string, string[]> = {
    'Computing': [
      'Computer Science',
      'Artificial Intelligence',
      'Information Security',
      'Computer Engineering',
      'Business Analytics',
      'Business Artificial Intelligence Systems'
    ],
    'Business': [
      'Applied Business Analytics',
      'Business Economics',
      'Finance',
      'Innovation & Entrepreneurship',
      'Leadership & Human Capital Management',
      'Marketing',
      'Operations & Supply Chain Management',
      'Accountancy',
      'Real Estate'
    ]
  };

  // Only show focus areas that backend supports
  const focusAreaOptions = [
    'Algorithms & Theory',
    'Artificial Intelligence',
    'Software Engineering',
    "None/Haven't Decided"
  ];

  const isComputerScience = formData.major === 'Computer Science';

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <BrandingPanel />

      <main className="w-full md:w-7/12 h-full bg-white dark:bg-background-dark flex flex-col items-center justify-start p-8 md:p-20 overflow-y-auto custom-scrollbar">
        <div className="max-w-[500px] w-full flex flex-col gap-8 pb-8">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <span className="text-primary font-bold tracking-widest text-xs uppercase font-display">Welcome</span>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em] font-display">
              Start your academic plan
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
              Select your details to generate a customized curriculum roadmap.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-slate-800 dark:text-white text-sm font-semibold font-display">Matriculated in</label>
              <select
                name="matricYear"
                required
                value={formData.matricYear}
                onChange={handleInputChange}
                className="select-custom-arrow flex w-full rounded-lg text-slate-700 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 p-4 text-base font-normal font-display"
              >
                <option value="" disabled>Select year</option>
                <option value="AY22/23">AY22/23</option>
                <option value="AY23/24">AY23/24</option>
                <option value="AY24/25">AY24/25</option>
                <option value="AY25/26">AY25/26</option>
                <option value="AY26/27">AY26/27</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-800 dark:text-white text-sm font-semibold font-display">Expected Graduation Year</label>
              <select
                name="gradYear"
                required
                value={formData.gradYear}
                onChange={handleInputChange}
                className="select-custom-arrow flex w-full rounded-lg text-slate-700 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 p-4 text-base font-normal font-display"
              >
                <option value="" disabled>Select year</option>
                <option value="AY25/26">AY25/26</option>
                <option value="AY26/27">AY26/27</option>
                <option value="AY27/28">AY27/28</option>
                <option value="AY28/29">AY28/29</option>
                <option value="AY29/30">AY29/30</option>
                <option value="AY30/31">AY30/31</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-800 dark:text-white text-sm font-semibold font-display">Faculty</label>
              <select
                name="faculty"
                required
                value={formData.faculty}
                onChange={handleInputChange}
                className="select-custom-arrow flex w-full rounded-lg text-slate-700 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 p-4 text-base font-normal font-display"
              >
                <option value="" disabled>Select faculty</option>
                <option value="Computing">Computing</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center gap-2">
                <label className="text-slate-800 dark:text-white text-sm font-semibold font-display">Primary Major</label>
                <button
                  type="button"
                  onMouseEnter={() => setShowMajorTooltip(true)}
                  onMouseLeave={() => setShowMajorTooltip(false)}
                  className="text-slate-400 hover:text-slate-500"
                >
                  <span className="material-symbols-outlined text-[16px]">info</span>
                </button>
                {showMajorTooltip && (
                  <div className="absolute left-0 bottom-full mb-2 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-lg z-50 w-64 animate-in fade-in slide-in-from-bottom-1 pointer-events-none">
                    <p>Due to data access limitations, we currently only have manual data for selected majors.</p>
                  </div>
                )}
              </div>
              <select
                name="major"
                required
                disabled={!formData.faculty}
                value={formData.major}
                onChange={handleInputChange}
                className="select-custom-arrow flex w-full rounded-lg text-slate-700 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 p-4 text-base font-normal font-display disabled:opacity-50"
              >
                <option value="" disabled>Select major</option>
                {formData.faculty && majorOptions[formData.faculty].map(opt => {
                  const isAllowed = ['Computer Science', 'Business Analytics', 'Finance', 'Accountancy'].includes(opt);
                  return (
                    <option key={opt} value={opt} disabled={!isAllowed}>
                      {isAllowed ? opt : `🔒 ${opt}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-800 dark:text-white text-sm font-semibold font-display">Focus Area / Specialization</label>
              <select
                name="focusArea"
                value={formData.focusArea}
                onChange={handleInputChange}
                disabled={!formData.faculty || !isComputerScience}
                className="select-custom-arrow flex w-full rounded-lg text-slate-700 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 p-4 text-base font-normal font-display disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900"
              >
                <option value="" disabled>{!isComputerScience ? 'Not applicable' : 'Select focus area'}</option>
                {isComputerScience && focusAreaOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {isComputerScience && <option value="none">None / Not Decided</option>}
              </select>
            </div>

            <div className="pt-4 flex flex-col items-center gap-4">
              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-14 px-6 bg-primary text-white text-lg font-bold transition-all hover:bg-[#d67000] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <span>Generate Study Plan</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-primary font-bold underline text-sm hover:text-[#d67000] transition-colors"
              >
                Skip for now
              </button>
            </div>
          </form>

          {/* Footer Hint */}
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">info</span>
            <p>You can always adjust these settings later in your dashboard.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewUserOnboarding;
