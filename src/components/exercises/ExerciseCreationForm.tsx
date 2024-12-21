import React, { useState } from 'react';
import { ArrowLeft, Brain } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateResponse } from '../../lib/openai';
import { SUBJECTS } from '../../lib/constants/subjects';
import { EDUCATION_LEVELS } from '../../lib/constants/educationLevels';
import { Exercise } from './types';
import ExerciseLoadingAnimation from '../ui/ExerciseLoadingAnimation';
import toast from 'react-hot-toast';

interface ExerciseCreationFormProps {
  onExerciseGenerated: (exercise: Exercise) => void;
  onBack: () => void;
  checkLimit: (limitType: string, currentUsage: number) => boolean;
  incrementUsage: (limitType: string) => Promise<void>;
  usageStats: any;
}

const TOPICS = {
  'Mathématiques': [
    { value: 'calcul', label: 'Calcul' },
    { value: 'geometrie', label: 'Géométrie' },
    { value: 'algebre', label: 'Algèbre' },
    { value: 'problemes', label: 'Problèmes' }
  ],
  'Français': [
    { value: 'grammaire', label: 'Grammaire' },
    { value: 'conjugaison', label: 'Conjugaison' },
    { value: 'orthographe', label: 'Orthographe' },
    { value: 'comprehension', label: 'Compréhension' }
  ],
  'Histoire-Géographie': [
    { value: 'histoire', label: 'Histoire' },
    { value: 'geographie', label: 'Géographie' }
  ],
  'Sciences': [
    { value: 'svt', label: 'SVT' },
    { value: 'physique', label: 'Physique' }
  ],
  'Anglais': [
    { value: 'grammaire', label: 'Grammaire' },
    { value: 'vocabulaire', label: 'Vocabulaire' }
  ]
};

const ExerciseCreationForm: React.FC<ExerciseCreationFormProps> = ({
  onExerciseGenerated,
  onBack,
  checkLimit,
  incrementUsage,
  usageStats
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLevelType, setSelectedLevelType] = useState<'college' | 'lycee'>('college');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!selectedSubject || !selectedTopic || !selectedLevel) return;

    if (!checkLimit('exercisesPerDay', usageStats.exercisesPerDay || 0)) {
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id')
        .eq('name', selectedSubject)
        .single();

      if (subjectError) throw subjectError;

      const prompt = `Génère un exercice de ${selectedSubject} sur le thème "${selectedTopic}" pour un niveau ${selectedLevel}. 
      L'exercice doit être adapté au niveau scolaire et inclure des questions progressives.`;
      
      const response = await generateResponse(prompt, 'quiz');
      
      if (typeof response === 'string') {
        throw new Error('Format de réponse invalide');
      }

      const { data: exercise, error: insertError } = await supabase
        .from('exercises')
        .insert([{
          user_id: user.id,
          subject_id: subjectData.id,
          title: response.title,
          description: `Exercice de ${selectedSubject} - ${selectedTopic}`,
          content: response,
          difficulty_level: selectedLevel,
          best_score: null
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      await incrementUsage('exercisesPerDay');
      onExerciseGenerated(exercise);
    } catch (error) {
      console.error('Error generating exercise:', error);
      toast.error('Erreur lors de la génération de l\'exercice');
    } finally {
      setIsGenerating(false);
    }
  };

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#151313]">Nouvel exercice</h2>
        <button
          onClick={onBack}
          className="text-[#151313] hover:text-[#ff5734]"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className={cardClasses}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Matière
            </label>
            <select
              required
              className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic('');
              }}
            >
              <option value="">Sélectionner une matière</option>
              {SUBJECTS.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Thème
            </label>
            <select
              required
              className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedSubject}
            >
              <option value="">Sélectionner un thème</option>
              {selectedSubject && TOPICS[selectedSubject as keyof typeof TOPICS]?.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#151313] mb-1">
                Type d'établissement
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedLevelType('college')}
                  className={`flex-1 py-2 px-4 rounded-xl border border-[#151313] ${
                    selectedLevelType === 'college'
                      ? 'bg-[#ff5734] text-white'
                      : 'bg-white text-[#151313] hover:bg-[#f7f7f5]'
                  }`}
                >
                  Collège
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLevelType('lycee')}
                  className={`flex-1 py-2 px-4 rounded-xl border border-[#151313] ${
                    selectedLevelType === 'lycee'
                      ? 'bg-[#ff5734] text-white'
                      : 'bg-white text-[#151313] hover:bg-[#f7f7f5]'
                  }`}
                >
                  Lycée
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#151313] mb-1">
                Niveau
              </label>
              <select
                required
                className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Sélectionner un niveau</option>
                {EDUCATION_LEVELS[selectedLevelType].map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isGenerating || !selectedSubject || !selectedTopic || !selectedLevel}
          className={`mt-8 w-full inline-flex items-center justify-center px-4 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white ${
            isGenerating || !selectedSubject || !selectedTopic || !selectedLevel
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
          }`}
        >
          <Brain className="h-5 w-5 mr-2" />
          {isGenerating ? 'Génération en cours...' : 'Générer l\'exercice'}
        </button>
      </div>

      {isGenerating && <ExerciseLoadingAnimation />}
    </div>
  );
};

export default ExerciseCreationForm;