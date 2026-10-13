import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { DSATrackerView } from './components/prep/DSATrackerView';
import { SQLTrackerView } from './components/prep/SQLTrackerView';
import { AptitudeTrackerView } from './components/prep/AptitudeTrackerView';
import { CoreSubjectsView } from './components/prep/CoreSubjectsView';
import { ProfileView } from './components/profile/ProfileView';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LayoutDashboard, Briefcase, Code2, Database, BrainCircuit, BookOpen, User } from 'lucide-react';

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading Placement OS...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
          {activeTab === 'applications' && <ApplicationsPage />}
          {activeTab === 'prep_dsa' && <DSATrackerView />}
          {activeTab === 'prep_sql' && <SQLTrackerView />}
          {activeTab === 'prep_aptitude' && <AptitudeTrackerView />}
          {activeTab === 'prep_core' && <CoreSubjectsView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex items-center justify-around px-2 z-40">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`p-2 rounded-xl flex flex-col items-center text-[10px] ${
            activeTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`p-2 rounded-xl flex flex-col items-center text-[10px] ${
            activeTab === 'applications' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Briefcase className="w-4 h-4 mb-0.5" />
          <span>Apps</span>
        </button>
        <button
          onClick={() => setActiveTab('prep_dsa')}
          className={`p-2 rounded-xl flex flex-col items-center text-[10px] ${
            activeTab === 'prep_dsa' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Code2 className="w-4 h-4 mb-0.5" />
          <span>DSA</span>
        </button>
        <button
          onClick={() => setActiveTab('prep_sql')}
          className={`p-2 rounded-xl flex flex-col items-center text-[10px] ${
            activeTab === 'prep_sql' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Database className="w-4 h-4 mb-0.5" />
          <span>SQL</span>
        </button>
        <button
          onClick={() => setActiveTab('prep_core')}
          className={`p-2 rounded-xl flex flex-col items-center text-[10px] ${
            activeTab === 'prep_core' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Core CS</span>
        </button>
      </nav>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
