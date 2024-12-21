import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { signOutUser } from '../lib/auth/user';
import toast from 'react-hot-toast';

interface SidebarProps {
  navigationItems: Array<{
    id: string;
    name: string;
    icon: React.ElementType;
  }>;
  bottomNavigationItems: Array<{
    id: string;
    name: string;
    icon: React.ElementType;
  }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  logo: React.ElementType;
}

const Sidebar: React.FC<SidebarProps> = ({
  navigationItems,
  bottomNavigationItems,
  activeTab,
  setActiveTab,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        window.location.reload();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const renderNavItem = (item: { id: string; name: string; icon: React.ElementType }, index: number) => {
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

  return (
    <div className="hidden lg:block">
      <div className="fixed top-4 bottom-4 left-4 w-[72px] bg-white rounded-2xl shadow-lg flex flex-col z-[100] border border-[#151313]">
        {/* Navigation principale */}
        <div className="flex-1 flex flex-col justify-between px-2 py-3">
          <nav className="space-y-1">
            {navigationItems.map((item, index) => renderNavItem(item, index))}
          </nav>

          {/* Navigation du bas */}
          <nav className="space-y-1">
            {bottomNavigationItems.map((item, index) => renderNavItem(item, navigationItems.length + index + 1))}
            
            {/* Bouton de déconnexion */}
            <div className="relative">
              <button
                onClick={handleLogout}
                onMouseEnter={() => setHoveredItem('logout')}
                onMouseLeave={() => setHoveredItem(null)}
                className="flex items-center justify-center w-12 h-12 rounded-xl text-[#ff5734] hover:bg-[#f7f7f5] transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
              
              {/* Tooltip déconnexion */}
              <div
                className={`
                  absolute left-[4.5rem] px-3 py-1.5 rounded-lg bg-[#151313] text-white text-sm
                  whitespace-nowrap transition-all duration-300 z-[9999]
                  ${hoveredItem === 'logout' ? 'opacity-100 visible translate-y-[-50%]' : 'opacity-0 invisible translate-y-[-30%]'}
                `}
                style={{ 
                  top: '50%'
                }}
              >
                Déconnexion
                <div
                  className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-[#151313]"
                  style={{ marginRight: '-1px' }}
                />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;