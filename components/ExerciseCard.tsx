import React from 'react';
import { Exercise, Difficulty } from '../types';
import { ChevronRight, Calculator, Sigma, Variable } from 'lucide-react';
import Latex from 'react-latex-next';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  const getIcon = () => {
    switch(exercise.type) {
      case 'FACTORISATION': return <Sigma className="w-6 h-6 text-indigo-500" />;
      case 'EQUATION': return <Variable className="w-6 h-6 text-emerald-500" />;
      default: return <Calculator className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{exercise.title}</h3>
            {/* Difficulty badge removed as requested */}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
      
      <p className="text-slate-600 text-sm mb-3">{exercise.instruction}</p>
      
      <div className="bg-slate-50 p-3 rounded-md text-center border border-slate-100 overflow-x-auto">
        <Latex>{`$${exercise.displayExpression || exercise.expression}$`}</Latex>
      </div>
    </div>
  );
};

export default ExerciseCard;