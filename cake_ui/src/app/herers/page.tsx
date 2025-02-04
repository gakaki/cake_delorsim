import { Metadata } from 'next';
import { Suspense } from 'react';
import GoodsList from '../compareGoods/good';

export const metadata: Metadata = {
  title: '德罗心 vs 赫芮斯',
  description: '德罗心蛋糕对比赫芮斯'
};

export default function HeresPage() {
  return (
    <Suspense fallback={<div>加载德罗心商品...</div>}>
      <GoodsList brands={['德罗心', '赫芮斯']} />
    </Suspense>
  );
}
