import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { Good, GoodsDoubleResponse } from '../model/Good';
import { getApiUrl } from '../utils/api';

export const metadata: Metadata = {
  title: '文汀 vs 德罗心',
  description: '文汀蛋糕对比德罗心-双排独臂'
};

const GoodCard: React.FC<{ good: Good }> = ({ good }) => (
  <div className="border rounded shadow p-4 flex flex-col">
    <img
      src={good.imageUrl}
      alt={good.name}
      className="w-full h-40 object-cover"
    />
    <div className="mt-2">
      <h2 className="text-xl font-bold">{good.name}</h2>
      <p className="text-sm text-gray-600">{good.category.name}</p>
      <p className="mt-1">{good.description}</p>
      <p className="mt-2 text-lg font-semibold text-green-600">¥{good.price}</p>
    </div>
  </div>
);

async function fetchDobuleBrandsGoods(): Promise<GoodsDoubleResponse> {
  try {
      const url = getApiUrl('/wenting_delosim');
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
  const wenting: Good[] = result.data.wenting;
  const delosim: Good[] = result.data.delosim;
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
              {wenting[index] && <GoodCard good={wenting[index]} />}
            </div>
            <div>
              {delosim[index] && <GoodCard good={delosim[index]} />}
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
