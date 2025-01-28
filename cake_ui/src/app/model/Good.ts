// src/types/Good.ts
export interface Category {
    id: number;
    name: string;
    imageUrl: string;
    url: string;
    json: null;
    createdAt: string;
    updatedAt: string;
}
  
export interface Brand {
  id: number;
  name?: string;
  appId: string;
  kdtId: string;
  json: null;
  createdAt: string;
  updatedAt: string;
}

export interface Good {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  url: string;
  json: null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  brand: Brand;
  similarGoods: SimilarGood[]
}

export interface GoodsResponse {
  data: Good[][];
  total: number;
  page: number;
  limit: number;
}

export interface SimilarGood {
  good: Good
  similarity_number_max: number
  similarity_number_average: number
  similarity_name_number: number
  similarity_description_number: number
}