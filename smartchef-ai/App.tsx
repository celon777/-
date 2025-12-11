import React, { useState, useEffect } from 'react';
import { generateRecipe } from './services/geminiService';
import { Recipe, GenerationState } from './types';
import RecipeDisplay from './components/RecipeDisplay';
import { ChefHat, Search, Loader2, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  "蔬菜小炒", "宫保鸡丁", "红烧肉", "番茄炒蛋", "清蒸鲈鱼", "麻婆豆腐"
];

const App: React.FC = () => {
  const [query, setQuery] = useState("蔬菜小炒");
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setState({ isLoading: true, error: null, data: null });
    try {
      const recipe = await generateRecipe(query);
      setState({ isLoading: false, error: null, data: recipe });
    } catch (err) {
      setState({ 
        isLoading: false, 
        error: "抱歉，生成食谱时遇到问题，请重试。", 
        data: null 
      });
    }
  };

  // Optional: Auto-load the default query on first mount for immediate demo, 
  // or just leave it for the user to click.
  // Let's load it automatically to satisfy the prompt "List ingredients for..."
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Navbar / Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700">
            <ChefHat size={32} />
            <h1 className="text-xl font-bold tracking-tight">SmartChef AI</h1>
          </div>
          <div className="text-sm text-stone-400 hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 flex flex-col items-center">
        
        {/* Search Section */}
        <div className="w-full max-w-2xl text-center mb-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
            今天想吃点什么？
          </h2>
          <p className="text-stone-500 text-lg">
            输入菜名，AI 帮您生成详细的食材清单和烹饪步骤。
          </p>

          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例如：蔬菜小炒..."
              className="w-full h-14 pl-6 pr-14 rounded-full border-2 border-stone-200 bg-white text-lg shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all"
              disabled={state.isLoading}
            />
            <button
              type="submit"
              disabled={state.isLoading}
              className="absolute right-2 top-2 h-10 w-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Search size={20} />
              )}
            </button>
          </form>

          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  // Optional: Trigger search immediately on click?
                  // Let's just set query for now to let user confirm.
                }}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                  ${query === s 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-600'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full transition-all duration-500">
          {state.error && (
            <div className="w-full max-w-lg mx-auto p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
              {state.error}
            </div>
          )}

          {state.isLoading && !state.data && (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400 space-y-4">
               <Sparkles className="animate-pulse text-emerald-400" size={48} />
               <p className="animate-pulse font-medium">正在精心策划您的食谱...</p>
            </div>
          )}

          {state.data && (
            <RecipeDisplay recipe={state.data} />
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-stone-400 text-sm">
        &copy; {new Date().getFullYear()} SmartChef AI. Create delicious moments.
      </footer>
    </div>
  );
};

export default App;
