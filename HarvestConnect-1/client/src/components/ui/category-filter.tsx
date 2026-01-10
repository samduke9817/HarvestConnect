import { Button } from "./button";

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: number;
  onCategorySelect?: (categoryId: number) => void;
  showAll?: boolean;
}

const categoryIcons: { [key: string]: string } = {
  'fruits': '🍎',
  'vegetables': '🥕',
  'grains': '🌾',
  'dairy': '🧀',
  'herbs': '🌿',
  'livestock': '🥚',
  'nuts': '🥜',
  'spices': '🌶️',
};

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  showAll = true 
}: CategoryFilterProps) {
  
  const getIcon = (categoryName: string) => {
    const key = categoryName.toLowerCase();
    return categoryIcons[key] || '📦';
  };

  const getColorClass = (categoryName: string) => {
    const key = categoryName.toLowerCase();
    switch(key) {
      case 'fruits':
        return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
      case 'vegetables':
        return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'grains':
        return 'bg-amber-100 hover:bg-amber-200 text-amber-800';
      case 'dairy':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
      case 'herbs':
        return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'livestock':
        return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 border-b border-gray-100 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Shop by Category</h3>
          {showAll && (
            <Button variant="ghost" data-testid="view-all-categories">
              View All <span className="ml-1">→</span>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category.id)}
              className={`text-center group cursor-pointer p-4 rounded-lg transition-colors ${
                selectedCategory === category.id 
                  ? 'bg-primary text-white' 
                  : getColorClass(category.name)
              }`}
              data-testid={`category-${category.name.toLowerCase()}`}
            >
              <div className={`rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center transition-colors ${
                selectedCategory === category.id 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-white bg-opacity-50'
              }`}>
                <span className="text-2xl">{getIcon(category.name)}</span>
              </div>
              <p className="text-sm font-medium">{category.name}</p>
              <p className={`text-xs mt-1 ${
                selectedCategory === category.id 
                  ? 'text-white text-opacity-80' 
                  : 'text-gray-500'
              }`}>
                Available now
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
