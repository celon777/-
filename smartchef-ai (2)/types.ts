export interface Ingredient {
  item: string;
  amount: string;
  category: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  calories: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  steps: Step[];
  tips: string[];
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  data: Recipe | null;
}
