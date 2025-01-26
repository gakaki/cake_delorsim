export class YouzanFirstLevelConfig {
	shelf: YouzanShelf;
	pickUpWaySupport: PickUpWaySupport;
	orderPool: OrderPool;
	personalizedShopVisit: PersonalizedShopVisit;
	cart: Cart;
	extra: Extra;
	shopConfigs: ShopConfigs;
	displayCarrierConfig: DisplayCarrierConfig;
	apollo: Apollo;
	supportExpress: boolean;
	birthdayRelationEnable: boolean;
	shelfContact: ShelfContact;
}

export class YouzanShelf {
	goodsDetailDisplay: number;
	templateId: number;
	pageId: number;
	recommendGoods: RecommendGoods;
	cartLogo: string;
	showSearchComponent: boolean;
	logoUrl: string;
	showOrderPool: boolean;
	showUmp: number;
	shopHeaderConfig: ShopHeaderConfig;
	umpCoupon: UmpCoupon;
	pickUpWaySupport: number[];
	goodsListStyle: GoodsListStyle;
	groupStyle: number;
	groupBadge: boolean;
	itemGroupList: ItemGroup[];
	isShowAllGroup: boolean;
	groupInnerDynamicItems: GroupInnerDynamicItem[];
	orderSheetAd: OrderSheetAd;
	groups: Groups;
	couponListData: any;
	umpGoodsListData: any;
	recommendGoodsListData: any;
	selfFetchFirstGoodsList: SelfFetchFirstGoodsList;
	firstExtraDataCache: FirstExtraDataCache;
	weappGoodsListStyle: WeappGoodsListStyle;
}

export class RecommendGoods {
	goodsList: any[];
	goodsListStyle: any;
	title: string;
}

export class ShopHeaderConfig {
	showMode: number;
	announcementComponents: AnnouncementComponent[];
	alias: string;
	showUmp: number;
	showSearchComponent: boolean;
	umpCoupon: UmpCoupon;
	logoUrl: string;
}

export class AnnouncementComponent {
	announcementMessage: string;
	show: number;
	type: string;
}

export class UmpCoupon {
	addType: number;
	autoType: number;
	autoValue: string;
	activities: any[];
	hideEmptyCoupon: number;
	takeCouponComponentType: number[];
	takeCouponPopupStyleType: number;
	customizedPopupImage: string;
	show: boolean;
}

export class GoodsListStyle {
	goodsStyle: string;
	border: string;
	fill: string;
	textStyle: string;
	size: string;
	isShowTitle: number;
	isShowSubtitle: number;
	isShowOriginalPrice: number;
	isShowSales: number;
	isShowStock: number;
	showStockCondition: number;
	stepper: string;
}

export class ItemGroup {
	customSortGoods: CustomSortGood[];
	deliveryTypeList: number[];
	groupId: number;
	groupItemNum: number;
	groupLevel: number;
	groupTitle: string;
	groupType: number;
	hideItemIdList: any[];
	icon: string;
	isDelete: number;
	isSelfFetch: boolean;
	isTakeOut: boolean;
	itemSubGroupInfoDTOList: any[];
	parentGroupId: number;
	rootKdtId: number;
	shelfDescription: string;
	shelfStatus: number;
	showMode: number;
	showModeDetail: string;
	sortType: number;
	sourceKdtId: number;
	sourceKdtName: string;
	title: string;
	type: number;
}

export class CustomSortGood {
	id: number;
	sort: number;
}

export class GroupInnerDynamicItem {
	data: GroupInnerDynamicData;
	type: string;
}

export class GroupInnerDynamicData {
	border: string;
	templateType: number;
	images: Image[];
	indicatorType: number;
	showMode: number;
}

export class Image {
	id: string;
	url: string;
}

export class OrderSheetAd {
	border: string;
	images: Image[];
	indicatorType: number;
	showMode: number;
	templateType: number;
}

export class Groups {
	selfFetch: Group[];
	delivery: Group[];
	express: any[];
	selfFetchRecovery: boolean;
	deliveryRecovery: boolean;
	expressRecovery: boolean;
	selfFetchForceRender: boolean;
	deliveryForceRender: boolean;
	expressForceRender: boolean;
}

export class Group {
	alias: string;
	children: any[];
	count: number;
	groupId: number;
	icon: string;
	shelfDescription: string;
	title: string;
	countSale: number;
	sortType: number;
	prefetchGoodsIds: number[];
	hideItemIdList: any[];
	ceilCountHalf: number;
	skeletonPlaceholder: number[];
}

export class SelfFetchFirstGoodsList {
	list: SelfFetchGood[];
	unavailableList: any[];
	group: { [key: number]: GroupCount };
}

export class SelfFetchGood {
	activityPrice: number;
	alias: string;
	id: number;
	imageUrl: string;
	price: number;
	sellPoint: string;
	title: string;
	totalStock: number;
	startSaleNum: number;
	arriveTimeDesc: string;
	messages: string;
	totalId: number;
	labelViewModel: LabelViewModel;
	isContainProp: boolean;
	productAttributesDefined: boolean;
	preSale: boolean;
	skuSize: number;
	totalSoldNum: number;
	basicTags: any[];
	groupId: number;
}

export class LabelViewModel {
	labelGroupModels: any[];
}

export class GroupCount {
	count: number;
}

export class FirstExtraDataCache {
	deliveryTimesMap: any;
	activityInfoMap: { [key: number]: ActivityInfo };
	skuDirectOrderMap: any;
}

export class ActivityInfo {
	activityPrice: number;
	id: number;
	price: number;
	origin: string;
	showStartTag: boolean;
}

export class WeappGoodsListStyle {
	DELIVERY: GoodsListStyleConfig;
	EXPRESS: GoodsListStyleConfig;
	SELF_TAKE: GoodsListStyleConfig;
	COMMON: CommonGoodsListStyle;
}

export class GoodsListStyleConfig {
	goodsListWidth: number;
	width: number;
	height: number;
	skeletonHeight: number;
	imageFill: string;
	style: string;
	listGoodsSize: ListGoodsSize;
	groupListWidth: number;
	dynamicGoodsSize: DynamicGoodsSize;
	recommendGoodsSize: RecommendGoodsSize;
}

export class ListGoodsSize {
	imageFill: string;
	style: string;
}

export class DynamicGoodsSize {
	goodsListWidth: number;
	width: number;
	height: number;
	skeletonHeight: number;
	imageFill: string;
	style: string;
	listGoodsSize: ListGoodsSize;
}

export class RecommendGoodsSize {
	width: string;
	height: string;
	style: string;
}

export class PickUpWaySupport {
	delivery: boolean;
	selfFetch: boolean;
}

export class OrderPool {
	available: boolean;
}

export class PersonalizedShopVisit {
	showOnlineShopSwitch: boolean;
	showUserLocation: boolean;
	enterScene: string;
	onlineShopVisitModel: string;
	visitSecondConfirm: string;
}

export class Cart {
	isShopInPerfWhiteList: boolean;
}

export class Extra {
	autoVerify: number;
	cdbSet: number;
	goodsDetailDisplay: number;
	orderSecondConfirm: number;
	retailAutoVerify: number;
	retailMinappShelfOrderSetting: string;
	selfRefundConfig: number;
}

export class ShopConfigs {
	house_number_required: string;
	goods_detail_sales: string;
}

export class DisplayCarrierConfig {
	carrierSubType: number;
	carrierType: number;
	scene: Scene;
}

export class Scene {
	cartPageSwitch: boolean;
	itemDetailSwitch: boolean;
	readyOrderPageSwitch: boolean;
	shelfOrderPageSwitch: boolean;
}

export class Apollo {
	retail_shelf_order: boolean;
}

export class ShelfContact {
	mobileNumber: string;
	phone: string;
}
