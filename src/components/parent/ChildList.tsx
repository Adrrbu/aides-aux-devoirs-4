import React from 'react';
import { Users } from 'lucide-react';
import ChildCard from './ChildCard';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ChildListProps {
  children: any[];
  loading: boolean;
  selectedChild: string | null;
  onSelectChild: (childId: string) => void;
  onChildRemoved: () => void;
}

const ChildList: React.FC<ChildListProps> = ({
  children,
  loading,
  selectedChild,
  onSelectChild,
  onChildRemoved
}) => {
  const handleDeleteChild = async (childId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('parent_child_relationships')
        .delete()
        .eq('parent_id', user.id)
        .eq('child_id', childId);

      if (error) throw error;

      toast.success('Compte enfant supprimé avec succès');
      onChildRemoved();
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error('Erreur lors de la suppression du compte');
    }
  };

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  if (loading) {
    return (
      <div className={`${cardClasses} animate-pulse`}>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-xl bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className={`${cardClasses} text-center py-8`}>
        <Users className="mx-auto h-12 w-12 text-[#ff5734]" />
        <h3 className="mt-2 text-sm font-medium text-[#151313]">Aucun enfant</h3>
        <p className="mt-1 text-xs text-gray-500">
          Commencez par ajouter le compte de votre enfant
        </p>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <h3 className="text-lg font-medium text-[#151313] mb-6">Mes enfants</h3>
      <div className="space-y-4">
        {children.map((child) => (
          <ChildCard
            key={child.child_id}
            child={{
              id: child.child_id,
              firstName: child.child_first_name,
              lastName: child.child_last_name,
              avatarUrl: child.child_avatar_url
            }}
            isSelected={selectedChild === child.child_id}
            onClick={() => onSelectChild(child.child_id)}
            onDelete={() => handleDeleteChild(child.child_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChildList;