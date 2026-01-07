import * as math from 'mathjs';

/**
 * Evaluates a mathematical expression at a specific x value.
 * Uses mathjs to parse and evaluate.
 */
export const evaluateExpression = (expression: string, x: number): number | null => {
  try {
    let exprToEval = expression.replace(/,/g, '.'); // French decimal support

    // Robustly handle equations by splitting into LHS and RHS and subtracting them: LHS - (RHS)
    // Simply replacing '=' with '-' fails for cases like "1 = 2x + 2" which becomes "1 - 2x + 2" (wrong) instead of "1 - (2x + 2)"
    if (exprToEval.includes('=')) {
        const parts = exprToEval.split('=');
        // Handle "LHS = RHS"
        if (parts.length >= 2) {
           const lhs = parts[0];
           // Join the rest in case of multiple = (though unlikely valid)
           const rhs = parts.slice(1).join('='); 
           exprToEval = `(${lhs}) - (${rhs})`;
        }
    }

    const scope = { x };
    const result = math.evaluate(exprToEval, scope);
    return typeof result === 'number' ? result : null;
  } catch (e) {
    return null;
  }
};

/**
 * Converts a raw input string into formatted LaTeX using mathjs.
 * Useful for turning "a/(b+c)" into "\frac{a}{b+c}".
 */
export const formatToLatex = (expression: string): string => {
  try {
    // Handle equations manually or split them
    if (expression.includes('=')) {
        const parts = expression.split('=');
        return parts.map(formatToLatex).join('=');
    }
    const node = math.parse(expression);
    return node.toTex({ parenthesis: 'auto', implicit: 'hide' });
  } catch (e) {
    // Fallback if parsing fails (e.g. incomplete input)
    return expression;
  }
};

/**
 * Checks if two expressions are mathematically equivalent by Monte Carlo testing.
 * (Evaluating at random points).
 */
export const areExpressionsEquivalent = (expr1: string, expr2: string): boolean => {
  const testPoints = [0, 1, -1, 2.5, -3, 10, Math.PI];
  
  for (const x of testPoints) {
    const val1 = evaluateExpression(expr1, x);
    const val2 = evaluateExpression(expr2, x);

    if (val1 === null || val2 === null) return false;
    
    // Check with tolerance for floating point errors
    if (Math.abs(val1 - val2) > 0.0001) {
      return false;
    }
  }
  return true;
};

/**
 * Parses the solution from the target string (e.g., "x=-5" -> -5)
 */
export const getEquationSolution = (target: string): number | null => {
    try {
        // Assume target is like "x = value"
        const parts = target.split('=');
        if (parts.length !== 2) return null;
        return math.evaluate(parts[1]);
    } catch(e) {
        return null;
    }
};

/**
 * Validates a step for an equation solving exercise.
 * Checks if the user's equation is true at the solution point.
 * Also checks it is not a tautology (always true).
 */
export const checkEquationValidity = (userExpr: string, solution: number): boolean => {
    // 1. Evaluate at the solution. Should be ~0 (LHS - RHS = 0)
    const valAtSolution = evaluateExpression(userExpr, solution);
    if (valAtSolution === null) return false;
    
    if (Math.abs(valAtSolution) > 0.0001) return false; // Not a solution

    // 2. Check for tautology (e.g., 0=0) by evaluating at a non-solution
    // We pick a point likely not to be a solution or a singularity.
    // solution + 1.23 is arbitrary enough.
    const testPoint = solution + 1.23;
    const valAtTest = evaluateExpression(userExpr, testPoint);
    
    // If it's also 0 at a random other point, it's likely 0=0 or equivalent, which is not a useful step.
    if (valAtTest !== null && Math.abs(valAtTest) < 0.0001) {
        return false;
    }

    return true;
};

/**
 * Checks if the expression is effectively "zero" (used for equations moved to one side).
 */
export const isZeroExpression = (expr: string): boolean => {
    return areExpressionsEquivalent(expr, "0");
}

/**
 * Simple heuristic to check if an expression is fully factored.
 */
export const isFactoredForm = (expr: string): boolean => {
    let structure = expr;
    while (/\([^()]*\)/.test(structure)) {
        structure = structure.replace(/\([^()]*\)/g, 'BLOCK');
    }
    
    if (structure.match(/[0-9a-zA-Z]\s*[+-]\s*[0-9a-zA-Z]/)) {
        return false;
    }
    
    return true;
};