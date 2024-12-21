import React, { useState } from 'react';
import { LogOut, Users, BarChart2, Shield, Menu, MessageCircle, LayoutDashboard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ParentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  { id: 'dashboard', name: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'children', name: 'Mes enfants', icon: Users },
  { id: 'statistics', name: 'Statistiques', icon: BarChart2 },
  { id: 'controls', name: 'Garde-fous', icon: Shield },
  { id: 'chat', name: 'Assistant Parent', icon: MessageCircle },
];

const ParentSidebar: React.FC<ParentSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.reload();
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const renderDesktopNavItem = (item: { id: string; name: string; icon: React.ElementType }, index: number) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const isHovered = hoveredItem === item.id;

    return (
      <div className="relative" key={item.id}>
        <button
          onClick={() => setActiveTab(item.id)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            relative flex items-center w-12 h-12 rounded-xl transition-all duration-300
            ${isActive 
              ? 'bg-[#ff5734] text-white' 
              : 'text-[#151313] hover:bg-[#f7f7f5]'
            }
          `}
        >
          <Icon className="h-5 w-5 mx-auto" />
        </button>
        
        {/* Tooltip */}
        <div
          className={`
            absolute left-[4.5rem] px-3 py-1.5 rounded-lg bg-[#151313] text-white text-sm
            whitespace-nowrap transition-all duration-300 z-[9999]
            ${isHovered ? 'opacity-100 visible translate-y-[-50%]' : 'opacity-0 invisible translate-y-[-30%]'}
          `}
          style={{ 
            top: '50%'
          }}
        >
          {item.name}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-[#151313]"
            style={{ marginRight: '-1px' }}
          />
        </div>
      </div>
    );
  };

  const renderMobileNavItem = (item: { id: string; name: string; icon: React.ElementType }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          setIsMobileMenuOpen(false);
        }}
        className={`
          w-full flex items-center px-4 py-3 rounded-xl transition-colors
          ${isActive 
            ? 'bg-[#ff5734] text-white' 
            : 'text-[#151313] hover:bg-[#f7f7f5]'
          }
        `}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="ml-3 font-medium">{item.name}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 right-4 p-2 rounded-xl bg-white shadow-sm lg:hidden z-50 border border-[#151313]"
      >
        <Menu className="h-6 w-6 text-[#151313]" />
      </button>

      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-64 bg-white transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex-1 space-y-2">
              {navigationItems.map(item => renderMobileNavItem(item))}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-xl text-[#ff5734] hover:bg-[#f7f7f5]"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="ml-3 font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed left-4 top-4 bottom-4 w-[72px] bg-white rounded-2xl shadow-lg border border-[#151313]">
        <div className="flex flex-col h-full justify-between p-2">
          <nav className="space-y-1">
            {navigationItems.map((item, index) => renderDesktopNavItem(item, index))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-12 h-12 rounded-xl text-[#ff5734] hover:bg-[#f7f7f5]"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ParentSidebar;