import { Exercise, ExerciseType, ExerciseCategory, Difficulty } from '../types';

export const EXERCISES: Exercise[] = [
  // --- Common Factors ---
  {
    id: 'cf1',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.COMMON_FACTOR,
    title: 'Mise en évidence simple',
    instruction: 'Factorise l\'expression en trouvant le facteur commun :',
    expression: '(x+3)(2x-5) - (x+3)(x+1)',
    displayExpression: '(x+3)(2x-5) - (x+3)(x+1)',
    target: '(x+3)(x-6)',
    difficulty: Difficulty.MEDIUM,
    hint: 'Le terme (x+3) apparaît deux fois. Mets-le en évidence.'
  },
  {
    id: 'cf2',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.COMMON_FACTOR,
    title: 'Facteur caché',
    instruction: 'Factorise avec facteur caché :',
    expression: '(6x+3)(x-2) + (2x+1)(x+5)',
    displayExpression: '(6x+3)(x-2) + (2x+1)(x+5)',
    target: '(2x+1)(4x-1)',
    difficulty: Difficulty.HARD,
    hint: 'Regarde le terme (6x+3). Tu peux factoriser 3 pour faire apparaître (2x+1).'
  },
  {
    id: 'cf3',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.COMMON_FACTOR,
    title: 'Mise en évidence multiple',
    instruction: 'Factorise l\'expression suivante :',
    expression: 'x^2(x-1) + 4x(x-1)',
    displayExpression: 'x^2(x-1) + 4x(x-1)',
    target: 'x(x-1)(x+4)',
    difficulty: Difficulty.MEDIUM,
    hint: 'Mets d\'abord (x-1) en évidence, puis regarde s\'il reste un facteur commun x.'
  },

  // --- Perfect Squares (Identities) ---
  {
    id: 'id1',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.IDENTITY,
    title: 'Carré parfait',
    instruction: 'Factorise au maximum l\'expression suivante :',
    expression: '16x^2 - 24x + 9',
    displayExpression: '16x^2 - 24x + 9',
    target: '(4x-3)^2',
    difficulty: Difficulty.MEDIUM,
    hint: 'Observe les coefficients. Est-ce une identité remarquable du type a² - 2ab + b² ?'
  },
  {
    id: 'id2',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.IDENTITY,
    title: 'Identité remarquable',
    instruction: 'Factorise l\'expression :',
    expression: 'x^2 + 10x + 25',
    displayExpression: 'x^2 + 10x + 25',
    target: '(x+5)^2',
    difficulty: Difficulty.EASY,
    hint: 'Cherche la forme a² + 2ab + b².'
  },
  {
    id: 'id3',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.IDENTITY,
    title: 'Somme de cubes',
    instruction: 'Factorise (Somme de cubes) :',
    expression: '64x^3 + 27',
    displayExpression: '64x^3 + 27',
    target: '(4x+3)(16x^2-12x+9)',
    difficulty: Difficulty.HARD,
    hint: 'C\'est une somme de cubes : a³ + b³ = (a+b)(a²-ab+b²). Ici a=4x et b=3.'
  },

  // --- Difference of Squares ---
  {
    id: 'ds1',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.DIFF_SQUARES,
    title: 'Différence de carrés complexe',
    instruction: 'Factorise (Différence de carrés) :',
    expression: '(3x+4)^2 - (2x-1)^2',
    displayExpression: '(3x+4)^2 - (2x-1)^2',
    target: '(5x+3)(x+5)',
    difficulty: Difficulty.HARD,
    hint: 'Utilise l\'identité remarquable a² - b² = (a+b)(a-b). Ici a=(3x+4) et b=(2x-1).'
  },
  {
    id: 'ds2',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.DIFF_SQUARES,
    title: 'Différence de carrés simple',
    instruction: 'Factorise :',
    expression: '25x^2 - 49',
    displayExpression: '25x^2 - 49',
    target: '(5x-7)(5x+7)',
    difficulty: Difficulty.EASY,
    hint: 'a² - b² = (a-b)(a+b)'
  },
  {
    id: 'ds3',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.DIFF_SQUARES,
    title: 'Différence de carrés avec facteur',
    instruction: 'Factorise complètement :',
    expression: '2x^2 - 18',
    displayExpression: '2x^2 - 18',
    target: '2(x-3)(x+3)',
    difficulty: Difficulty.MEDIUM,
    hint: 'Commence par mettre 2 en évidence.'
  },

  // --- Trinomials ---
  {
    id: 'tr1',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.TRINOMIAL,
    title: 'Trinôme unitaire',
    instruction: 'Factorise ce trinôme :',
    expression: 'x^2 - 7x + 12',
    displayExpression: 'x^2 - 7x + 12',
    target: '(x-3)(x-4)',
    difficulty: Difficulty.MEDIUM,
    hint: 'Trouve deux nombres dont le produit est 12 et la somme est -7.'
  },
  {
    id: 'tr2',
    type: ExerciseType.FACTORISATION,
    category: ExerciseCategory.TRINOMIAL,
    title: 'Trinôme non-unitaire',
    instruction: 'Factorise :',
    expression: '2x^2 + 7x + 3',
    displayExpression: '2x^2 + 7x + 3',
    target: '(2x+1)(x+3)',
    difficulty: Difficulty.HARD,
    hint: 'Cherche deux nombres dont le produit est 6 (2*3) et la somme est 7.'
  },

  // --- Rational Equations ---
  {
    id: 're1',
    type: ExerciseType.EQUATION,
    category: ExerciseCategory.RATIONAL_EQ,
    title: 'Équation Rationnelle',
    instruction: 'Résous l\'équation suivante.',
    expression: '2/(x-3) - 4/(x^2-9) - 1/(x+3)', 
    initialValue: '2/(x-3) - 4/(x^2-9) = 1/(x+3)',
    displayExpression: '\\frac{2}{x-3} - \\frac{4}{x^2-9} = \\frac{1}{x+3}',
    target: 'x=-5', 
    difficulty: Difficulty.HARD,
    hint: 'Factorise x²-9 en (x-3)(x+3). Mets tout au même dénominateur.'
  },
  {
    id: 're2',
    type: ExerciseType.EQUATION,
    category: ExerciseCategory.RATIONAL_EQ,
    title: 'Équation Simple',
    instruction: 'Résous l\'équation :',
    expression: '1/(x+1) - 2', 
    initialValue: '1/(x+1) = 2',
    displayExpression: '\\frac{1}{x+1} = 2',
    target: 'x=-0.5',
    difficulty: Difficulty.MEDIUM,
    hint: 'Multiplie chaque côté par (x+1).'
  }
];