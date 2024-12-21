import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Brain, BookMarked, BookOpen, Calendar, ShoppingBag, Trophy, Plus, Gift } from 'lucide-react';
import { useActivities } from '../../hooks/useActivities';
import { ActivityType } from '../../types/activity';

const RecentActivities: React.FC = () => {
  const { activities, loading, error, refreshActivities } = useActivities();

  const getActivityIcon = (type: ActivityType, transactionType?: string) => {
    switch (type) {
      case 'exercise':
        return <Brain className="h-5 w-5 text-[#ff5734]" />;
      case 'revision':
        return <BookMarked className="h-5 w-5 text-[#be94f5]" />;
      case 'course':
        return <BookOpen className="h-5 w-5 text-[#fccc42]" />;
      case 'transaction':
        if (transactionType === 'store') {
          return <ShoppingBag className="h-5 w-5 text-[#ff5734]" />;
        } else if (transactionType === 'reward') {
          return <Trophy className="h-5 w-5 text-[#be94f5]" />;
        } else if (transactionType === 'credit') {
          return <Plus className="h-5 w-5 text-[#fccc42]" />;
        } else {
          return <Gift className="h-5 w-5 text-[#ff5734]" />;
        }
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'exercise':
        return 'bg-[#ff5734]/10';
      case 'revision':
        return 'bg-[#be94f5]/10';
      case 'course':
        return 'bg-[#fccc42]/10';
      case 'transaction':
        return 'bg-[#ff5734]/10';
      default:
        return 'bg-gray-50';
    }
  };

  const getActivityLabel = (type: ActivityType, transactionType?: string) => {
    switch (type) {
      case 'exercise':
        return 'Exercice terminé';
      case 'revision':
        return 'Session de révision';
      case 'course':
        return 'Nouveau cours';
      case 'transaction':
        if (transactionType === 'store') {
          return 'Achat effectué';
        } else if (transactionType === 'reward') {
          return 'Récompense gagnée';
        } else if (transactionType === 'credit') {
          return 'Recharge effectuée';
        } else {
          return 'Transaction';
        }
      default:
        return 'Activité';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#ff5734]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-[#ff5734]">{error}</p>
        <button
          onClick={refreshActivities}
          className="mt-4 text-sm text-[#ff5734] hover:text-[#ff5734]/80"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="mx-auto h-12 w-12 text-[#ff5734]" />
        <h3 className="mt-2 text-sm font-medium text-[#151313]">Aucune activité récente</h3>
        <p className="mt-1 text-sm text-gray-500">
          Commencez à utiliser l'application pour voir vos activités apparaître ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type, activity.transactionType)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-[#151313]">{activity.title}</p>
                <p className="text-xs text-gray-500">{getActivityLabel(activity.type, activity.transactionType)}</p>
                {activity.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                )}
              </div>
              {activity.score !== undefined && (
                <div className="text-sm font-medium text-[#ff5734]">
                  {activity.score}%
                </div>
              )}
              {activity.amount !== undefined && (
                <div className={`text-sm font-medium ${
                  activity.transactionType === 'credit' || activity.transactionType === 'reward'
                    ? 'text-[#ff5734]'
                    : 'text-[#151313]'
                }`}>
                  {activity.transactionType === 'credit' || activity.transactionType === 'reward' ? '+' : '-'}
                  {Math.abs(activity.amount).toFixed(2)} izicoins
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {format(parseISO(activity.timestamp), "d MMMM 'à' HH'h'mm", { locale: fr })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;