import React, { useState } from 'react';
import ParentSidebar from './ParentSidebar';
import ChildrenView from './views/ChildrenView';
import StatisticsView from './views/StatisticsView';
import ParentalControlsView from './views/ParentalControlsView';
import ParentChatView from './views/ParentChatView';
import ParentDashboardContent from './dashboard/ParentDashboardContent';

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ParentDashboardContent />;
      case 'statistics':
        return <StatisticsView />;
      case 'controls':
        return <ParentalControlsView />;
      case 'chat':
        return <ParentChatView />;
      case 'children':
        return <ChildrenView />;
      default:
        return <ParentDashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <ParentSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="lg:pl-[calc(72px+4rem)] p-8">
        <div className="max-w-[1400px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;