import { Test } from '../types';

export const APTITUDE_TEST: Test = {
  title: "Test d'aptitudes",
  description: "Évaluez vos compétences dans différents domaines pour identifier vos points forts et vos domaines d'excellence.",
  questions: [
    {
      id: "V1",
      text: "Je comprends facilement des textes complexes",
      category: "Verbal"
    },
    {
      id: "V2",
      text: "Je m'exprime clairement à l'écrit",
      category: "Verbal"
    },
    {
      id: "V3",
      text: "J'ai un bon vocabulaire",
      category: "Verbal"
    },
    {
      id: "N1",
      text: "Je suis à l'aise avec les chiffres et les calculs",
      category: "Numérique"
    },
    {
      id: "N2",
      text: "Je comprends facilement les graphiques et les statistiques",
      category: "Numérique"
    },
    {
      id: "N3",
      text: "Je résous rapidement des problèmes mathématiques",
      category: "Numérique"
    },
    {
      id: "L1",
      text: "Je repère facilement les patterns et les séquences logiques",
      category: "Logique"
    },
    {
      id: "L2",
      text: "J'analyse efficacement les situations complexes",
      category: "Logique"
    },
    {
      id: "L3",
      text: "Je trouve rapidement des solutions aux problèmes",
      category: "Logique"
    },
    {
      id: "S1",
      text: "Je visualise facilement les objets en 3D",
      category: "Spatial"
    },
    {
      id: "S2",
      text: "Je m'oriente bien dans l'espace",
      category: "Spatial"
    },
    {
      id: "S3",
      text: "Je comprends bien les schémas et les plans",
      category: "Spatial"
    },
    {
      id: "T1",
      text: "Je suis habile de mes mains",
      category: "Technique"
    },
    {
      id: "T2",
      text: "Je comprends facilement le fonctionnement des machines",
      category: "Technique"
    },
    {
      id: "T3",
      text: "J'aime réparer ou construire des choses",
      category: "Technique"
    }
  ]
};