### 需求

实现 定时请求蛋糕服务api 存储返回的json到本地缓存中,抽取合适的数据再次存储到缓存中,然后在API中返回之前存储的缓存数据.

一共有2家蛋糕店,对应的需要生成实体类,并使用NestJS TypeOrmModule 实现数据库操作 使用sqlite

1 WentingG 文汀半糖蛋糕
app_id wx2e2e28945c980c46
kdt_id 146387302

2 德罗心 蛋糕
app_id wx50d13a67c1b59969
kdt_id 177397716


软件栈: NestJS,NestJS Cache,NestJS Schedule

1 请求有赞的蛋糕服务 API, 根据如下的curl 生成对应的请求,使用NestJS HttpModule 实现请求.

```
curl --location --request POST 'https://h5.youzan.com/retail/h5/miniprogram/shelf-config/getFirstLevelConfigs?app_id=wx50d13a67c1b59969&kdt_id=177397716' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--header 'Host: h5.youzan.com' \
--header 'Connection: keep-alive' \
--data-raw '{
    "goodsFilterType": 0,
    "alias": "uUKBWb5BUZ",
    "mode": "1",
    "userLocation": {},
    "retailSource": "MINAPP-SHELF-3.41.5",
    "useSwitch": "v2",
    "supportUnavailableGoods": 2,
    "supportFixGroupOptionalCombo": true,
    "screenWidth": 414
}'
```

这里大致请求获得的Response body 数据结构如下,请根据具体的内容 组装一个更简单的实体数据结构存储到数据库,并需要编写对应的实体类

```
{
    "code": 0,
    "msg": "ok",
    "data": {
        "shelf": {
            "templateId": 1,
            "pageId": 155176628,
            "recommendGoods": {
                "goodsList": [],
                "goodsListStyle": {},
                "title": ""
            },
            "cartLogo": "https://img01.yzcdn.cn/upload_files/2024/01/17/Fv1OtZcxtWTfYLRjX9o92v_LgfHK.png",
            "orderSheetAd": {
                "border": "circular",
                "images": [
                    {
                        "extraData": {
                            "alias": "364mjjc0bbqqosj",
                            "isVirtual": 0
                        },
                        "id": "1",
                        "linkId": "3832720717",
                        "linkTitle": "「橘」 ·福气", // <---- 这是对应的商品名字
                        "linkType": "goods",
                        "linkUrl": "https://h5.youzan.com/v2/goods/364mjjc0bbqqosj", // <---- 这是对应的商品链接
                        "url": "https://img01.yzcdn.cn/upload_files/2025/01/20/FlE_FDPutB46gnG27XMWgZgNv_1b.jpg" // <---- 这是对应的商品图片
                    }
                ],
                "indicatorType": 0,
                "showMode": 0,
                "templateType": 0
            },
            "showSearchComponent": false,
            "logoUrl": "",
            "showOrderPool": false,
            "showUmp": 0,
            "shopHeaderConfig": {
                "showMode": 0,
                "announcementComponents": [
                    {
                        "announcementMessage": "",
                        "show": 0,
                        "type": "self-take"
                    },
                    {
                        "announcementMessage": "",
                        "show": 0,
                        "type": "take-out"
                    },
                    {
                        "announcementMessage": "",
                        "show": 0,
                        "type": "all"
                    }
                ],
                "alias": "",
                "showUmp": 0,
                "showSearchComponent": false,
                "umpCoupon": {
                    "addType": 0,
                    "autoType": 0,
                    "autoValue": "",
                    "activities": [],
                    "hideEmptyCoupon": 1,
                    "takeCouponComponentType": [
                        2
                    ],
                    "takeCouponPopupStyleType": 1,
                    "customizedPopupImage": "",
                    "show": false
                },
                "logoUrl": ""
            },
            "umpCoupon": {
                "addType": 0,
                "autoType": 0,
                "autoValue": "",
                "activities": [],
                "hideEmptyCoupon": 1,
                "takeCouponComponentType": [
                    2
                ],
                "takeCouponPopupStyleType": 1,
                "customizedPopupImage": "",
                "show": false
            },
            "pickUpWaySupport": [
                0,
                1
            ],
            "goodsListStyle": {
                "goodsStyle": "largeCard",
                "border": "circular",
                "fill": "fill",
                "textStyle": "bold",
                "size": "1:1",
                "isShowTitle": 1,
                "isShowSubtitle": 1,
                "isShowOriginalPrice": 1,
                "isShowSales": 0,
                "isShowStock": 0,
                "showStockCondition": 10,
                "stepper": "linear",
                "stepperStyle": "follow"
            },
            "groupStyle": 1,
            "groupBadge": true,
            "goodsFilter": false,
            "itemGroupList": [
                {
                    "customSortGoods": [
                        {
                            "id": 3832720718,
                            "sort": 4
                        },
                        {
                            "id": 3832720149,
                            "sort": 3
                        },
                        {
                            "id": 3832719937,
                            "sort": 2
                        },
                        {
                            "id": 3832717665,
                            "sort": 1
                        }
                    ],
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "goodsShowModes": [],
                    "groupId": 295444258,
                    "groupItemNum": 3,
                    "groupLevel": 1,
                    "groupTitle": "新春限定",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2025/01/19/Fgs9sofpY5X6Bv2EsguROteBVuYu.png",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "itemSubGroupInfoDTOList": [],
                    "parentGroupId": 295444258,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 0,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "tagName": "蛇年限定",
                    "title": "新春限定",
                    "type": 1
                },
                {
                    "customSortGoods": [
                        {
                            "id": 3764319729,
                            "sort": 5
                        },
                        {
                            "id": 3764449188,
                            "sort": 4
                        },
                        {
                            "id": 3771042841,
                            "sort": 3
                        },
                        {
                            "id": 3771046315,
                            "sort": 2
                        },
                        {
                            "id": 3771048606,
                            "sort": 1
                        }
                    ],
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "groupId": 293508852,
                    "groupItemNum": 2,
                    "groupLevel": 1,
                    "groupTitle": "草莓季限定",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2025/01/09/FmRBM9WSjo_hOoNRhNiHSvKBoEkw.jpg",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "itemSubGroupInfoDTOList": [],
                    "parentGroupId": 293508852,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 0,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "title": "草莓季限定",
                    "type": 1
                },
                {
                    "customSortGoods": [
                        {
                            "id": 3750147163,
                            "sort": 11
                        },
                        {
                            "id": 3750146163,
                            "sort": 10
                        },
                        {
                            "id": 3750142496,
                            "sort": 9
                        },
                        {
                            "id": 3750149132,
                            "sort": 8
                        }
                    ],
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "groupId": 293503953,
                    "groupItemNum": 1,
                    "groupLevel": 1,
                    "groupTitle": "品牌主推",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2024/12/03/Fpg0QZMW6CVTrO_lvc9IVp3fOKMH.jpg",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "itemSubGroupInfoDTOList": [],
                    "parentGroupId": 293503953,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 0,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "tagName": "品牌热卖",
                    "title": "品牌主推",
                    "type": 1
                },
                {
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "groupId": 293505753,
                    "groupItemNum": 9,
                    "groupLevel": 1,
                    "groupTitle": "鲜果多肉系列",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FiJ8Lm1ZuyF0vOPMdNYu7AoJlxax.png",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "parentGroupId": 293505753,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 1,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "tagName": "多肉系列",
                    "title": "鲜果多肉系列",
                    "type": 1
                },
                {
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "groupId": 293505847,
                    "groupItemNum": 5,
                    "groupLevel": 1,
                    "groupTitle": "多巴胺系列",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fgg7lsyUm071jHO4tUJlz9YDg4Pl.png",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "parentGroupId": 293505847,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 1,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "tagName": "斑斓系列",
                    "title": "多巴胺系列",
                    "type": 1
                },
                {
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "groupId": 293503653,
                    "groupItemNum": 7,
                    "groupLevel": 1,
                    "groupTitle": "创意组合系列",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fnmlj1Cv2HRfWSmaZp19PhRZQLRu.png",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "parentGroupId": 293503653,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 1,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "tagName": "双色可心系列",
                    "title": "创意组合系列",
                    "type": 1
                },
                {
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "groupId": 293507651,
                    "groupItemNum": 2,
                    "groupLevel": 1,
                    "groupTitle": "悦享系列",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fm8EJMwyGMOCU8hRPwbl7BZkRLuw.png",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "parentGroupId": 293507651,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 1,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "tagName": "Daliy悦享系列",
                    "title": "悦享系列",
                    "type": 1
                },
                {
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "groupId": 293502441,
                    "groupItemNum": 5,
                    "groupLevel": 1,
                    "groupTitle": "温馨提示",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FvEe01VL3kkllKwx6ux3uEw3xW56.png",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "parentGroupId": 293502441,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 1,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "title": "温馨提示",
                    "type": 1
                },
                {
                    "deliveryTypeList": [
                        1,
                        2,
                        3
                    ],
                    "groupId": 293506841,
                    "groupItemNum": 4,
                    "groupLevel": 1,
                    "groupTitle": "品牌承诺",
                    "groupType": 0,
                    "hideItemIdList": [],
                    "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FiPdGWd8tmlJasj3DWFuYtZKN8aN.png",
                    "isDelete": 0,
                    "isSelfFetch": true,
                    "isTakeOut": true,
                    "parentGroupId": 293506841,
                    "rootKdtId": 146833520,
                    "shelfDescription": "",
                    "shelfStatus": 1,
                    "showMode": 0,
                    "showModeDetail": "{\"weekList\":[],\"hoursList\":[],\"startTime\":\"\",\"endTime\":\"\"}",
                    "sortType": 1,
                    "sourceKdtId": 146833520,
                    "sourceKdtName": "总部",
                    "title": "品牌承诺",
                    "type": 1
                }
            ],
            "isShowAllGroup": false,
            "groupInnerDynamicItems": [
                {
                    "data": {
                        "border": "circular",
                        "templateType": 0,
                        "images": [
                            {
                                "linkTitle": "「橘」 ·福气",
                                "linkId": "3832720717",
                                "extraData": {
                                    "alias": "364mjjc0bbqqosj",
                                    "isVirtual": 0
                                },
                                "linkUrl": "https://h5.youzan.com/v2/goods/364mjjc0bbqqosj",
                                "linkType": "goods",
                                "id": "1",
                                "url": "https://img01.yzcdn.cn/upload_files/2025/01/20/FlE_FDPutB46gnG27XMWgZgNv_1b.jpg"
                            }
                        ],
                        "indicatorType": 0,
                        "showMode": 0
                    },
                    "type": "order_sheet_ad"
                },
                {
                    "data": {
                        "border": "circular",
                        "templateType": 0,
                        "images": [
                            {
                                "id": "1",
                                "url": "https://img01.yzcdn.cn/upload_files/2025/01/20/FpSy-lc_iNkeYUW3CuWWrK2N31Nt.jpg"
                            }
                        ],
                        "indicatorType": 0,
                        "showMode": 0
                    },
                    "type": "order_sheet_ad"
                }
            ],
            "groups": {
                "selfFetch": [
                    {
                        "alias": "1yawz3tpf2yck",
                        "children": [],
                        "count": 4,
                        "groupId": 295444258,
                        "icon": "https://img01.yzcdn.cn/upload_files/2025/01/19/Fgs9sofpY5X6Bv2EsguROteBVuYu.png",
                        "shelfDescription": "",
                        "title": "蛇年限定",
                        "countSale": 4,
                        "sortType": 0,
                        "prefetchGoodsIds": [
                            3832720718,
                            3832720149,
                            3832719937,
                            3832717665
                        ],
                        "hideItemIdList": [],
                        "ceilCountHalf": 2,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        "alias": "2fm6h14amju44",
                        "children": [],
                        "count": 5,
                        "groupId": 293508852,
                        "icon": "https://img01.yzcdn.cn/upload_files/2025/01/09/FmRBM9WSjo_hOoNRhNiHSvKBoEkw.jpg",
                        "shelfDescription": "",
                        "title": "草莓季限定",
                        "countSale": 5,
                        "sortType": 0,
                        "prefetchGoodsIds": [
                            3764319729,
                            3764449188,
                            3771042841,
                            3771046315,
                            3771048606
                        ],
                        "hideItemIdList": [],
                        "ceilCountHalf": 3,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4,
                            5
                        ]
                    },
                    {
                        "alias": "1y5ydyf2sot2s",
                        "children": [],
                        "count": 10,
                        "groupId": 293503953,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/12/03/Fpg0QZMW6CVTrO_lvc9IVp3fOKMH.jpg",
                        "shelfDescription": "",
                        "title": "品牌热卖",
                        "countSale": 10,
                        "sortType": 0,
                        "prefetchGoodsIds": [
                            3750147163,
                            3750146163,
                            3750142496,
                            3750149132
                        ],
                        "hideItemIdList": [],
                        "ceilCountHalf": 5,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10
                        ]
                    },
                    {
                        "alias": "2ovyptu1egx0k",
                        "children": [],
                        "count": 5,
                        "groupId": 293505753,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FiJ8Lm1ZuyF0vOPMdNYu7AoJlxax.png",
                        "shelfDescription": "",
                        "title": "多肉系列",
                        "countSale": 5,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 3,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4,
                            5
                        ]
                    },
                    {
                        "alias": "3eoq3wpapyx84",
                        "children": [],
                        "count": 3,
                        "groupId": 293505847,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fgg7lsyUm071jHO4tUJlz9YDg4Pl.png",
                        "shelfDescription": "",
                        "title": "斑斓系列",
                        "countSale": 3,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 2,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3
                        ]
                    },
                    {
                        "alias": "1yjhh7mktkzd0",
                        "children": [],
                        "count": 2,
                        "groupId": 293503653,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fnmlj1Cv2HRfWSmaZp19PhRZQLRu.png",
                        "shelfDescription": "",
                        "title": "双色可心系列",
                        "countSale": 2,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 1,
                        "skeletonPlaceholder": [
                            1,
                            2
                        ]
                    },
                    {
                        "alias": "35zwr4q3frktw",
                        "children": [],
                        "count": 2,
                        "groupId": 293507651,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fm8EJMwyGMOCU8hRPwbl7BZkRLuw.png",
                        "shelfDescription": "",
                        "title": "Daliy悦享系列",
                        "countSale": 2,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 1,
                        "skeletonPlaceholder": [
                            1,
                            2
                        ]
                    },
                    {
                        "alias": "36enbjuvhc45w",
                        "children": [],
                        "count": 4,
                        "groupId": 293502441,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FvEe01VL3kkllKwx6ux3uEw3xW56.png",
                        "shelfDescription": "",
                        "title": "温馨提示",
                        "countSale": 4,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 2,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        "alias": "2x8k9z0iti4p0",
                        "children": [],
                        "count": 4,
                        "groupId": 293506841,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FiPdGWd8tmlJasj3DWFuYtZKN8aN.png",
                        "shelfDescription": "",
                        "title": "品牌承诺",
                        "countSale": 4,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 2,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4
                        ]
                    }
                ],
                "delivery": [
                    {
                        "alias": "1yawz3tpf2yck",
                        "children": [],
                        "count": 4,
                        "groupId": 295444258,
                        "icon": "https://img01.yzcdn.cn/upload_files/2025/01/19/Fgs9sofpY5X6Bv2EsguROteBVuYu.png",
                        "shelfDescription": "",
                        "title": "蛇年限定",
                        "countSale": 4,
                        "sortType": 0,
                        "prefetchGoodsIds": [
                            3832720718,
                            3832720149,
                            3832719937,
                            3832717665
                        ],
                        "hideItemIdList": [],
                        "ceilCountHalf": 2,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        "alias": "2fm6h14amju44",
                        "children": [],
                        "count": 5,
                        "groupId": 293508852,
                        "icon": "https://img01.yzcdn.cn/upload_files/2025/01/09/FmRBM9WSjo_hOoNRhNiHSvKBoEkw.jpg",
                        "shelfDescription": "",
                        "title": "草莓季限定",
                        "countSale": 5,
                        "sortType": 0,
                        "prefetchGoodsIds": [
                            3764319729,
                            3764449188,
                            3771042841,
                            3771046315,
                            3771048606
                        ],
                        "hideItemIdList": [],
                        "ceilCountHalf": 3,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4,
                            5
                        ]
                    },
                    {
                        "alias": "1y5ydyf2sot2s",
                        "children": [],
                        "count": 10,
                        "groupId": 293503953,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/12/03/Fpg0QZMW6CVTrO_lvc9IVp3fOKMH.jpg",
                        "shelfDescription": "",
                        "title": "品牌热卖",
                        "countSale": 10,
                        "sortType": 0,
                        "prefetchGoodsIds": [
                            3750147163,
                            3750146163,
                            3750142496,
                            3750149132
                        ],
                        "hideItemIdList": [],
                        "ceilCountHalf": 5,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10
                        ]
                    },
                    {
                        "alias": "2ovyptu1egx0k",
                        "children": [],
                        "count": 5,
                        "groupId": 293505753,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FiJ8Lm1ZuyF0vOPMdNYu7AoJlxax.png",
                        "shelfDescription": "",
                        "title": "多肉系列",
                        "countSale": 5,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 3,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4,
                            5
                        ]
                    },
                    {
                        "alias": "3eoq3wpapyx84",
                        "children": [],
                        "count": 3,
                        "groupId": 293505847,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fgg7lsyUm071jHO4tUJlz9YDg4Pl.png",
                        "shelfDescription": "",
                        "title": "斑斓系列",
                        "countSale": 3,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 2,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3
                        ]
                    },
                    {
                        "alias": "1yjhh7mktkzd0",
                        "children": [],
                        "count": 2,
                        "groupId": 293503653,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fnmlj1Cv2HRfWSmaZp19PhRZQLRu.png",
                        "shelfDescription": "",
                        "title": "双色可心系列",
                        "countSale": 2,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 1,
                        "skeletonPlaceholder": [
                            1,
                            2
                        ]
                    },
                    {
                        "alias": "35zwr4q3frktw",
                        "children": [],
                        "count": 2,
                        "groupId": 293507651,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/Fm8EJMwyGMOCU8hRPwbl7BZkRLuw.png",
                        "shelfDescription": "",
                        "title": "Daliy悦享系列",
                        "countSale": 2,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 1,
                        "skeletonPlaceholder": [
                            1,
                            2
                        ]
                    },
                    {
                        "alias": "36enbjuvhc45w",
                        "children": [],
                        "count": 4,
                        "groupId": 293502441,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FvEe01VL3kkllKwx6ux3uEw3xW56.png",
                        "shelfDescription": "",
                        "title": "温馨提示",
                        "countSale": 4,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 2,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        "alias": "2x8k9z0iti4p0",
                        "children": [],
                        "count": 4,
                        "groupId": 293506841,
                        "icon": "https://img01.yzcdn.cn/upload_files/2024/11/16/FiPdGWd8tmlJasj3DWFuYtZKN8aN.png",
                        "shelfDescription": "",
                        "title": "品牌承诺",
                        "countSale": 4,
                        "sortType": 1,
                        "hideItemIdList": [],
                        "ceilCountHalf": 2,
                        "skeletonPlaceholder": [
                            1,
                            2,
                            3,
                            4
                        ]
                    }
                ],
                "express": [],
                "selfFetchRecovery": false,
                "deliveryRecovery": false,
                "expressRecovery": false,
                "selfFetchForceRender": true,
                "deliveryForceRender": true,
                "expressForceRender": true
            },
            "couponListData": {},
            "umpGoodsListData": {},
            "recommendGoodsListData": {},
            "deliveryFirstGoodsList": {
                "list": [
                    {
                        "activityPrice": 15900,
                        "alias": "3ng4hiiuvtg50cx",
                        "id": 3832720718,
                        "imageUrl": "https://img01.yzcdn.cn/upload_files/2025/01/23/FkHtvNTA7lHeqMH49N-wE-oF9tU3.jpg",
                        "price": 15900,
                        "sellPoint": "红丝绒蛋糕与橘子奶油融合搭配酸酸甜甜的砂糖橘，蝴蝶结象征家庭团圆，送上新春的福气与好运",
                        "title": "「橘」 ·福气",
                        "totalStock": 399992,
                        "startSaleNum": 1,
                        "arriveTimeDesc": "最快13:25送达",
                        "messages": "[]",
                        "totalId": 14822249262,
                        "labelViewModel": {
                            "labelGroupModels": []
                        },
                        "isContainProp": false,
                        "productAttributesDefined": true,
                        "preSale": false,
                        "skuSize": 4,
                        "totalSoldNum": 4,
                        "basicTags": [],
                        "groupId": 295444258
                    },
                    {
                        "activityPrice": 13900,
                        "alias": "2oepk80q7j1icbu",
                        "id": 3832720149,
                        "imageUrl": "https://img01.yzcdn.cn/upload_files/2025/01/19/FjyWsNUQAjuqtNqF8H_Vf--YEGPP.jpg",
                        "price": 13900,
                        "sellPoint": "红丝绒蛋糕配上乳酪益生菌奶油与草莓奶冻，车厘子和树莓的形状像爱心，传递新春的祝福与温暖，新的一年要学会爱自己！",
                        "title": "「纳」·福心",
                        "totalStock": 199988,
                        "startSaleNum": 1,
                        "arriveTimeDesc": "最快13:25送达",
                        "messages": "[]",
                        "totalId": 14822308327,
                        "labelViewModel": {
                            "labelGroupModels": []
                        },
                        "isContainProp": false,
                        "productAttributesDefined": true,
                        "preSale": false,
                        "skuSize": 2,
                        "totalSoldNum": 7,
                        "basicTags": [],
                        "groupId": 295444258
                    },
                    {
                        "activityPrice": 12900,
                        "alias": "2oierjfvknybo0a",
                        "id": 3832719937,
                        "imageUrl": "https://img01.yzcdn.cn/upload_files/2025/01/19/FkdOQO5H2rX7GlyplZ3rOuBawMMt.jpg",
                        "price": 12900,
                        "sellPoint": "山楂奶油与手作山楂酱的独特风味，榛子仁与核桃仁的脆感，红彤彤的山楂，象征迎接财富与好运，送鸿运当头吉祥如意。",
                        "title": "「鸿」·福禄",
                        "totalStock": 599986,
                        "startSaleNum": 1,
                        "arriveTimeDesc": "最快13:25送达",
                        "messages": "[]",
                        "totalId": 25779482823,
                        "labelViewModel": {
                            "labelGroupModels": []
                        },
                        "isContainProp": false,
                        "productAttributesDefined": true,
                        "preSale": false,
                        "skuSize": 6,
                        "totalSoldNum": 8,
                        "basicTags": [],
                        "groupId": 295444258
                    },
                    {
                        "activityPrice": 12900,
                        "alias": "3er75eq29r744bb",
                        "id": 3832717665,
                        "imageUrl": "https://img01.yzcdn.cn/upload_files/2025/01/22/FobyKfJW62Im8fXxjtRAMcyJ0x9J.jpg",
                        "price": 12900,
                        "sellPoint": "原味蛋糕胚与咸奶茶奶油的绝妙结合，鲜奶皮子带来精致口感，炒米的香脆与草莓、蓝莓的酸甜组成，是来自蒙古的味道",
                        "title": "奶皮子咸奶茶炒米",
                        "totalStock": 599992,
                        "startSaleNum": 1,
                        "arriveTimeDesc": "最快13:25送达",
                        "messages": "[]",
                        "totalId": 25779482421,
                        "labelViewModel": {
                            "labelGroupModels": []
                        },
                        "isContainProp": false,
                        "productAttributesDefined": true,
                        "preSale": false,
                        "skuSize": 6,
                        "totalSoldNum": 2,
                        "basicTags": [],
                        "groupId": 295444258
                    }
                ],
                "unavailableList": [],
                "group": {
                    "295444258": {
                        "count": 4
                    }
                }
            },
            "firstExtraDataCache": {
                "deliveryTimesMap": {
                    "3832717665": "最快13:26送达",
                    "3832719937": "最快13:26送达",
                    "3832720149": "最快13:26送达",
                    "3832720718": "最快13:26送达"
                },
                "activityInfoMap": {
                    "3832717665": {
                        "activityPrice": 12900,
                        "id": 3832717665,
                        "price": 12900,
                        "origin": "",
                        "showStartTag": true
                    },
                    "3832719937": {
                        "activityPrice": 12900,
                        "id": 3832719937,
                        "price": 12900,
                        "origin": "",
                        "showStartTag": true
                    },
                    "3832720149": {
                        "activityPrice": 13900,
                        "id": 3832720149,
                        "price": 13900,
                        "origin": "",
                        "showStartTag": true
                    },
                    "3832720718": {
                        "activityPrice": 15900,
                        "id": 3832720718,
                        "price": 15900,
                        "origin": "",
                        "showStartTag": true
                    }
                },
                "skuDirectOrderMap": {}
            },
            "weappGoodsListStyle": {
                "DELIVERY": {
                    "goodsListWidth": 339,
                    "width": 120,
                    "height": 120,
                    "skeletonHeight": 120,
                    "imageFill": "aspectFill",
                    "style": "width: 120px; height: 120px;",
                    "listGoodsSize": {
                        "imageFill": "aspectFill",
                        "style": "width: 120px; height: 120px;"
                    },
                    "groupListWidth": 75,
                    "dynamicGoodsSize": {
                        "goodsListWidth": 339,
                        "width": 80,
                        "height": 80,
                        "skeletonHeight": 80,
                        "imageFill": "aspectFit",
                        "style": "width: 80px; height: 80px;",
                        "listGoodsSize": {
                            "imageFill": "aspectFit",
                            "style": "width: 80px; height: 80px;"
                        }
                    },
                    "recommendGoodsSize": {
                        "width": "100%",
                        "height": "104px",
                        "style": "width: 100%; height: 104px;"
                    }
                },
                "EXPRESS": {
                    "goodsListWidth": 339,
                    "width": 120,
                    "height": 120,
                    "skeletonHeight": 120,
                    "imageFill": "aspectFill",
                    "style": "width: 120px; height: 120px;",
                    "listGoodsSize": {
                        "imageFill": "aspectFill",
                        "style": "width: 120px; height: 120px;"
                    },
                    "groupListWidth": 75,
                    "dynamicGoodsSize": {
                        "goodsListWidth": 339,
                        "width": 80,
                        "height": 80,
                        "skeletonHeight": 80,
                        "imageFill": "aspectFit",
                        "style": "width: 80px; height: 80px;",
                        "listGoodsSize": {
                            "imageFill": "aspectFit",
                            "style": "width: 80px; height: 80px;"
                        }
                    },
                    "recommendGoodsSize": {
                        "width": "100%",
                        "height": "104px",
                        "style": "width: 100%; height: 104px;"
                    }
                },
                "SELF_TAKE": {
                    "goodsListWidth": 339,
                    "width": 120,
                    "height": 120,
                    "skeletonHeight": 120,
                    "imageFill": "aspectFill",
                    "style": "width: 120px; height: 120px;",
                    "listGoodsSize": {
                        "imageFill": "aspectFill",
                        "style": "width: 120px; height: 120px;"
                    },
                    "groupListWidth": 75,
                    "dynamicGoodsSize": {
                        "goodsListWidth": 339,
                        "width": 80,
                        "height": 80,
                        "skeletonHeight": 80,
                        "imageFill": "aspectFit",
                        "style": "width: 80px; height: 80px;",
                        "listGoodsSize": {
                            "imageFill": "aspectFit",
                            "style": "width: 80px; height: 80px;"
                        }
                    },
                    "recommendGoodsSize": {
                        "width": "100%",
                        "height": "104px",
                        "style": "width: 100%; height: 104px;"
                    }
                },
                "COMMON": {
                    "goodsListStyleMap": {
                        "list": {
                            "goodsStyle": "largeCard",
                            "border": "circular",
                            "fill": "fill",
                            "textStyle": "bold",
                            "size": "1:1",
                            "isShowTitle": 1,
                            "isShowSubtitle": 1,
                            "isShowOriginalPrice": 1,
                            "isShowSales": 0,
                            "isShowStock": 0,
                            "showStockCondition": 10,
                            "stepper": "linear",
                            "stepperStyle": "follow"
                        },
                        "dynamic": {},
                        "recommend": {}
                    }
                }
            }
        },
        "pickUpWaySupport": {
            "delivery": true,
            "selfFetch": true
        },
        "orderPool": {
            "available": false
        },
        "personalizedShopVisit": {
            "showOnlineShopSwitch": true,
            "showUserLocation": false,
            "enterScene": "0",
            "onlineShopVisitModel": "1",
            "visitSecondConfirm": "0"
        },
        "cart": {
            "isShopInPerfWhiteList": true
        },
        "extra": {
            "autoVerify": 0,
            "cdbSet": 1,
            "goodsDetailDisplay": 0,
            "orderSecondConfirm": 0,
            "retailAutoVerify": 0,
            "retailMinappShelfOrderSetting": "{\"reserve_contact_name\":\"0\",\"reserve_contact_number\":\"1\",\"contact_number_required\":\"1\"}",
            "selfRefundConfig": 1
        },
        "shopConfigs": {
            "house_number_required": "0",
            "goods_detail_sales": "{\"show\":0,\"limit\":false,\"limit_num\":\"\",\"add_up_the_sales_of_three_parties\":\"0\"}"
        },
        "displayCarrierConfig": {
            "carrierSubType": 1001,
            "carrierType": 1,
            "scene": {
                "itemDetailSwitch": true,
                "readyOrderPageSwitch": true,
                "shelfOrderPageSwitch": true
            }
        },
        "apollo": {
            "retail_shelf_order": true
        },
        "supportExpress": false,
        "birthdayRelationEnable": false,
        "shelfContact": {
            "mobileNumber": "19863207111",
            "phone": "19863207111"
        }
    }
}
```


在上面的json返回数据中获得itemGroupList节点的数据,循环操作: 替换到如下的group节点中
```
{
    "pickUpWay": "SELF_TAKE",
    "location": {
        "lat": 31.255320035764452,
        "lng": 121.38502253750968
    },
    "goodsFilterType": 0,
    "group": {
        "alias": "1yawz3tpf2yck",
        "children": [],
        "count": 4,
        "groupId": 295444258,
        "icon": "https://img01.yzcdn.cn/upload_files/2025/01/19/Fgs9sofpY5X6Bv2EsguROteBVuYu.png",
        "shelfDescription": "",
        "title": "蛇年限定",
        "countSale": 4,
        "sortType": 0,
        "prefetchGoodsIds": [
            3832720718,
            3832720149,
            3832719937,
            3832717665
        ],
        "hideItemIdList": [],
        "ceilCountHalf": 2,
        "skeletonPlaceholder": [
            1,
            2,
            3,
            4
        ]
    },
    "activityPriceIndependent": 1,
    "deliveryTypes": [
        1
    ],
    "supportCombo": 1,
    "retailSource": "MINAPP-SHELF-3.41.5",
    "excludedComboSubType": [
        "none"
    ],
    "needDeliveryTime": false,
    "skipUmp": true,
    "needItemProp": true,
    "supportUnavailableGoods": 2,
    "supportFixGroupOptionalCombo": true
}

请求如下的 商品列表接口,注意postbody就是刚才替换好的那段json
```
curl --location --request POST 'https://h5.youzan.com/retail/h5/miniprogram/goods/goodsListByTagAlias.json?app_id=wx50d13a67c1b59969&kdt_id=177397716' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--header 'Host: h5.youzan.com' \
--header 'Connection: keep-alive' \
--data-raw '{
    "pickUpWay": "SELF_TAKE",
    "location": {
        "lat": 31.255320035764452,
        "lng": 121.38502253750968
    },
    "goodsFilterType": 0,
    "group": {
        "alias": "1yawz3tpf2yck",
        "children": [],
        "count": 4,
        "groupId": 295444258,
        "icon": "https://img01.yzcdn.cn/upload_files/2025/01/19/Fgs9sofpY5X6Bv2EsguROteBVuYu.png",
        "shelfDescription": "",
        "title": "蛇年限定",
        "countSale": 4,
        "sortType": 0,
        "prefetchGoodsIds": [
            3832720718,
            3832720149,
            3832719937,
            3832717665
        ],
        "hideItemIdList": [],
        "ceilCountHalf": 2,
        "skeletonPlaceholder": [
            1,
            2,
            3,
            4
        ]
    },
    "activityPriceIndependent": 1,
    "deliveryTypes": [
        1
    ],
    "supportCombo": 1,
    "retailSource": "MINAPP-SHELF-3.41.5",
    "excludedComboSubType": [
        "none"
    ],
    "needDeliveryTime": false,
    "skipUmp": true,
    "needItemProp": true,
    "supportUnavailableGoods": 2,
    "supportFixGroupOptionalCombo": true
}'
```

返回的json就是具体的商品列表数据
```
{
    "code": 0,
    "msg": "ok",
    "data": {
        "list": [
            {
                "activityPrice": 15900,
                "alias": "3ng4hiiuvtg50cx",
                "id": 3832720718,
                "imageUrl": "https://img01.yzcdn.cn/upload_files/2025/01/23/FkHtvNTA7lHeqMH49N-wE-oF9tU3.jpg",
                "price": 15900,
                "sellPoint": "红丝绒蛋糕与橘子奶油融合搭配酸酸甜甜的砂糖橘，蝴蝶结象征家庭团圆，送上新春的福气与好运",
                "title": "「橘」 ·福气",
                "totalStock": 399992,
                "startSaleNum": 1,
                "messages": "[]",
                "totalId": 14822249262,
                "labelViewModel": {
                    "labelGroupModels": []
                },
                "isContainProp": false,
                "productAttributesDefined": true,
                "preSale": false,
                "skuSize": 4,
                "totalSoldNum": 4,
                "basicTags": [],
                "groupId": 295444258
            },
            {
                "activityPrice": 13900,
                "alias": "2oepk80q7j1icbu",
                "id": 3832720149,
                "imageUrl": "https://img01.yzcdn.cn/upload_files/2025/01/19/FjyWsNUQAjuqtNqF8H_Vf--YEGPP.jpg",
                "price": 13900,
                "sellPoint": "红丝绒蛋糕配上乳酪益生菌奶油与草莓奶冻，车厘子和树莓的形状像爱心，传递新春的祝福与温暖，新的一年要学会爱自己！",
                "title": "「纳」·福心",
                "totalStock": 199988,
                "startSaleNum": 1,
                "messages": "[]",
                "totalId": 14822308327,
                "labelViewModel": {
                    "labelGroupModels": []
                },
                "isContainProp": false,
                "productAttributesDefined": true,
                "preSale": false,
                "skuSize": 2,
                "totalSoldNum": 7,
                "basicTags": [],
                "groupId": 295444258
            },
            {
                "activityPrice": 12900,
                "alias": "2oierjfvknybo0a",
                "id": 3832719937,
                "imageUrl": "https://img01.yzcdn.cn/upload_files/2025/01/19/FkdOQO5H2rX7GlyplZ3rOuBawMMt.jpg",
                "price": 12900,
                "sellPoint": "山楂奶油与手作山楂酱的独特风味，榛子仁与核桃仁的脆感，红彤彤的山楂，象征迎接财富与好运，送鸿运当头吉祥如意。",
                "title": "「鸿」·福禄",
                "totalStock": 599986,
                "startSaleNum": 1,
                "messages": "[]",
                "totalId": 25779482823,
                "labelViewModel": {
                    "labelGroupModels": []
                },
                "isContainProp": false,
                "productAttributesDefined": true,
                "preSale": false,
                "skuSize": 6,
                "totalSoldNum": 8,
                "basicTags": [],
                "groupId": 295444258
            },
            {
                "activityPrice": 12900,
                "alias": "3er75eq29r744bb",
                "id": 3832717665,
                "imageUrl": "https://img01.yzcdn.cn/upload_files/2025/01/22/FobyKfJW62Im8fXxjtRAMcyJ0x9J.jpg",
                "price": 12900,
                "sellPoint": "原味蛋糕胚与咸奶茶奶油的绝妙结合，鲜奶皮子带来精致口感，炒米的香脆与草莓、蓝莓的酸甜组成，是来自蒙古的味道",
                "title": "奶皮子咸奶茶炒米",
                "totalStock": 599992,
                "startSaleNum": 1,
                "messages": "[]",
                "totalId": 25779482421,
                "labelViewModel": {
                    "labelGroupModels": []
                },
                "isContainProp": false,
                "productAttributesDefined": true,
                "preSale": false,
                "skuSize": 6,
                "totalSoldNum": 2,
                "basicTags": [],
                "groupId": 295444258
            }
        ],
        "unavailableList": [],
        "group": {
            "295444258": {
                "count": 4
            }
        }
    }
}

```

上面的数据存储到具体的商品的实体中...以便后续请求api返回.

2 存储返回的json到本地缓存中,使用NestJS CacheModule 实现缓存.

3 抽取合适的数据再次存储到缓存中.   

4 请把1到3的操作组合到task.service中,使用NestJS TaskModule 实现任务.定时运行每1个小时执行一次,使用NestJS ScheduleModule 实现定时任务.

5 在新的商品列表API中返回之前存储的缓存数据.



请给brand品牌表增加一个字段 用来存放原始json

请生成2个entity用来存储 分类category 和 商品good
category字段

    分类名
    分类图片
    分类url
    分类原始json数据

商品good

    商品名
    商品描述
    商品图片
    商品价格
    商品url
    分类原始json数据


请修改youzan.service.spec.ts中的方法 得到数据后拼装到category中,然后循环category中的字段 继续请求剩下的接口获得good数据 存储到数据库中
具体数据结构请看readme.md







### 手动排序 deepseek

### 关于相似度


https://github.com/rapidfuzz/strsim-rs
// 近似度
https://github.com/Lips7/Matcher

高性能文本匹配器
https://www.v2ex.com/t/1049027

## deepseek r1 训练
https://www.bilibili.com/video/BV1tyfdY4Eyu/?spm_id_from=333.1007.tianma.2-2-4.click&vd_source=c6697a063eaf5e2d3acbeb85caac9e07


## 让deepseek帮我排序生成 手动排序



pnpm add natural cosine-similarity
脚本代码
const fs = require("fs");
const natural = require("natural");
const cosineSimilarity = require("cosine-similarity");
const tokenizer = new natural.WordTokenizer();

// 计算文本的词袋模型
const getVector = text => {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const frequency = tokens.reduce((acc, token) => {
    acc[token] = (acc[token] || 0) + 1;
    return acc;
  }, {});
  return frequency;
};

// 计算两个文本的相似度
// threshold 为重复率,范围 0-1,自由设置
const isSimilar = (text1, text2, threshold = 0.2) => {
  const vector1 = getVector(text1);
  const vector2 = getVector(text2);
  const similarity = cosineSimilarity(vector1, vector2);
  return similarity >= threshold;
};




### 中文分词近似值 
pnpm i @node-rs/jieba --save


编写相似度去重的service
1 先从goods表中 查询所有brand.name 含有 wenting 文汀的商品
2 从goods表中 查询所有brand.name 含有 德罗心 的 商品
3 循环遍历 从1 中获得的 goods , 用每个good 和 2中的所有goods 进行比较,按照相似度顺序排序,相似度判定方法如下
 先判断两个goods的brand.name 是否相同,如果相同,则相似度100%.
 然后使用@https://www.vvhan.com/article/nodejs-text-similar-de-duplication-script.html 提到的方法.
 对 good 的 商品描述description进行相似度比较.然后对 good的商品标题 name 进行相似度比较..
 得到的排序score数据和对应的good保存下来.. 
4 循环结束后,把排序好的goods 插入到good的 similarity数组中 返回