import { Metadata } from 'next';
import { Suspense } from 'react';
import { GoodsDoubleResponse } from '../model/Good';

export const metadata: Metadata = {
  title: '文汀 vs 德罗心',
  description: '文汀蛋糕对比德罗心-双排独臂'
};

interface Product {
  imageUrl: string;
  name: string;
  category: { name: string };
  description: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="border rounded shadow p-4 flex flex-col">
    <img
      src={product.imageUrl}
      alt={product.name}
      className="w-full h-40 object-cover"
    />
    <div className="mt-2">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p className="text-sm text-gray-600">{product.category.name}</p>
      <p className="mt-1">{product.description}</p>
      <p className="mt-2 text-lg font-semibold text-green-600">¥{product.price}</p>
    </div>
  </div>
);

async function fetchDobuleBrandsGoods(): Promise<GoodsDoubleResponse> {
  try {
    const nodeEnv = process.env.NODE_ENV as string;
    const url =
      nodeEnv === 'production'
        ? 'https://delorsim-server.koyeb.app/goods/wenting_delosim'
        : 'http://localhost:15001/goods/wenting_delosim';
    const response = await fetch(url, {
      next: {
        revalidate: 60 // 每小时重新生成页面
      }
    });
    const data: GoodsDoubleResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch goods:', error);
    return { data: { wenting: [], delosim: [] }, total: 0 };
  }
}

const GoodsDoubleList: React.FC = async () => {
  const result = await fetchDobuleBrandsGoods();
  const wenting: Product[] = result.data.wenting;
  const delosim: Product[] = result.data.delosim;
  const maxLength = Math.max(wenting.length, delosim.length);

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        文汀({wenting.length}) vs 德罗心({delosim.length})
      </h1>
      <div className="flex flex-col gap-4">
        {Array.from({ length: maxLength }).map((_, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <div>
              {wenting[index] && <ProductCard product={wenting[index]} />}
            </div>
            <div>
              {delosim[index] && <ProductCard product={delosim[index]} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function WentingPage() {
  return (
    <Suspense fallback={<div>加载文汀商品...</div>}>
      <GoodsDoubleList />
    </Suspense>
  );
}