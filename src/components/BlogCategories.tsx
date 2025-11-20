"use client";
interface Category { id: number; name: string; }
interface Props { categories: { category: Category }[]; }

export default function BlogCategories({ categories }: Props) {
  if (!categories.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((bc) => (
        <span key={bc.category.id} className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded-full">
          {bc.category.name}
        </span>
      ))}
    </div>
  );
}
