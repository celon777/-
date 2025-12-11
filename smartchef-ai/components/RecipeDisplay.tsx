import React, { useState } from 'react';
import { Recipe, Ingredient } from '../types';
import { 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  CheckCircle2, 
  Circle, 
  ListChecks,
  UtensilsCrossed,
  Lightbulb
} from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const toggleIngredient = (item: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedIngredients(newChecked);
  };

  // Group ingredients by category
  const groupedIngredients = recipe.ingredients.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <UtensilsCrossed size={300} />
        </div>
        <h2 className="text-4xl font-bold mb-4 relative z-10">{recipe.title}</h2>
        <p className="text-emerald-100 text-lg max-w-2xl relative z-10">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-6 mt-8 relative z-10">
          <div className="flex items-center gap-2 bg-emerald-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
            <Clock size={20} />
            <span className="font-medium">准备: {recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
            <Flame size={20} />
            <span className="font-medium">烹饪: {recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
            <Users size={20} />
            <span className="font-medium">{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
            <ChefHat size={20} />
            <span className="font-medium">难度: {recipe.difficulty === 'Easy' ? '简单' : recipe.difficulty === 'Medium' ? '中等' : '困难'}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-0">
        {/* Ingredients Sidebar */}
        <div className="md:col-span-5 bg-stone-50 p-8 border-r border-stone-100">
          <div className="flex items-center gap-2 mb-6 text-emerald-800">
            <ListChecks size={24} />
            <h3 className="text-2xl font-bold">食材清单</h3>
          </div>
          
          <div className="space-y-6">
            {Object.entries(groupedIngredients).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">{category}</h4>
                <ul className="space-y-3">
                  {items.map((ing, idx) => {
                    const isChecked = checkedIngredients.has(ing.item);
                    return (
                      <li 
                        key={`${category}-${idx}`}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer select-none
                          ${isChecked ? 'bg-emerald-100/50 text-stone-400' : 'bg-white shadow-sm hover:shadow-md text-stone-700'}
                        `}
                        onClick={() => toggleIngredient(ing.item)}
                      >
                        <div className={`transition-colors ${isChecked ? 'text-emerald-500' : 'text-stone-300'}`}>
                          {isChecked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </div>
                        <div className="flex-1">
                          <span className={`font-medium ${isChecked ? 'line-through' : ''}`}>{ing.item}</span>
                        </div>
                        <div className={`text-sm ${isChecked ? 'text-emerald-600/50' : 'text-emerald-600'}`}>
                          {ing.amount}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Main Content */}
        <div className="md:col-span-7 p-8 bg-white">
          <div className="flex items-center gap-2 mb-6 text-emerald-800">
            <UtensilsCrossed size={24} />
            <h3 className="text-2xl font-bold">烹饪步骤</h3>
          </div>

          <div className="space-y-8">
            {recipe.steps.map((step) => (
              <div key={step.stepNumber} className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                    {step.stepNumber}
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-stone-700 leading-relaxed text-lg">{step.instruction}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="mt-10 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
              <div className="flex items-center gap-2 mb-4 text-yellow-700">
                <Lightbulb size={24} />
                <h4 className="text-xl font-bold">大厨贴士</h4>
              </div>
              <ul className="space-y-2">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-stone-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;