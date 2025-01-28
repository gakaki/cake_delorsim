import { Good, GoodsResponse } from '../model/Good';
import { GoodCard } from './goodCard';

async function fetchGroupGoods(): Promise<Good[][]> {
    try {
        const nodeEnv = process.env.NODE_ENV as string;
        const url = nodeEnv === 'production'  ? 'https://delorsim-server.koyeb.app/goods'  : 'http://localhost:15001/goods';
        const response = await fetch(url, { 
        // cache: 'no-store', // for SSR use this will never be build success why
        next: { 
          revalidate: 3600 // Regenerate page every hour
        }
      });
      const data: GoodsResponse = await response.json()
      const groups = data?.data
      console.log(`一共有${groups?.length}组数据`)
      return groups
    } catch (error) {
      console.error('Failed to fetch goods:', error);
      return [];
    }
}

export default async function GoodsList() {
  const groups         = await fetchGroupGoods();
  const wentingGoods   = groups[0].filter( good => !good.name.includes('盘') && !good.name.includes('生日') )
  const deluoxinGoods  = groups[1].filter( good => !good.name.includes('盘') && !good.name.includes('生日') )

  // console.log(wentingGoods.length)
  // // Separate WenTing and 德罗心 goods
  // const wentingGoods = allGoods.filter(good => 
  //     good.brand.name.toLowerCase().includes('wenting') || 
  //     good.brand.name.toLowerCase().includes('文汀')
  // );

  // const deluoxinGoods = allGoods.filter(good => 
  //     good.brand.name.toLowerCase().includes('德罗心')
  // );

  return (
    <div className="container mx-auto px-1 py-1">
      <h1 className="text-3xl font-bold mb-6 text-center">
       文汀({wentingGoods.length}) vs 德罗心({deluoxinGoods.length})
      </h1>
      {wentingGoods.map( ( good, index) => (
        <GoodCard key={index} index={index + 1} good={good} />
      ))}
    </div>
  );
}