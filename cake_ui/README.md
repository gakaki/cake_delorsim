# 制作一个界面

请求 https://localhost:3000/goods

返回的json数据如下：

{
    "data": [
        {
            "id": 1,
            "name": "蛇年聚宝",
            "description": "草莓，车厘子，鲜奶奶油，蜂蜜戚风蛋糕，草莓冻，百里香，糖粉",
            "imageUrl": "https://img01.yzcdn.cn/upload_files/2024/12/29/FhnyD_Bm79TBTxdhVi6clF3aIg0f.jpg",
            "price": "199.00",
            "url": "",
            "json": null,
            "createdAt": "2025-01-26T01:07:51.886Z",
            "updatedAt": "2025-01-26T01:07:51.886Z",
            "category": {
                "id": 1,
                "name": "车厘子季半糖蛋糕",
                "imageUrl": "",
                "url": "",
                "json": null,
                "createdAt": "2025-01-26T01:07:51.886Z",
                "updatedAt": "2025-01-26T01:07:51.886Z"
            },
            "brand": {
                "id": 1,
                "name": "WentingG 文汀半糖蛋糕",
                "appId": "",
                "kdtId": "",
                "json": null,
                "createdAt": "2025-01-26T01:07:51.886Z",
                "updatedAt": "2025-01-26T01:07:51.886Z"
            }
        },
        {
            "id": 2,
            "name": "厘刻发财",
            "description": "车厘子，草莓冻，巧克力脆珠，巧克力干纳许，糖粉，巧克力奶油，巧克力蛋糕胚",
            "imageUrl": "https://img01.yzcdn.cn/upload_files/2024/11/28/FkSinUPl2BjOoKAQyMtjtkG1e3co.jpg",
            "price": "289.00",
            "url": "",
            "json": null,
            "createdAt": "2025-01-26T01:07:51.886Z",
            "updatedAt": "2025-01-26T01:07:51.886Z",
            "category": {
                "id": 1,
                "name": "车厘子季半糖蛋糕",
                "imageUrl": "",
                "url": "",
                "json": null,
                "createdAt": "2025-01-26T01:07:51.886Z",
                "updatedAt": "2025-01-26T01:07:51.886Z"
            },
            "brand": {
                "id": 1,
                "name": "WentingG 文汀半糖蛋糕",
                "appId": "",
                "kdtId": "",
                "json": null,
                "createdAt": "2025-01-26T01:07:51.886Z",
                "updatedAt": "2025-01-26T01:07:51.886Z"
            }
        }
    ],
    "total": 73,
    "page": 1,
    "limit": 1000
}
根据上面的数据结构
渲染一个UI列表 使用的框架为next.js 15和 tailwind css,要求响应式,支持pc 浏览器1920x1080分辨率和 手机android iphone上显示.
json.data节点中的 item 生成一个good类,用来给如下的展示ui用.

展示ui具体结构为:
为列表(好看简洁一点的),每行里的item (绑定 good类) 为:

1个大卡片 

图片 显示 json中的 imageUrl , 然后图片的右上角 显示文字 brand.name,可以显示为一个brand.name的首字母大写,然后做一个简单的css效果比如做个border圆角 
显示 json中的 name 
显示 json中的 description
显示 json中的 price,记得 加上 中文rmb的钱符号 + 整形int价格 去掉小数
显示 json中的 category.name

下有 2个小卡片
小卡片里的内容为:

找到大卡片里的 json (good) 中的name ,然后再根据如下规则,返回的所有数据里寻找 最类似最近似的2个json item,
规则:
1 找到和该 good的brand.name 不能一样的
2 在数据中过滤掉当前good的数据




### 过滤数据

过滤行数据,含有如下内容的数据请过滤: 
0 价格必须大于4


### 
const goods = await fetchGoods(); 
这里的在过滤出来德罗心的数据 然后在对比的商品里用wenting 和德罗心比较在德罗心里找类似的2个