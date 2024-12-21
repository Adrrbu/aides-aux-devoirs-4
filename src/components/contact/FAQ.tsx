import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Comment fonctionne le système de points ?",
    answer: "Le système de points (izicoins) est basé sur vos performances. Vous gagnez des points en fonction de vos scores aux exercices et quiz : 1 izicoin pour 100%, 0.75 pour 75-99%, 0.50 pour 50-74%, 0.25 pour 25-49%."
  },
  {
    question: "Comment puis-je annuler mon abonnement ?",
    answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace 'Mon Abonnement'. L'annulation prendra effet à la fin de la période en cours."
  },
  {
    question: "Les cours sont-ils adaptés à tous les niveaux ?",
    answer: "Oui, nos cours sont personnalisés en fonction du niveau scolaire de chaque élève, du primaire au lycée, avec des contenus adaptés et une progression sur mesure."
  },
  {
    question: "Comment fonctionne l'assistant IA ?",
    answer: "L'assistant IA est disponible 24/7 pour répondre à vos questions, expliquer des concepts et vous aider dans vos révisions. Il s'adapte à votre niveau et peut vous guider pas à pas."
  },
  {
    question: "Puis-je télécharger les cours pour les réviser hors ligne ?",
    answer: "Oui, tous nos cours peuvent être téléchargés en PDF pour une révision hors ligne. Vous les retrouverez dans la section 'Mes cours' avec un bouton de téléchargement."
  },
  {
    question: "Comment sont générées les fiches de révision ?",
    answer: "Les fiches de révision sont créées automatiquement à partir des cours, en utilisant l'IA pour extraire les points clés et les organiser de manière claire et concise."
  },
  {
    question: "Y a-t-il une limite au nombre d'exercices ?",
    answer: "Le nombre d'exercices dépend de votre formule d'abonnement. La formule gratuite permet 5 exercices par jour, tandis que les formules payantes offrent un accès illimité."
  },
  {
    question: "Comment puis-je suivre les progrès de mon enfant ?",
    answer: "Vous pouvez suivre les progrès via le tableau de bord qui affiche les statistiques détaillées, les scores aux exercices et l'évolution dans chaque matière."
  }
];

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#151313]">
        <div className="flex justify-between items-center p-6 border-b bg-[#fccc42] rounded-t-2xl">
          <div className="flex items-center">
            <HelpCircle className="h-6 w-6 text-[#151313] mr-3" />
            <h2 className="text-xl font-semibold text-[#151313]">Questions fréquentes</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(90vh-8rem)] bg-[#f7f7f5]">
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#151313] overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-[#f7f7f5] transition-colors"
                >
                  <span className="font-medium text-[#151313]">{item.question}</span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-[#ff5734] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#ff5734] flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="p-4 pt-0 text-gray-600 border-t border-[#151313]/10">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQModal;