import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import AddChildModal from '../AddChildModal';
import ChildList from '../ChildList';
import ChildStatistics from '../ChildStatistics';
import ParentWallet from '../ParentWallet';

const ChildrenView: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select('*')
        .eq('parent_id', user.id);

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error loading children:', error);
      toast.error('Erreur lors du chargement des enfants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#151313]">Mes enfants</h2>
          <p className="text-gray-600">Gérez les comptes de vos enfants</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un enfant
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des enfants */}
        <div className="lg:col-span-1">
          <ChildList
            children={children}
            loading={loading}
            selectedChild={selectedChild}
            onSelectChild={setSelectedChild}
            onChildRemoved={() => {
              loadChildren();
              setSelectedChild(null);
            }}
          />
        </div>

        {/* Statistiques et cagnotte */}
        <div className="lg:col-span-2 space-y-6">
          {selectedChild && (
            <>
              <ChildStatistics childId={selectedChild} />
              <ParentWallet childId={selectedChild} />
            </>
          )}
        </div>
      </div>

      {/* Add Child Modal */}
      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onChildAdded={() => {
          loadChildren();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};

export default ChildrenView;