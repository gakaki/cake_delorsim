import { Good } from "../model/Good";

export const GoodCard = ({ index,good }: { index:Number, good: Good }) => {
    if (!good){
        return <div>没有找到商品</div>
    }
    console.log(`show the good`,good.name,good.brand?.name)
    const formatPrice = (price: string): string => {
        const intPrice = Math.floor(parseFloat(price));
        return `¥${intPrice}`;
    };

    const formatPercentage = (decimal: number): string => {
        return `似 ${Math.round(decimal * 100)}%`;
    };

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

            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">
              {/* {good.brand.name.charAt(0).toUpperCase()} */}
              {good.brand?.name?.slice(0,8)}
            </div>

            {/* 取消图片logo */}
             {/* <div className="absolute top-2 right-2 disply-none">
                <label className="absolute top-2 right-2 rounded-full w-5 h-5 block">
                    {good.brand?.name}
                </label>
            </div> */}
          </div>
          
          <div className="p-4 flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{index.toString()} - {good.name}</h2>
                    <span className="text-sm text-gray-500 mr-2">{good.category?.name}</span>
                    <span className="text-lg font-semibold text-red-600">{formatPrice(good.price)}</span>
                </div>
                <p className="text-gray-600 mb-4">{good.description}</p>
            
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {good.similarGoods?.map(similarGood => (
                        <div 
                            key={similarGood.good.id} 
                            className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col"
                        >
                        <img 
                            src={similarGood.good.imageUrl} 
                            alt={similarGood.good.name} 
                            width={200}
                            height={200}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-2">

                            <div className="flex justify-between items-center">
                                <h3 className="text-sm text-center font-bold mb-1">{similarGood.good.name} </h3>
                                <span className="text-sm font-semibold text-red-600">{formatPrice(similarGood.good.price)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">{similarGood.good.category?.name}</span>
                                <span className="text-xs text-gray-500">
                                    {formatPercentage(similarGood.similarity_number_max)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-10">{similarGood.good.description}</p>
                        </div>
                        </div>
                    ))}
                </div>


          </div>
        </div>
      );
};
