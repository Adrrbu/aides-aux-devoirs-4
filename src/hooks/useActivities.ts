import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Activity } from '../types/activity';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Utilisateur non authentifié');
        return;
      }

      // Charger les tentatives d'exercices
      const { data: exerciseAttempts, error: exerciseError } = await supabase
        .from('exercise_attempts')
        .select(`
          id,
          score,
          completed_at,
          exercise:exercise_id (
            title,
            subject:subject_id (name)
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (exerciseError) throw exerciseError;

      // Charger les examens et leur contenu
      const { data: examContent, error: examError } = await supabase
        .from('exam_content')
        .select(`
          id,
          created_at,
          exam:exam_id (
            title,
            subject:subject_id (name)
          )
        `)
        .not('course_content', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (examError) throw examError;

      // Charger les événements du calendrier (révisions)
      const { data: revisionEvents, error: revisionError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', 'revision')
        .order('created_at', { ascending: false })
        .limit(5);

      if (revisionError) throw revisionError;

      // Charger les transactions du portefeuille
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let transactions = [];
      if (wallet) {
        const { data: walletTransactions, error: transactionError } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('wallet_id', wallet.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (transactionError) throw transactionError;
        transactions = walletTransactions || [];
      }

      // Combiner et formater toutes les activités
      const allActivities: Activity[] = [
        ...(exerciseAttempts?.map(attempt => ({
          id: `exercise-${attempt.id}`,
          type: 'exercise' as const,
          title: attempt.exercise?.title || 'Exercice',
          timestamp: attempt.completed_at,
          score: attempt.score,
          description: attempt.exercise?.subject?.name
        })) || []),
        ...(examContent?.map(content => ({
          id: `course-${content.id}`,
          type: 'course' as const,
          title: content.exam?.title || 'Cours',
          timestamp: content.created_at,
          description: content.exam?.subject?.name
        })) || []),
        ...(revisionEvents?.map(event => ({
          id: `revision-${event.id}`,
          type: 'revision' as const,
          title: event.title,
          timestamp: event.created_at,
          description: event.description
        })) || []),
        ...(transactions?.map(transaction => ({
          id: `transaction-${transaction.id}`,
          type: 'transaction' as const,
          title: transaction.description,
          timestamp: transaction.created_at,
          amount: transaction.amount,
          transactionType: transaction.transaction_type
        })) || [])
      ].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 10);

      setActivities(allActivities);
    } catch (error: any) {
      console.error('Error loading activities:', error);
      setError('Erreur lors du chargement des activités');
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    refreshActivities: loadActivities
  };
};