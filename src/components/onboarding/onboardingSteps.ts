import { LucideIcon, BookOpen, Brain, Calendar, FileText, ClipboardList, BarChart3, Wand2, PlaySquare, Target, Trophy, Sparkles } from 'lucide-react';

interface OnboardingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface OnboardingStepType {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features?: OnboardingFeature[];
}

export const ONBOARDING_STEPS: OnboardingStepType[] = [
  {
    title: "Bienvenue sur Aizily ! 👋",
    description: "Découvrez votre assistant d'apprentissage intelligent. Nous allons vous guider à travers les principales fonctionnalités de la plateforme.",
    icon: BookOpen,
    color: "#ff5734",
    features: [
      {
        icon: Brain,
        title: "Apprentissage adaptatif",
        description: "Des cours personnalisés qui s'adaptent à votre niveau"
      },
      {
        icon: Target,
        title: "Objectifs personnalisés",
        description: "Définissez et atteignez vos objectifs scolaires"
      },
      {
        icon: Trophy,
        title: "Suivi des progrès",
        description: "Visualisez votre progression en temps réel"
      }
    ]
  },
  {
    title: "Assistant IA 🤖",
    description: "Votre tuteur personnel disponible 24/7 pour répondre à toutes vos questions et vous aider dans vos révisions.",
    icon: Wand2,
    color: "#be94f5",
    features: [
      {
        icon: Brain,
        title: "Questions illimitées",
        description: "Posez toutes vos questions, à tout moment"
      },
      {
        icon: Sparkles,
        title: "Réponses personnalisées",
        description: "Des explications adaptées à votre niveau"
      },
      {
        icon: Target,
        title: "Aide aux devoirs",
        description: "Un soutien pour tous vos exercices"
      }
    ]
  },
  {
    title: "Cours et exercices 📚",
    description: "Accédez à une vaste bibliothèque de cours interactifs et d'exercices adaptés à votre niveau.",
    icon: BookOpen,
    color: "#fccc42",
    features: [
      {
        icon: Brain,
        title: "Cours interactifs",
        description: "Des leçons enrichies et dynamiques"
      },
      {
        icon: Target,
        title: "Exercices adaptés",
        description: "Une difficulté qui s'ajuste à vos progrès"
      },
      {
        icon: Trophy,
        title: "Quiz et évaluations",
        description: "Testez vos connaissances régulièrement"
      }
    ]
  },
  {
    title: "Planning et organisation 📅",
    description: "Organisez votre temps d'étude efficacement avec notre planificateur intelligent.",
    icon: Calendar,
    color: "#151313",
    features: [
      {
        icon: Calendar,
        title: "Planning personnalisé",
        description: "Un emploi du temps adapté à votre rythme"
      },
      {
        icon: Target,
        title: "Rappels intelligents",
        description: "Ne manquez aucune session de révision"
      },
      {
        icon: Brain,
        title: "Gestion du temps",
        description: "Optimisez votre temps d'étude"
      }
    ]
  },
  {
    title: "Fiches de révision 📝",
    description: "Créez et consultez des fiches de révision générées par l'IA pour un apprentissage efficace.",
    icon: FileText,
    color: "#ff5734",
    features: [
      {
        icon: Brain,
        title: "Génération automatique",
        description: "Des fiches créées par l'IA"
      },
      {
        icon: Target,
        title: "Organisation intelligente",
        description: "Classement par matière et thème"
      },
      {
        icon: Trophy,
        title: "Révision optimisée",
        description: "Mémorisez plus efficacement"
      }
    ]
  },
  {
    title: "Contrôles et examens 📋",
    description: "Préparez vos contrôles avec des sessions de révision personnalisées et des quiz adaptatifs.",
    icon: ClipboardList,
    color: "#be94f5"
  },
  {
    title: "Vidéos éducatives 🎥",
    description: "Regardez des vidéos pédagogiques sélectionnées pour compléter votre apprentissage.",
    icon: PlaySquare,
    color: "#fccc42"
  },
  {
    title: "Statistiques et progrès 📈",
    description: "Suivez votre progression et identifiez vos points forts et axes d'amélioration.",
    icon: BarChart3,
    color: "#151313"
  }
];