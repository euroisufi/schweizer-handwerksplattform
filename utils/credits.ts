/**
 * Calculate the number of credits required to unlock a project based on its budget
 * @param budget - The budget object with min and max values, or a budget number
 * @returns The number of credits required
 */
export function calculateCreditsForProject(budget: { min: number; max: number } | number | undefined): number {
  if (!budget) return 1; // Default to 1 credit if no budget specified
  
  let budgetAmount: number;
  
  if (typeof budget === 'object') {
    // Use the maximum budget for credit calculation
    budgetAmount = budget.max;
  } else if (typeof budget === 'number') {
    budgetAmount = budget;
  } else {
    return 1; // Default to 1 credit if budget is not valid
  }
  
  // Calculate credits based on budget ranges
  // bis 250€ = 1 credit
  // bis 500€ = 2 credits
  // bis 750€ = 3 credits
  // bis 1000€ = 4 credits
  // and so on...
  return Math.ceil(budgetAmount / 250);
}