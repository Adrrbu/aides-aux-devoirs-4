import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  User,
  BookOpen,
  Calendar as CalendarIcon,
  Wand2,
  FileText,
  ClipboardList,
  Menu,
  PlaySquare,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  Dumbbell,
  Compass,
  LogOut,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DashboardMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  { id: 'dashboard', name: 'Tableau de bord', icon: BookOpenCheck },
  { id: 'ai', name: 'Assistant IA', icon: Wand2 },
  { id: 'courses', name: 'Cours', icon: BookOpen },
  { id: 'planning', name: 'Planning', icon: CalendarIcon },
  { id: 'exercises', name: 'Exercices', icon: Dumbbell },
  { id: 'revision', name: 'Fiches de révision', icon: FileText },
  { id: 'exams', name: 'Mes contrôles', icon: ClipboardList },
  { id: 'videos', name: 'Vidéos éducatives', icon: PlaySquare },
  { id: 'career', name: 'Trouve ta voie', icon: Compass },
  { id: 'store', name: 'Magasin', icon: ShoppingBag },
];

const bottomNavigationItems = [
  { id: 'profile', name: 'Mon Profil', icon: User },
  { id: 'contact', name: 'Nous contacter', icon: MessageCircle },
  { id: 'subscription', name: 'Mon Abonnement', icon: CreditCard },
];

const DashboardMenu: React.FC<DashboardMenuProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('mockUser');
      localStorage.removeItem('sb-sqzeotgydzwvofebxcgw-auth-token');
      window.location.href = '/';
    } catch (error) {
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
          className={`absolute right-0 top-0 bottom-0 w-80 bg-white transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#151313]">
              <div className="flex items-center">
                <BookOpenCheck className="h-8 w-8 text-[#ff5734]" />
                <span className="ml-2 text-xl font-bold text-[#151313]">Aizily</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#151313] hover:text-[#ff5734] rounded-full hover:bg-[#f7f7f5]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation items */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-2">
                {navigationItems.map(item => renderMobileNavItem(item))}
              </nav>

              {/* Bottom navigation items */}
              <nav className="mt-8 pt-8 border-t border-[#151313] space-y-2">
                {bottomNavigationItems.map(item => renderMobileNavItem(item))}
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-[#ff5734] hover:bg-[#f7f7f5]"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-3 font-medium">Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed left-4 top-4 bottom-4 w-[72px] bg-white rounded-2xl shadow-lg border border-[#151313] z-50">
        <div className="flex flex-col h-full justify-between p-2">
          <nav className="space-y-1">
            {navigationItems.map((item, index) => renderDesktopNavItem(item, index))}
          </nav>

          <nav className="space-y-1">
            {bottomNavigationItems.map((item, index) => renderDesktopNavItem(item, navigationItems.length + index + 1))}
            
            {/* Logout button */}
            <div className="relative">
              <button
                onClick={handleLogout}
                onMouseEnter={() => setHoveredItem('logout')}
                onMouseLeave={() => setHoveredItem(null)}
                className="flex items-center justify-center w-12 h-12 rounded-xl text-[#ff5734] hover:bg-[#f7f7f5]"
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
    </>
  );
};

export default DashboardMenu;