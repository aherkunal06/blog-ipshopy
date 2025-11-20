export interface Author {
  username: string;
  name?: string;
}

export interface BlogCard {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  metaDescription: string | null;
  metaKeywords?: string | null;
  updatedAt?: string;
  author: Author;
}

export interface BlogWrapper {
  blog: BlogCard;
}

export interface Category {
  id: number;
  name: string;
  image: string | null;
  blogs: BlogWrapper[];
}

export interface BlogsApiResponse {
  categories: Category[];
  totalPages: number;
  currentPage: number;
}
