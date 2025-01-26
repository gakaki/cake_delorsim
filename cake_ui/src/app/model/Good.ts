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
    name: string;
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
  }
  
  export interface GoodsResponse {
    data: Good[];
    total: number;
    page: number;
    limit: number;
  }