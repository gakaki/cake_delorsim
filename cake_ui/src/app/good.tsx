import Image from 'next/image';
import { Good, GoodsResponse } from './model/Good';

const formatPrice = (price: string): string => {
  const intPrice = Math.floor(parseFloat(price));
  return `¥${intPrice}`;
};


const GoodCard = ({ good, similarGoods }: { good: Good, similarGoods: Good[] }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6 flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <img 
              src={good.imageUrl} 
              alt={good.name} 
              width={500}
              height={300}
              className="w-full h-64 object-cover"
            />
            {/* <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">
              {good.brand.name.charAt(0).toUpperCase()}
            </div> */}
             <div className="absolute top-2 right-2">
                <img 
                    src="http://mmbiz.qpic.cn/mmbiz_png/7qknZB2OibNSEMP8lbVoSRc8OJPr2fjwDH8UBoOYkjphS8h9NAUe3Riak7XGMNgHznESYkMjpXSJSvwKoA0wiaKog/640?wx_fmt=png&wxfrom=200"
                    alt="Brand Logo" 
                    width={20} 
                    height={20} 
                    className="rounded-full"
                />
            </div>
          </div>
          
          <div className="p-4 flex-grow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{good.name}</h2>
                <span className="text-sm text-gray-500 mr-2">{good.category.name}</span>
                <span className="text-lg font-semibold text-red-600">{formatPrice(good.price)}</span>
            </div>
            <p className="text-gray-600 mb-4">{good.description}</p>
    
            <div className="mt-4 grid grid-cols-2 gap-4">
    {similarGoods.map(similarGood => (
        <div 
        key={similarGood.id} 
        className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col"
        >
        <Image 
            src={similarGood.imageUrl} 
            alt={similarGood.name} 
            width={200}
            height={200}
            className="w-full h-48 object-cover"
        />
        <div className="p-2">
            <h3 className="text-sm text-center font-bold mb-1">{similarGood.name}</h3>
            <div className="flex flex-row items-center justify-between">
                <span className="text-xs text-gray-500">{similarGood.category.name}</span>
                <span className="text-sm font-semibold text-red-600">{formatPrice(similarGood.price)}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 line-clamp-10">{similarGood.description}</p>
        </div>
        </div>
    ))}
</div>


          </div>
        </div>
      );
};

async function fetchGoods(): Promise<Good[]> {
    try {
        const nodeEnv = process.env.NODE_ENV as string;
        const url = nodeEnv === 'production'  ? 'https://delorsim-server.koyeb.app/goods'  : 'http://localhost:15001/goods';
        const response = await fetch(url, { 
        // cache: 'no-store', // for SSR use this will never be build success why
        next: { 
          revalidate: 3600 // Regenerate page every hour
        }
      });
      const data: GoodsResponse = await response.json();
      
      // Filter out goods with zero or zero-like prices
      return data.data.filter(good => {
        const price = parseFloat(good.price);
        return price > 4  
      });
    } catch (error) {
      console.error('Failed to fetch goods:', error);
      return [];
    }
}

export default async function GoodsList() {
    // Fetch goods with price > 4
    const allGoods = await fetchGoods();

    // Separate WenTing and 德罗心 goods
    const wentingGoods = allGoods.filter(good => 
        good.brand.name.toLowerCase().includes('wenting') || 
        good.brand.name.toLowerCase().includes('文汀')
    );

    const deluoxinGoods = allGoods.filter(good => 
        good.brand.name.toLowerCase().includes('德罗心')
    );

    // Function to find similar goods across brands
    const findCrossBrandSimilarGoods = (currentGood: Good, otherBrandGoods: Good[]): Good[] => {
    return otherBrandGoods
        .filter(good => 
            good.id !== currentGood.id 
            // &&  
            // good.brand.name !== currentGood.brand.name &&
            // Add similarity criteria here, e.g., similar price range or category
            // Math.abs(parseFloat(good.price) - parseFloat(currentGood.price)) < 50 &&
            // good.category.name === currentGood.category.name
        )
        .slice(0, 2);
    };

    
  return (
    <div className="container mx-auto px-1 py-1">
      <h1 className="text-3xl font-bold mb-6 text-center">WenTinG文汀 vs 德罗心</h1>
      {wentingGoods.map(good => (
        <GoodCard 
          key={good.id} 
          good={good} 
          similarGoods={findCrossBrandSimilarGoods(good, deluoxinGoods)} 
        />
      ))}
    </div>
  );
}