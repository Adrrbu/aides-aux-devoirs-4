import React, { useState, useEffect } from 'react';
import { Brain, Target, Trophy, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChildStatisticsProps {
  childId: string;
}

const ChildStatistics: React.FC<ChildStatisticsProps> = ({ childId }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, [childId]);

  const loadStatistics = async () => {
    try {
      // Get exercise stats
      const { data: exerciseStats } = await supabase
        .from('exercise_attempts')
        .select('score')
        .eq('user_id', childId);

      // Get course stats
      const { data: courseStats } = await supabase
        .from('exam_content')
        .select('created_at')
        .eq('user_id', childId);

      // Get revision stats
      const { data: revisionStats } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', childId)
        .eq('event_type', 'revision');

      setStats({
        exerciseCount: exerciseStats?.length || 0,
        averageScore: exerciseStats?.reduce((acc, curr) => acc + curr.score, 0) / (exerciseStats?.length || 1),
        courseCount: courseStats?.length || 0,
        revisionCount: revisionStats?.length || 0,
        lastActive: courseStats?.[0]?.created_at || revisionStats?.[0]?.created_at
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  if (loading) {
    return (
      <div className={`${cardClasses} animate-pulse`}>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <h3 className="text-lg font-medium text-[#151313] mb-6">Statistiques</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Brain className="h-4 w-4 mr-1 text-[#ff5734]" />
            Exercices complétés
          </div>
          <p className="text-2xl font-bold text-[#151313]">{stats?.exerciseCount || 0}</p>
        </div>

        <div>
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Target className="h-4 w-4 mr-1 text-[#be94f5]" />
            Score moyen
          </div>
          <p className="text-2xl font-bold text-[#151313]">
            {Math.round(stats?.averageScore || 0)}%
          </p>
        </div>

        <div>
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Trophy className="h-4 w-4 mr-1 text-[#fccc42]" />
            Cours suivis
          </div>
          <p className="text-2xl font-bold text-[#151313]">{stats?.courseCount || 0}</p>
        </div>

        <div>
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Clock className="h-4 w-4 mr-1 text-[#151313]" />
            Dernière activité
          </div>
          <p className="text-sm font-medium text-[#151313]">
            {stats?.lastActive 
              ? format(new Date(stats.lastActive), 'dd MMMM', { locale: fr })
              : 'Jamais'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChildStatistics;