import React from 'react';
import { X, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
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
  logo: React.ElementType;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navigationItems,
  bottomNavigationItems,
  activeTab,
  setActiveTab,
  logo: Logo,
}) => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[300px] bg-white border-l border-[#151313]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#151313]">
            <div className="flex items-center">
              <Logo className="h-8 w-8 text-[#ff5734]" />
              <span className="ml-2 text-xl font-bold text-[#151313]">Aizily</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#151313] hover:text-[#ff5734] rounded-full hover:bg-[#f7f7f5]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#ff5734] text-white'
                        : 'text-[#151313] hover:bg-[#f7f7f5]'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom navigation items */}
            <div className="mt-8 pt-8 border-t border-[#151313]">
              <nav className="space-y-2">
                {bottomNavigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#ff5734] text-white'
                          : 'text-[#151313] hover:bg-[#f7f7f5]'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="ml-3">{item.name}</span>
                    </button>
                  );
                })}

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm rounded-xl text-[#ff5734] hover:bg-[#f7f7f5] transition-colors"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-3">Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;