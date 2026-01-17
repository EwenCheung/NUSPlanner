import React, { useState } from 'react';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import MainBoard from './components/MainBoard';
import SidebarRight from './components/SidebarRight';
import Login from './components/Login';
import Signup from './components/Signup';
import { AcademicYear } from './types';

// Types for Auth
interface User {
  name: string;
  email: string;
  isGuest?: boolean;
}

// Initial Data
const INITIAL_PLAN_DATA: AcademicYear[] = [
  {
    year: 1,
    label: "Year 1",
    academicYear: "2024/2025",
    totalUnits: 56,
    semesters: [
      {
        id: 1,
        name: "Semester 1",
        units: 36,
        modules: [
          { code: "MA1521", title: "Calculus for Computing" },
          { code: "CS1101S", title: "Programming Methodology" },
          { code: "CS11111", title: "Dummy Course" },
          { code: "CS11112", title: "Dummy Course" },
          { code: "CS11113", title: "Dummy Course" },
          { code: "CS11114", title: "Dummy Course" }
        ]
      },
      {
        id: 2,
        name: "Semester 2",
        units: 20,
        modules: [
          { 
            code: "CS2040S", 
            title: "Data Structures & Algos",
            hasError: true,
            errorMessage: "Prereq: CS1010 not fulfilled"
          }
        ]
      }
    ]
  },
  {
    year: 2,
    label: "Year 2",
    academicYear: "2025/2026",
    totalUnits: 44,
    semesters: [
      {
        id: 3,
        name: "Semester 1",
        units: 24,
        modules: [
          { code: "ST2334", title: "Probability & Statistics" }
        ]
      },
      {
        id: 4,
        name: "Semester 2",
        units: 20,
        modules: [
          { code: "CS2106", title: "Operating Systems" }
        ]
      }
    ]
  },
  {
    year: 3,
    label: "Year 3",
    academicYear: "2026/2027",
    totalUnits: 20,
    semesters: [
      {
        id: 5,
        name: "Semester 1",
        units: 20,
        modules: [] // Empty state
      },
      {
        id: 6,
        name: "Exchange Semester",
        units: 0,
        modules: [],
        isExchange: true
      }
    ]
  },
  {
      year: 4,
      label: "Year 4",
      academicYear: "2027/2028",
      totalUnits: 0,
      semesters: [
        {
            id: 7,
            name: "Semester 1",
            units: 0,
            modules: []
        },
        {
            id: 8,
            name: "Semester 2",
            units: 0,
            modules: []
        }
      ]
  }
];

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // App State
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [planData, setPlanData] = useState<AcademicYear[]>(INITIAL_PLAN_DATA);

  // Auth Handlers
  const handleLogin = (email: string) => {
    // Simulate fetching user details based on email
    setUser({
      name: email.split('@')[0], // Simple username derivation
      email: email,
      isGuest: false
    });
  };

  const handleGuestLogin = () => {
    setUser({
      name: 'Guest User',
      email: '',
      isGuest: true
    });
  };

  const handleSignup = (username: string, email: string) => {
    setUser({
      name: username,
      email: email,
      isGuest: false
    });
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
  };

  // Plan Handlers
  const addModuleToPlan = (semesterId: number, module: { code: string; title: string }) => {
    setPlanData(prevPlan => {
      return prevPlan.map(year => ({
        ...year,
        semesters: year.semesters.map(sem => {
          if (sem.id === semesterId) {
            // Check if module already exists to prevent duplicates
            if (sem.modules.some(m => m.code === module.code)) return sem;
            
            return {
              ...sem,
              modules: [...sem.modules, module]
            };
          }
          return sem;
        })
      }));
    });
  };

  const handleAiAddModule = () => {
    addModuleToPlan(4, { code: "CS3243", title: "Introduction to AI" });
  };

  // Render Auth Views if not logged in
  if (!user) {
    if (authView === 'login') {
      return (
        <Login 
          onLogin={handleLogin} 
          onGuestLogin={handleGuestLogin} 
          onSwitchToSignup={() => setAuthView('signup')} 
        />
      );
    } else {
      return (
        <Signup 
          onSignup={handleSignup} 
          onSwitchToLogin={() => setAuthView('login')} 
        />
      );
    }
  }

  // Render Main App if logged in
  return (
    <div className="flex flex-col h-screen overflow-hidden text-slate-900 font-sans">
      <Header 
        isAiOpen={isAiOpen} 
        toggleAi={() => setIsAiOpen(!isAiOpen)} 
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft />
        <MainBoard planData={planData} />
        <SidebarRight 
            isOpen={isAiOpen} 
            toggle={() => setIsAiOpen(!isAiOpen)} 
            onAddModule={handleAiAddModule}
        />
      </div>
    </div>
  );
};

export default App;