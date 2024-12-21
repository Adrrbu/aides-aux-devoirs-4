import React, { useState, useEffect } from 'react';
import { Brain, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

const LEARNING_DIFFICULTIES = [
  {
    id: 'dyslexia',
    name: 'Dyslexie',
    description: 'Difficultés avec la lecture et l\'écriture'
  },
  {
    id: 'dysorthographia',
    name: 'Dysorthographie',
    description: 'Problèmes d\'orthographe et de transcription'
  },
  {
    id: 'dyscalculia',
    name: 'Dyscalculie',
    description: 'Difficultés avec le calcul et les mathématiques'
  },
  {
    id: 'dysphasia',
    name: 'Dysphasie',
    description: 'Troubles du langage oral'
  },
  {
    id: 'dyspraxia',
    name: 'Dyspraxie',
    description: 'Difficultés avec la coordination et les gestes'
  },
  {
    id: 'dysgraphia',
    name: 'Dysgraphie',
    description: 'Problèmes avec l\'écriture manuscrite'
  }
];

const LearningDifficultiesSection: React.FC = () => {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserDifficulties();
  }, []);

  const loadUserDifficulties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('learning_difficulties')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setSelectedDifficulties(data?.learning_difficulties || []);
    } catch (error) {
      console.error('Error loading learning difficulties:', error);
      toast.error('Erreur lors du chargement des préférences');
    }
  };

  const handleToggleDifficulty = (difficultyId: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficultyId)
        ? prev.filter(id => id !== difficultyId)
        : [...prev, difficultyId]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase.rpc('update_user_learning_difficulties', {
        difficulties: selectedDifficulties
      });

      if (error) throw error;
      toast.success('Préférences mises à jour avec succès');
    } catch (error) {
      console.error('Error saving learning difficulties:', error);
      toast.error('Erreur lors de la sauvegarde des préférences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-[#ff5734]/10 p-3 rounded-xl">
              <Brain className="h-6 w-6 text-[#ff5734]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#151313]">
                Difficultés d'Apprentissage
              </h3>
              <p className="text-sm text-gray-500">
                Sélectionnez les difficultés d'apprentissage à prendre en compte
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNING_DIFFICULTIES.map((difficulty) => (
            <div
              key={difficulty.id}
              className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                selectedDifficulties.includes(difficulty.id)
                  ? 'border-[#ff5734] bg-[#ff5734]/5'
                  : 'border-[#151313] hover:border-[#ff5734]'
              }`}
              onClick={() => handleToggleDifficulty(difficulty.id)}
            >
              <h4 className="font-medium text-[#151313]">{difficulty.name}</h4>
              <p className="mt-1 text-sm text-gray-500">{difficulty.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white ${
              isSaving ? 'bg-gray-400' : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
            }`}
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="bg-[#f7f7f5] rounded-xl p-4 border border-[#151313]">
        <p className="text-sm text-gray-600">
          Ces informations nous permettent d'adapter le contenu et les explications 
          à vos besoins spécifiques. Toutes les données sont traitées de manière 
          confidentielle.
        </p>
      </div>
    </div>
  );
};

export default LearningDifficultiesSection;