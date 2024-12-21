import { 
  BookOpen, Brain, Calendar, FileText, ClipboardList, 
  BarChart3, Wand2, PlaySquare, Target, Trophy, 
  Sparkles, Wallet, Gift, Coins, Compass
} from 'lucide-react';
import { OnboardingStep } from '../../types/onboarding';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Bienvenue sur Aizily ! 👋",
    description: "Découvrez votre plateforme d'apprentissage personnalisé. Commençons par explorer les fonctionnalités essentielles pour votre réussite scolaire.",
    icon: BookOpen,
    color: "#ff5734",
    features: [
      {
        icon: Brain,
        title: "Apprentissage adaptatif",
        description: "Des exercices et cours qui s'adaptent à votre niveau"
      },
      {
        icon: Target,
        title: "Progression personnalisée",
        description: "Un parcours d'apprentissage sur mesure"
      },
      {
        icon: Sparkles,
        title: "Aide intelligente",
        description: "Un soutien adapté à vos besoins"
      }
    ]
  },
  {
    title: "Exercices et cours 📚",
    description: "Accédez à une vaste bibliothèque d'exercices interactifs et de cours adaptés à votre niveau.",
    icon: BookOpen,
    color: "#ff5734",
    features: [
      {
        icon: Brain,
        title: "Exercices personnalisés",
        description: "Des exercices qui s'adaptent à votre niveau et votre rythme"
      },
      {
        icon: Target,
        title: "Correction détaillée",
        description: "Des explications pour chaque réponse"
      },
      {
        icon: Trophy,
        title: "Suivi des progrès",
        description: "Visualisez votre progression par matière"
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
        title: "Aide aux devoirs",
        description: "Des explications claires et adaptées"
      },
      {
        icon: Sparkles,
        title: "Génération d'exercices",
        description: "Des exercices supplémentaires sur mesure"
      },
      {
        icon: Target,
        title: "Support personnalisé",
        description: "Une aide qui s'adapte à vos besoins"
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
        title: "Génération intelligente",
        description: "Des fiches adaptées à votre niveau"
      },
      {
        icon: Target,
        title: "Organisation optimale",
        description: "Classement par matière et thème"
      },
      {
        icon: Trophy,
        title: "Mémorisation efficace",
        description: "Des fiches conçues pour mieux retenir"
      }
    ]
  },
  {
    title: "Contrôles et examens 📋",
    description: "Préparez vos contrôles avec des sessions de révision personnalisées et des quiz adaptatifs.",
    icon: ClipboardList,
    color: "#be94f5",
    features: [
      {
        icon: Brain,
        title: "Préparation ciblée",
        description: "Des exercices spécifiques pour chaque contrôle"
      },
      {
        icon: Target,
        title: "Plan de révision",
        description: "Organisation optimale des révisions"
      },
      {
        icon: Trophy,
        title: "Quiz de préparation",
        description: "Testez vos connaissances avant l'examen"
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
    title: "Orientation et carrière 🧭",
    description: "Découvrez vos talents et explorez les parcours professionnels qui vous correspondent.",
    icon: Compass,
    color: "#ff5734",
    features: [
      {
        icon: Brain,
        title: "Tests d'orientation",
        description: "Découvrez vos points forts et vos intérêts"
      },
      {
        icon: Target,
        title: "Conseils personnalisés",
        description: "Des recommandations adaptées à votre profil"
      },
      {
        icon: Sparkles,
        title: "Exploration des métiers",
        description: "Découvrez les carrières qui vous correspondent"
      }
    ]
  },
  {
    title: "Statistiques et progrès 📈",
    description: "Suivez votre progression et identifiez vos points forts et axes d'amélioration.",
    icon: BarChart3,
    color: "#151313"
  },
  {
    title: "Système de récompenses 🏆",
    description: "Gagnez des izicoins en progressant et échangez-les contre des récompenses.",
    icon: Gift,
    color: "#fccc42",
    features: [
      {
        icon: Trophy,
        title: "Gagnez des points",
        description: "Récompenses basées sur vos performances"
      },
      {
        icon: Gift,
        title: "Échangez vos gains",
        description: "Cartes cadeaux et récompenses diverses"
      },
      {
        icon: Target,
        title: "Objectifs et défis",
        description: "Relevez des défis pour gagner plus"
      }
    ]
  }
];