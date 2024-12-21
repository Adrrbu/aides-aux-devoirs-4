import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import DashboardContent from './dashboard/DashboardContent';
import LoadingSpinner from './ui/LoadingSpinner';
import DashboardMenu from './DashboardMenu';
import ProfilePage from './profile/ProfilePage';
import AIChatbot from './AIChatbot';
import CourseCategories from './CourseCategories';
import Calendar from './Calendar';
import Exercises from './Exercises';
import RevisionNotes from './RevisionNotes';
import Exams from './Exams';
import EducationalVideos from './EducationalVideos';
import CareerTest from './CareerGuidance/CareerTest';
import Store from './store/Store';
import Contact from './contact/Contact';
import Subscription from './Subscription';

const Dashboard: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('Dashboard render:', { profile, loading, error, activeTab });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>Une erreur est survenue lors du chargement du profil:</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#ff5734] text-white rounded-xl"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    console.error('No profile data available');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          Impossible de charger le profil utilisateur
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent setActiveTab={setActiveTab} />;
      case 'ai':
        return <AIChatbot />;
      case 'courses':
        return <CourseCategories onAddCourse={() => {}} />;
      case 'planning':
        return <Calendar />;
      case 'exercises':
        return <Exercises />;
      case 'revision':
        return <RevisionNotes />;
      case 'exams':
        return <Exams />;
      case 'videos':
        return <EducationalVideos />;
      case 'career':
        return <CareerTest />;
      case 'store':
        return <Store />;
      case 'profile':
        return <ProfilePage />;
      case 'contact':
        return <Contact />;
      case 'subscription':
        return <Subscription />;
      default:
        return <DashboardContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <DashboardMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="lg:pl-[calc(72px+4rem)] p-8">
        <div className="max-w-[1400px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;