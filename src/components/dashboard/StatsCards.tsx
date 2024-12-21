import React, { useState, useEffect } from 'react';
import { Settings, Info, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import RewardsScaleModal from './RewardsScaleModal';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from 'date-fns';

interface Profile {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

const StatsCards: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [showRewardsScale, setShowRewardsScale] = useState(false);
  const [stats, setStats] = useState({
    dailyEarned: 0,
    weeklyEarned: 0,
    monthlyEarned: 0
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const cardClasses = "rounded-2xl p-6 shadow-sm border border-[#151313]";

  useEffect(() => {
    loadEarnedIzicoins();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadEarnedIzicoins = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const dayStart = startOfDay(now).toISOString();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
      const monthStart = startOfMonth(now).toISOString();
      const dayEnd = endOfDay(now).toISOString();
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString();
      const monthEnd = endOfMonth(now).toISOString();

      const { data: rewards, error } = await supabase
        .from('reward_history')
        .select('amount, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      if (rewards) {
        const dailyEarned = rewards
          .filter(r => r.created_at >= dayStart && r.created_at <= dayEnd)
          .reduce((sum, r) => sum + r.amount, 0);

        const weeklyEarned = rewards
          .filter(r => r.created_at >= weekStart && r.created_at <= weekEnd)
          .reduce((sum, r) => sum + r.amount, 0);

        const monthlyEarned = rewards
          .filter(r => r.created_at >= monthStart && r.created_at <= monthEnd)
          .reduce((sum, r) => sum + r.amount, 0);

        setStats({
          dailyEarned: Number(dailyEarned.toFixed(2)),
          weeklyEarned: Number(weeklyEarned.toFixed(2)),
          monthlyEarned: Number(monthlyEarned.toFixed(2))
        });
      }
    } catch (error) {
      console.error('Error loading earned izicoins:', error);
      toast.error('Erreur lors du chargement des izicoins');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          className={`${cardClasses} bg-[#ff5734] relative cursor-pointer group p-0 overflow-hidden flex flex-col`}
          onClick={() => setActiveTab('profile')}
        >
          {/* Avatar Section */}
          <div className="p-4 pb-2 flex-1">
            <div className="w-full h-20 bg-white/10 rounded-xl overflow-hidden">
              {profile?.avatar_url ? (
                <div className="w-full h-full">
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Name and Settings Section */}
          <div className="px-4 pb-4 flex items-center justify-between">
            <div className="text-white">
              <div className="font-semibold">
                {profile?.first_name} {profile?.last_name}
              </div>
              <div className="text-sm text-white/80">Mon profil</div>
            </div>
            <button 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('profile');
              }}
            >
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className={`${cardClasses} bg-[#be94f5]`}>
          <div className="text-white text-lg font-semibold">Cours</div>
          <div className="mt-4 text-4xl font-bold text-white">+120</div>
          <div className="mt-2 text-sm text-white/80">cours</div>
        </div>

        <div 
          className={`${cardClasses} bg-[#fccc42] cursor-pointer hover:border-[#ff5734] transition-colors`}
          onClick={() => setShowRewardsScale(true)}
        >
          <div className="flex items-center justify-between">
            <div className="text-[#151313] text-lg font-semibold">Izicoins gagnés</div>
            <Info className="h-5 w-5 text-[#151313] hover:text-[#ff5734]" />
          </div>
          <div className="flex flex-col space-y-1 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#151313]/80">Aujourd'hui</span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-[#151313]">+{stats.dailyEarned}</span>
                <span className="ml-1 text-xs text-[#151313]/60">points</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#151313]/80">Cette semaine</span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-[#151313]">+{stats.weeklyEarned}</span>
                <span className="ml-1 text-xs text-[#151313]/60">points</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#151313]/80">Ce mois</span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-[#151313]">+{stats.monthlyEarned}</span>
                <span className="ml-1 text-xs text-[#151313]/60">points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RewardsScaleModal 
        isOpen={showRewardsScale}
        onClose={() => setShowRewardsScale(false)}
      />
    </>
  );
};

export default StatsCards;