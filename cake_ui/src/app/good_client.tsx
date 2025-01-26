// src/app/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Good, GoodsResponse } from './model/Good';

const formatPrice = (price: string): string => {
  const intPrice = Math.floor(parseFloat(price));
  return `¥ ${intPrice}`;
};

const findSimilarGoods = (currentGood: Good, allGoods: Good[]): Good[] => {
  return allGoods
    .filter(good => 
      good.id !== currentGood.id && 
      good.brand.name !== currentGood.brand.name
    )
    .slice(0, 2);
};

const GoodCard: React.FC<{ good: Good, similarGoods: Good[] }> = ({ good, similarGoods }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6 flex flex-col md:flex-row">
      <div className="relative w-full md:w-1/2 lg:w-1/3">
        <img 
          src={good.imageUrl} 
          alt={good.name} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">
          {good.brand.name.charAt(0).toUpperCase()}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-bold mb-2">{good.name}</h2>
        <p className="text-gray-600 mb-4">{good.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-red-600">{formatPrice(good.price)}</span>
          <span className="text-sm text-gray-500">{good.category.name}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {similarGoods.map(similarGood => (
            <div 
              key={similarGood.id} 
              className="bg-gray-100 p-2 rounded-lg flex flex-col items-center"
            >
              <img 
                src={similarGood.imageUrl} 
                alt={similarGood.name} 
                className="w-24 h-24 object-cover rounded-md mb-2"
              />
              <p className="text-xs text-center">{similarGood.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function GoodsList() {
  const [goods, setGoods] = useState<Good[]>([]);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const response = await fetch('https://localhost:3000/goods');
        const data: GoodsResponse = await response.json();
        setGoods(data.data);
      } catch (error) {
        console.error('Failed to fetch goods:', error);
      }
    };

    fetchGoods();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">WentingG文汀对比德罗心</h1>
      {goods.map(good => (
        <GoodCard 
          key={good.id} 
          good={good} 
          similarGoods={findSimilarGoods(good, goods)} 
        />
      ))}
    </div>
  );
}