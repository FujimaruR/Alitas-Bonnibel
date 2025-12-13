export type MenuProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl: string;
  badges: string[];
  sortOrder: number;
  isActive: boolean;
};

export type MenuCategory = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  products: MenuProduct[];
};
