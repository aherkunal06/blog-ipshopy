"use client";
interface Props { likes: any[]; favorites: any[]; }

export default function LikesFavorites({ likes, favorites }: Props) {
  return (
    <div className="flex gap-3 mt-6">
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
        Likes: {likes.length}
      </span>
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
        Favorites: {favorites.length}
      </span>
    </div>
  );
}
