import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface ParentChatSuggestionsProps {
  onQuestionClick?: (question: string) => void;
}

const QUESTION_CATEGORIES = [
  {
    id: 'orientation',
    title: 'Orientation',
    icon: '🎯',
    questions: [
      'Comment aider mon enfant à choisir ses spécialités au lycée ?',
      'Quelles sont les filières les plus adaptées après le bac ?',
      'Comment préparer Parcoursup avec mon enfant ?',
      'Quelles sont les différentes voies possibles après le collège ?',
      'Comment l\'aider à construire son projet professionnel ?',
      'Quelles sont les alternatives à la voie générale ?',
      'Comment valoriser son dossier scolaire ?',
      'Quand commencer l\'orientation post-bac ?'
    ]
  },
  {
    id: 'methodology',
    title: 'Méthodologie',
    icon: '📝',
    questions: [
      'Comment aider mon enfant à s\'organiser dans son travail ?',
      'Quelles sont les meilleures méthodes de révision ?',
      'Comment gérer le stress avant les examens ?',
      'Comment motiver mon enfant à travailler ?',
      'Comment l\'aider à planifier ses révisions ?',
      'Quelle routine de travail mettre en place ?',
      'Comment améliorer sa concentration ?',
      'Comment l\'aider à prendre des notes efficacement ?'
    ]
  },
  {
    id: 'support',
    title: 'Accompagnement',
    icon: '🤝',
    questions: [
      'Comment suivre les progrès de mon enfant ?',
      'Quand faut-il envisager du soutien scolaire ?',
      'Comment réagir face à une baisse des notes ?',
      'Comment communiquer avec les professeurs ?',
      'Comment l\'aider sans faire à sa place ?',
      'Quel rôle jouer dans sa scolarité ?',
      'Comment gérer les devoirs à la maison ?',
      'Quand s\'inquiéter de ses résultats ?'
    ]
  },
  {
    id: 'wellbeing',
    title: 'Bien-être',
    icon: '🌟',
    questions: [
      'Comment aider mon enfant à gérer son temps d\'écran ?',
      'Comment équilibrer travail scolaire et loisirs ?',
      'Que faire en cas de harcèlement scolaire ?',
      'Comment détecter les signes de décrochage scolaire ?',
      'Comment gérer l\'anxiété scolaire ?',
      'Comment favoriser son autonomie ?',
      'Comment l\'aider à gérer son sommeil ?',
      'Comment renforcer sa confiance en lui ?'
    ]
  },
  {
    id: 'difficulties',
    title: 'Difficultés',
    icon: '💡',
    questions: [
      'Comment repérer les troubles de l\'apprentissage ?',
      'Que faire en cas de dyslexie ?',
      'Comment adapter le travail aux troubles dys ?',
      'Quels aménagements demander à l\'école ?',
      'Comment obtenir un PAP ou un PPS ?',
      'Vers quels professionnels se tourner ?',
      'Comment l\'aider à surmonter ses difficultés ?',
      'Quels sont ses droits en tant qu\'élève dys ?'
    ]
  },
  {
    id: 'digital',
    title: 'Numérique',
    icon: '💻',
    questions: [
      'Comment encadrer l\'usage des réseaux sociaux ?',
      'Quels outils numériques pour les devoirs ?',
      'Comment protéger mon enfant en ligne ?',
      'Quel temps d\'écran autoriser ?',
      'Comment utiliser le numérique pour apprendre ?',
      'Quelles applications éducatives recommander ?',
      'Comment gérer les distractions numériques ?',
      'Comment l\'accompagner sur internet ?'
    ]
  }
];

const ParentChatSuggestions: React.FC<ParentChatSuggestionsProps> = ({ onQuestionClick }) => {
  const [activeCategory, setActiveCategory] = useState(QUESTION_CATEGORIES[0].id);

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-[#151313]">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent p-4 pb-2 mb-2 border-b">
        {QUESTION_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center flex-shrink-0 px-4 py-2 mr-2 rounded-xl text-sm font-medium transition-colors border border-[#151313] ${
              activeCategory === category.id
                ? 'bg-[#ff5734] text-white'
                : 'bg-white text-[#151313] hover:bg-[#f7f7f5]'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.title}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {QUESTION_CATEGORIES.find(c => c.id === activeCategory)?.questions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick?.(question)}
              className="w-full text-left p-4 rounded-xl text-sm bg-white hover:bg-[#f7f7f5] text-[#151313] transition-colors border border-[#151313] flex items-center group"
            >
              <span className="flex-1">{question}</span>
              <ChevronRight className="h-4 w-4 text-[#ff5734] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentChatSuggestions;