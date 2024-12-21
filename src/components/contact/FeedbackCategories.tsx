import React from 'react';
import { 
  Bug, 
  Lightbulb, 
  HelpCircle, 
  AlertTriangle, 
  ThumbsUp,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface FeedbackCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  {
    id: 'bug',
    name: 'Signaler un bug',
    description: 'Un problème technique à nous remonter',
    icon: Bug,
    color: '#ff5734'
  },
  {
    id: 'suggestion',
    name: 'Suggestion',
    description: 'Une idée pour améliorer la plateforme',
    icon: Lightbulb,
    color: '#fccc42'
  },
  {
    id: 'question',
    name: 'Question',
    description: 'Besoin d\'aide ou d\'informations',
    icon: HelpCircle,
    color: '#be94f5'
  },
  {
    id: 'content',
    name: 'Contenu pédagogique',
    description: 'Remarque sur les cours ou exercices',
    icon: BookOpen,
    color: '#151313'
  },
  {
    id: 'feature',
    name: 'Nouvelle fonctionnalité',
    description: 'Une fonctionnalité que vous aimeriez voir',
    icon: Sparkles,
    color: '#ff5734'
  },
  {
    id: 'other',
    name: 'Autre',
    description: 'Tout autre type de retour',
    icon: ThumbsUp,
    color: '#be94f5'
  }
];

const FeedbackCategories: React.FC<FeedbackCategoriesProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="space-y-4">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              isSelected
                ? 'border-[#ff5734] bg-[#ff5734]/5'
                : 'border-[#151313] hover:border-[#ff5734] bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Icon style={{ color: category.color }} className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-[#151313]">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FeedbackCategories;