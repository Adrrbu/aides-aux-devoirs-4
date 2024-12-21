import { Test } from '../types';

export const PERSONALITY_TEST: Test = {
  title: "Test de personnalité RIASEC",
  description: "Ce test vous aide à identifier vos traits de personnalité professionnelle selon la méthode RIASEC (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel).",
  questions: [
    {
      id: "R1",
      text: "J'aime travailler avec des outils et des machines",
      category: "Réaliste"
    },
    {
      id: "R2",
      text: "Je préfère les activités physiques et manuelles",
      category: "Réaliste"
    },
    {
      id: "R3",
      text: "J'aime résoudre des problèmes concrets",
      category: "Réaliste"
    },
    {
      id: "I1",
      text: "J'aime analyser des problèmes complexes",
      category: "Investigateur"
    },
    {
      id: "I2",
      text: "Je suis curieux(se) de comprendre comment les choses fonctionnent",
      category: "Investigateur"
    },
    {
      id: "I3",
      text: "J'apprécie la recherche et l'investigation",
      category: "Investigateur"
    },
    {
      id: "A1",
      text: "J'aime être créatif(ve) et m'exprimer artistiquement",
      category: "Artistique"
    },
    {
      id: "A2",
      text: "J'apprécie l'originalité et l'innovation",
      category: "Artistique"
    },
    {
      id: "A3",
      text: "Je suis attiré(e) par les activités artistiques",
      category: "Artistique"
    },
    {
      id: "S1",
      text: "J'aime aider et conseiller les autres",
      category: "Social"
    },
    {
      id: "S2",
      text: "Je suis à l'aise pour communiquer avec différentes personnes",
      category: "Social"
    },
    {
      id: "S3",
      text: "Je m'intéresse au bien-être des autres",
      category: "Social"
    },
    {
      id: "E1",
      text: "J'aime diriger et influencer les autres",
      category: "Entreprenant"
    },
    {
      id: "E2",
      text: "Je suis à l'aise pour prendre des décisions",
      category: "Entreprenant"
    },
    {
      id: "E3",
      text: "J'apprécie les défis et la compétition",
      category: "Entreprenant"
    },
    {
      id: "C1",
      text: "J'aime l'ordre et la structure",
      category: "Conventionnel"
    },
    {
      id: "C2",
      text: "Je suis méthodique et organisé(e)",
      category: "Conventionnel"
    },
    {
      id: "C3",
      text: "Je préfère suivre des règles et des procédures établies",
      category: "Conventionnel"
    }
  ]
};