export enum ExerciseType {
  FACTORISATION = 'FACTORISATION',
  EQUATION = 'EQUATION',
  DEVELOPMENT = 'DEVELOPMENT'
}

export enum ExerciseCategory {
  COMMON_FACTOR = 'Facteur Commun',
  IDENTITY = 'Identités Remarquables',
  DIFF_SQUARES = 'Différence de Carrés',
  RATIONAL_EQ = 'Équations Rationnelles',
  TRINOMIAL = 'Trinômes',
  MIX = 'Mélange'
}

export enum Difficulty {
  EASY = 'Facile',
  MEDIUM = 'Moyen',
  HARD = 'Difficile'
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  category: ExerciseCategory; // New field for grouping
  title: string;
  instruction: string;
  expression: string; // The mathematical expression in computer notation for evaluation
  displayExpression?: string; // The mathematical expression in LaTeX for display (e.g. fractions)
  target: string; // The simplest form/solution
  difficulty: Difficulty;
  hint: string;
  initialValue?: string; // For equation solving, maybe start with the equation
}

export interface ExerciseStep {
  latex: string;
  isCorrect: boolean;
  message?: string;
}

// Representing a point for graphing
export interface Point {
  x: number;
  y: number;
}