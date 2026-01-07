import React, { useEffect, useRef, useState } from 'react';
import JXG from 'jsxgraph';
import { evaluateExpression } from '../utils/mathUtils';

interface GraphVisualizerProps {
  expression1: string; // The original problem
  expression2: string; // The user's input
  title?: string;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ expression1, expression2, title }) => {
  // Use a stable ID for the div
  const [boardId] = useState(() => `jxgbox-${Math.random().toString(36).substr(2, 9)}`);
  const boardRef = useRef<any>(null);
  
  // Keep track if we are mounted to prevent async issues
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!isMounted.current) return;
      
      const box = document.getElementById(boardId);
      if (!box) return;

      // Prevent double initialization
      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);
      }

      try {
        // Initialize board
        boardRef.current = JXG.JSXGraph.initBoard(boardId, {
          boundingbox: [-10, 10, 10, -10],
          axis: true,
          showCopyright: false,
          showNavigation: true,
          pan: { enabled: true },
          zoom: { enabled: true, wheel: true }
        });

        // Plot original expression (Blue)
        const f1 = (x: number) => evaluateExpression(expression1, x) || 0;
        boardRef.current.create('functiongraph', [f1], {
          strokeColor: '#3b82f6', // blue-500
          strokeWidth: 3,
          dash: 2 // Dashed to see it underneath
        });

        // Plot user expression (Red) - Initial draw
        const f2 = (x: number) => evaluateExpression(expression2, x) || 0;
        boardRef.current.create('functiongraph', [f2], {
          strokeColor: '#ef4444', // red-500
          strokeWidth: 2
        });

      } catch (e) {
        console.error("Graph init error:", e);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);
        boardRef.current = null;
      }
    };
  }, [expression1, boardId]); 
  // We re-init board if expression1 changes to reset view. 
  // For expression2, we just want to update the curve, but full re-init is safer and fast enough for this simple app.

  useEffect(() => {
      if (!boardRef.current) return;
      
      // If we wanted to be more efficient, we would update the existing curve here.
      // But for robustness in this demo, triggering a re-init via parent prop change is acceptable,
      // OR we can try to clear and redraw just the second curve.
      
      // Let's stick to the re-init strategy in the first useEffect which depends on [expression1].
      // To force update on expression2, we add it to the dependency array of the main effect above?
      // No, that causes flickering.
      
      // Better approach: Separate effect for second curve.
      try {
         // Create a new curve for updated expression2
         // Note: In JSXGraph, adding a new function graph on top works.
         // We should really clear the old 'user' curve, but without tracking its ID it's hard.
         // Given the complexity of robustly updating JSXGraph in React without a wrapper lib,
         // let's actually just include expression2 in the main useEffect dependency to force full redraw.
         // It might flicker slightly but ensures correctness.
      } catch(e) {}

  }, [expression2]);

  // Combine dependencies for the main init effect to ensure sync
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMounted.current) return;
      const box = document.getElementById(boardId);
      if (!box) return;

      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);
      }

      try {
        boardRef.current = JXG.JSXGraph.initBoard(boardId, {
          boundingbox: [-10, 10, 10, -10],
          axis: true,
          showCopyright: false,
          showNavigation: true,
          pan: { enabled: true },
          zoom: { enabled: true }
        });

        const f1 = (x: number) => evaluateExpression(expression1, x) || 0;
        boardRef.current.create('functiongraph', [f1], {
          strokeColor: '#3b82f6',
          strokeWidth: 3,
          dash: 2
        });

        if (expression2) {
            const f2 = (x: number) => evaluateExpression(expression2, x) || 0;
            boardRef.current.create('functiongraph', [f2], {
              strokeColor: '#ef4444',
              strokeWidth: 2
            });
        }
      } catch (e) { console.error(e); }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);
        boardRef.current = null;
      }
    };
  }, [expression1, expression2, boardId]);

  return (
    <div className="w-full h-full flex flex-col">
      {title && <h3 className="text-sm font-semibold text-gray-500 mb-2">{title}</h3>}
      <div 
        id={boardId} 
        className="w-full h-64 md:h-full min-h-[300px] border border-slate-200 rounded-lg shadow-inner bg-white relative z-0"
        style={{ width: '100%', height: '100%' }}
      ></div>
      <div className="flex gap-4 justify-center mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-1 bg-blue-500 border-dashed border-white"></div>
          <span>Problème original</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-1 bg-red-500"></div>
          <span>Ta réponse</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;