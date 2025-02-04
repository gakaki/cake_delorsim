import { Metadata } from 'next';
import { Suspense } from 'react';
import GoodsList from '../compareGoods/good';

export const metadata: Metadata = {
  title: '文汀 vs 德罗心',
  description: '文汀蛋糕对比德罗心'
};

export default function WentingPage() {
  return (
    <Suspense fallback={<div>加载文汀商品...</div>}>
      <GoodsList brands={['文汀', '德罗心']} />
    </Suspense>
  );
}