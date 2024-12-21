import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const QUESTION_CATEGORIES = [
  {
    id: 'homework',
    title: 'Aide aux devoirs',
    icon: '📚',
    questions: [
      'Peux-tu m\'expliquer le théorème de Pythagore ?',
      'Comment analyser un texte littéraire ?',
      'Quelles sont les causes de la Révolution française ?',
      'Comment résoudre une équation du second degré ?',
      'Comment accorder les participes passés ?',
      'Quelle est la différence entre mitose et méiose ?',
      'Comment calculer une dérivée ?',
      'Quels sont les temps primitifs en anglais ?'
    ]
  },
  {
    id: 'methodology',
    title: 'Méthodologie',
    icon: '📝',
    questions: [
      'Comment organiser mon temps de révision ?',
      'Quelles sont les meilleures techniques de mémorisation ?',
      'Comment prendre des notes efficacement ?',
      'Comment préparer un exposé oral ?',
      'Comment gérer son stress avant un examen ?',
      'Comment faire une fiche de révision efficace ?',
      'Quelle méthode pour apprendre du vocabulaire ?',
      'Comment améliorer sa concentration ?'
    ]
  },
  {
    id: 'orientation',
    title: 'Orientation',
    icon: '🎯',
    questions: [
      'Quels sont les débouchés après un bac S ?',
      'Comment choisir sa spécialité au lycée ?',
      'Quelles études pour devenir ingénieur ?',
      'Comment préparer Parcoursup ?',
      'Quelles sont les filières sélectives après le bac ?',
      'Comment intégrer une classe préparatoire ?',
      'Quels métiers dans le domaine scientifique ?',
      'Comment devenir professeur ?'
    ]
  },
  {
    id: 'skills',
    title: 'Compétences',
    icon: '💡',
    questions: [
      'Comment améliorer sa rédaction ?',
      'Comment développer son esprit critique ?',
      'Comment mieux s\'exprimer à l\'oral ?',
      'Comment améliorer sa lecture rapide ?',
      'Comment développer sa créativité ?',
      'Comment mieux argumenter ?',
      'Comment améliorer sa mémoire ?',
      'Comment gérer son temps efficacement ?'
    ]
  },
  {
    id: 'exams',
    title: 'Examens',
    icon: '📋',
    questions: [
      'Comment réviser efficacement pour le bac ?',
      'Comment gérer son temps pendant une épreuve ?',
      'Comment structurer une dissertation ?',
      'Comment réussir l\'oral du bac ?',
      'Quelles sont les erreurs à éviter au bac ?',
      'Comment gérer son stress le jour J ?',
      'Comment organiser ses révisions ?',
      'Comment s\'entraîner aux exercices types ?'
    ]
  },
  {
    id: 'languages',
    title: 'Langues',
    icon: '🌍',
    questions: [
      'Comment améliorer sa prononciation en anglais ?',
      'Comment apprendre du vocabulaire efficacement ?',
      'Comment progresser en expression orale ?',
      'Comment comprendre les temps en anglais ?',
      'Comment réussir une version en langues ?',
      'Comment préparer un oral en langue ?',
      'Comment améliorer sa compréhension orale ?',
      'Comment mémoriser les verbes irréguliers ?'
    ]
  }
];

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onQuestionClick }) => {
  const [activeCategory, setActiveCategory] = useState(QUESTION_CATEGORIES[0].id);

  return (
    <div className="h-full flex flex-col">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-2 mb-4">
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
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="space-y-2">
          {QUESTION_CATEGORIES.find(c => c.id === activeCategory)?.questions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question)}
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

export default SuggestedQuestions;