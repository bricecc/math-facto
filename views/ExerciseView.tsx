import React, { useState, useEffect, useRef } from 'react';
import { Exercise, ExerciseStep, ExerciseType } from '../types';
import { areExpressionsEquivalent, formatToLatex, checkEquationValidity, getEquationSolution } from '../utils/mathUtils';
import GraphVisualizer from '../components/GraphVisualizer';
import Latex from 'react-latex-next';
import { Check, AlertCircle, HelpCircle, Trash2, ArrowRight } from 'lucide-react';

interface ExerciseViewProps {
  exercise: Exercise;
  onBack: () => void;
  onNext: () => void;
}

const ExerciseView: React.FC<ExerciseViewProps> = ({ exercise, onBack, onNext }) => {
  const [steps, setSteps] = useState<ExerciseStep[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  
  // Use a ref for the input to focus after adding steps
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset state when exercise changes
    setSteps([]);
    setCurrentInput(exercise.initialValue || '');
    setShowHint(false);
    setIsSuccess(false);
    setShowGraph(false);
  }, [exercise]);

  const handleValidateStep = () => {
    if (!currentInput.trim()) return;

    // Convert user input to nice LaTeX for display (handling fractions etc.)
    const latexDisplay = formatToLatex(currentInput); 
    
    let isEquivalent = false;
    let isTarget = false;
    let message = "";
    let correct = false;

    // Validation Logic
    if (exercise.type === ExerciseType.EQUATION) {
        // Special logic for equations
        const solution = getEquationSolution(exercise.target);
        
        if (solution !== null) {
            // Check if step is valid (holds true for the solution)
            isEquivalent = checkEquationValidity(currentInput, solution);
            
            // Check if it matches the target explicitly (canonical form x=...)
            // Here we use strict equivalence for the final target check to ensure they wrote "x = -5"
            // But areExpressionsEquivalent might work if target is "x=-5".
            // "x=-5" -> "x - (-5)" -> "x+5". Evaluated at -5 is 0.
            // "2x=-10" -> "2x+10". Evaluated at -5 is 0.
            // We want to know if they reached the SIMPLEST form.
            
            // Heuristic for Equation Success:
            // 1. Valid step
            // 2. Looks simple (like x = v) ? 
            // Or just check strictly against target string using areExpressionsEquivalent?
            // areExpressionsEquivalent("x=-5", "2x=-10") ?
            // Eq1: x+5. Eq2: 2x+10.
            // At x=0: 5 vs 10. NO.
            // So areExpressionsEquivalent differentiates "x=-5" from "2x=-10".
            // Perfect! It means we can use it to detect if they reached the specific target form.
            
            isTarget = areExpressionsEquivalent(exercise.target, currentInput);
            
            // Fallback: If checkEquationValidity fails, maybe they wrote something equivalent to original?
            // (Though checkEquationValidity is broader).
        } else {
             // Fallback for complex targets (shouldn't happen with current data)
             isEquivalent = areExpressionsEquivalent(exercise.expression, currentInput);
             isTarget = areExpressionsEquivalent(exercise.target, currentInput);
        }
    } else {
        // Standard logic for Factorisation / Development
        isEquivalent = areExpressionsEquivalent(exercise.expression, currentInput);
        isTarget = areExpressionsEquivalent(exercise.target, currentInput);
    }
    
    // Feedback Logic
    if (!isEquivalent) {
      if (exercise.type === ExerciseType.EQUATION) {
          message = "Cette étape n'est pas correcte. L'égalité n'est plus conservée (ou c'est une tautologie 0=0).";
      } else {
          message = "Cette étape n'est pas équivalente à l'expression de départ. Vérifie tes calculs.";
      }
      correct = false;
    } else {
        correct = true;
        if (isTarget) {
            message = "Bravo ! C'est la solution finale.";
            setIsSuccess(true);
        } else {
            message = "C'est correct, continue.";
        }
    }

    const newStep: ExerciseStep = {
      latex: latexDisplay,
      isCorrect: correct,
      message: message
    };

    setSteps([...steps, newStep]);
    
    // Logic for clearing or keeping input
    if (isTarget) {
        setCurrentInput('');
    }
    // Else keep input for editing/refining
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidateStep();
    }
  };

  const deleteStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
    setIsSuccess(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left Column: Workspace */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Instruction Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start">
             <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md uppercase tracking-wide">
                        {exercise.category}
                    </span>
                    <h2 className="text-xl font-bold text-slate-800">{exercise.title}</h2>
                </div>
                <p className="text-slate-600 mb-4">{exercise.instruction}</p>
             </div>
             <button 
               onClick={() => setShowGraph(!showGraph)}
               className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
             >
                {showGraph ? 'Masquer le graphe' : 'Voir le graphe'}
             </button>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg text-center text-lg font-mono text-indigo-900">
            <Latex>{`$${exercise.displayExpression || exercise.expression}$`}</Latex>
          </div>
        </div>

        {/* Graph (Mobile/Toggle) */}
        {showGraph && (
            <div className="lg:hidden h-64 bg-white rounded-xl shadow-sm border border-slate-200 p-4 overflow-hidden">
                <GraphVisualizer 
                    expression1={exercise.expression} 
                    expression2={currentInput || steps[steps.length-1]?.latex || exercise.expression} 
                />
            </div>
        )}

        {/* Steps History */}
        <div className="flex flex-col gap-4">
            {steps.map((step, idx) => (
                <div key={idx} className={`relative group flex flex-col p-4 rounded-lg border ${step.isCorrect ? 'bg-white border-slate-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-center">
                        <div className="font-mono text-lg overflow-x-auto">
                            <Latex>{`$${step.latex}$`}</Latex>
                        </div>
                        <div className="flex items-center gap-2">
                            {step.isCorrect ? <Check className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                            <button onClick={() => deleteStep(idx)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded">
                                <Trash2 className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </div>
                    {step.message && (
                        <p className={`text-sm mt-2 ${step.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {step.message}
                        </p>
                    )}
                </div>
            ))}
        </div>

        {/* Input Area */}
        {!isSuccess && (
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 sticky bottom-6 z-10">
                <label className="block text-sm font-medium text-slate-700 mb-2">Ta prochaine étape :</label>
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="ex: (x-1)(2x+5)"
                        className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-lg p-2.5 border"
                    />
                    <button 
                        onClick={handleValidateStep}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Valider
                    </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    Astuce: Utilise ^ pour les puissances (x^2) et / pour les fractions.
                </p>
            </div>
        )}

        {/* Success Message */}
        {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Exercice Réussi !</h3>
                <p className="text-green-700 mb-6">Tu as trouvé la forme factorisée optimale.</p>
                
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={onBack}
                        className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Menu Principal
                    </button>
                    <button 
                        onClick={onNext}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        Question Suivante
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}

      </div>

      {/* Right Column: Tools & Hints */}
      <div className="flex flex-col gap-6">
        
        {/* Desktop Graph */}
        <div className="hidden lg:block h-64 bg-white rounded-xl shadow-sm border border-slate-200 p-4 overflow-hidden sticky top-24">
            <GraphVisualizer 
                title="Visualisation"
                expression1={exercise.expression} 
                expression2={currentInput || [...steps].reverse().find(s => s.isCorrect)?.latex || exercise.expression} 
            />
        </div>

        {/* Hint Card */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">Besoin d'aide ?</h3>
                    {showHint ? (
                        <p className="text-yellow-700 text-sm">{exercise.hint}</p>
                    ) : (
                        <button 
                            onClick={() => setShowHint(true)}
                            className="text-sm text-yellow-700 underline hover:text-yellow-900"
                        >
                            Révéler l'indice
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Toolbox (Static for now) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Rappels</h3>
            <ul className="text-sm text-slate-600 space-y-2">
                <li>• <Latex>$a^2 - b^2 = (a-b)(a+b)$</Latex></li>
                <li>• <Latex>$a^2 + 2ab + b^2 = (a+b)^2$</Latex></li>
                <li>• <Latex>$k(a+b) = ka + kb$</Latex></li>
            </ul>
        </div>

      </div>
    </div>
  );
};

export default ExerciseView;