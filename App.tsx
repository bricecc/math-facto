import React, { useState } from 'react';
import { Exercise, ExerciseCategory } from './types';
import { EXERCISES } from './data/exercises';
import ExerciseView from './views/ExerciseView';
import Latex from 'react-latex-next';
import { 
  GraduationCap, 
  ArrowLeft, 
  Layers, 
  Divide, 
  Superscript, 
  Minimize2, 
  Shuffle,
  FunctionSquare
} from 'lucide-react';

const App: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);

  // Helper to pick a random exercise from a category
  const pickRandomExercise = (category: ExerciseCategory): Exercise => {
    let pool = EXERCISES;
    if (category !== ExerciseCategory.MIX) {
      pool = EXERCISES.filter(ex => ex.category === category);
    }
    
    // If pool is empty (shouldn't happen with correct data), fallback to all
    if (pool.length === 0) pool = EXERCISES;

    const randomIndex = Math.floor(Math.random() * pool.length);
    // Simple logic: if we pick the same one as current, try next one (ring buffer)
    if (currentExercise && pool.length > 1 && pool[randomIndex].id === currentExercise.id) {
        return pool[(randomIndex + 1) % pool.length];
    }
    return pool[randomIndex];
  };

  const handleCategorySelect = (category: ExerciseCategory) => {
    setSelectedCategory(category);
    setCurrentExercise(pickRandomExercise(category));
    window.scrollTo(0, 0);
  };

  const handleNextExercise = () => {
    if (selectedCategory) {
      setCurrentExercise(pickRandomExercise(selectedCategory));
      window.scrollTo(0, 0);
    }
  };

  const handleBackToMenu = () => {
    setCurrentExercise(null);
    setSelectedCategory(null);
  };

  const getCategoryIcon = (cat: ExerciseCategory) => {
    switch (cat) {
      case ExerciseCategory.COMMON_FACTOR: return <Minimize2 className="w-8 h-8 text-blue-500" />;
      case ExerciseCategory.IDENTITY: return <Superscript className="w-8 h-8 text-purple-500" />;
      case ExerciseCategory.DIFF_SQUARES: return <Layers className="w-8 h-8 text-emerald-500" />;
      case ExerciseCategory.RATIONAL_EQ: return <Divide className="w-8 h-8 text-orange-500" />;
      case ExerciseCategory.TRINOMIAL: return <FunctionSquare className="w-8 h-8 text-pink-500" />;
      case ExerciseCategory.MIX: return <Shuffle className="w-8 h-8 text-indigo-500" />;
      default: return <GraduationCap className="w-8 h-8 text-slate-500" />;
    }
  };

  const getCategoryDescription = (cat: ExerciseCategory) => {
    switch (cat) {
      case ExerciseCategory.COMMON_FACTOR: return "Mise en évidence simple et double.";
      case ExerciseCategory.IDENTITY: return "Carrés parfaits et sommes de cubes.";
      case ExerciseCategory.DIFF_SQUARES: return "La fameuse identité a² - b².";
      case ExerciseCategory.RATIONAL_EQ: return "Équations avec des fractions.";
      case ExerciseCategory.TRINOMIAL: return "Somme et produit, trinômes unitaires.";
      case ExerciseCategory.MIX: return "Un mélange de tous les types pour te tester.";
      default: return "";
    }
  };

  const getCategoryExample = (cat: ExerciseCategory) => {
    switch (cat) {
      case ExerciseCategory.COMMON_FACTOR: return "$3x(x+2) - 5(x+2)$";
      case ExerciseCategory.IDENTITY: return "$4x^2 - 12x + 9$";
      case ExerciseCategory.DIFF_SQUARES: return "$25x^2 - 64$";
      case ExerciseCategory.RATIONAL_EQ: return "$\\frac{3}{x-1} - \\frac{2}{x} = 0$";
      case ExerciseCategory.TRINOMIAL: return "$x^2 - 7x + 12$";
      case ExerciseCategory.MIX: return "$x^2 - 4 + 3(x-2)$";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToMenu}>
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Math<span className="text-indigo-600">Facto</span>
            </h1>
          </div>
          
          {currentExercise && (
             <button 
             onClick={handleBackToMenu}
             className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md"
           >
             <ArrowLeft className="w-4 h-4" />
             Menu Principal
           </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!currentExercise ? (
          <div className="animate-fade-in max-w-5xl mx-auto">
             <div className="text-center mb-12">
               <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Choisis ton entraînement</h2>
               <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                 Sélectionne un type de factorisation pour commencer une série d'exercices aléatoires.
               </p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {Object.values(ExerciseCategory).map((category) => (
                 <div 
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                 >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                              {getCategoryIcon(category)}
                          </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
                          {category}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4">
                          {getCategoryDescription(category)}
                      </p>
                    </div>
                    
                    <div className="mt-2 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 block">Exemple</span>
                        <div className="bg-slate-50 rounded py-2 px-3 text-center text-slate-700 text-sm overflow-hidden">
                           <Latex>{getCategoryExample(category)}</Latex>
                        </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        ) : (
          <ExerciseView 
            exercise={currentExercise} 
            onBack={handleBackToMenu}
            onNext={handleNextExercise}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>© 2025 Collège Ste-Croix - Support de cours Mathématiques</p>
        </div>
      </footer>
    </div>
  );
};

export default App;