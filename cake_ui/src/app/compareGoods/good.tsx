import React from 'react';
import { Good, GoodsResponse } from '../model/Good';
import { GoodCard } from './goodCard';

interface GoodsListProps {
  brands?: string[];
}

async function fetchGroupGoods(brands: string[]): Promise<Good[][]> {
  try {
    const nodeEnv = process.env.NODE_ENV as string;
    const url = nodeEnv === 'production'  ? 'https://delorsim-server.koyeb.app/goods'  : 'http://localhost:15001/goods';
    
    const params = new URLSearchParams();
    brands.forEach(brand => params.append('brands', brand));
    console.log("请求brands为",brands)
    const fullUrl = `${url}?${params.toString()}`;
    
    const response = await fetch(fullUrl, { 
      next: { 
        revalidate: 3600 // Regenerate page every hour
      }
    });
    const data: GoodsResponse = await response.json()
    const groups = data?.data
    console.log(`一共有${groups?.length}组数据，品牌：${brands.join(', ')}`)
    return groups
  } catch (error) {
    console.error('Failed to fetch goods:', error);
    return [];
  }
}

const GoodsList: React.FC<GoodsListProps> = async ({ 
  brands = ['文汀','德罗心'] 
}) => {
  const groups        = await fetchGroupGoods(brands);
  const displayGoods  = groups[0]
  console.log(`displayGoods.length: ${displayGoods.length} ${brands}`)
  return (
    <div className="container mx-auto px-1 py-1">
      <h1 className="text-3xl font-bold mb-6 text-center">
        { `${brands[0]} (${displayGoods.length}) vs ${brands[1]}` } 
      </h1>
      {displayGoods.map( ( good, index) => (
        <GoodCard key={index} index={index + 1} good={good} />
      ))}
    </div>
  );
}

export default GoodsList;