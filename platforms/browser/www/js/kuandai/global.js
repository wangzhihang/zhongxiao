	
var kuandai_combination_address = {} // 智慧沃家 宽带地址预判
	, kuandai_combination = {} 		// 智慧沃家 宽带套餐部分
	, kuandai_tel_package = {} 		// 智慧沃家 号码套餐部分
	, isOldNumber = null 		// false(新添号码) true(纳入号码)
	, writesimNow = null 		// 写入号码在 kuandai_tel 的key
	, kuandai_tel = {} 			// "手机号码":{同telInfo}

	, wojiaIsronghe = null		// 判断是不是共享套餐
	, wojiaRootProductId = ""	// root ID
	, wojiaflowProductId = ""	// 流量包ID
	, KuandaiMainProductName = ""	// 宽带类型名称

	, kuandai_wk_isFixedLan = false	// 单宽和王卡
	
	// 号码手机套餐
	, kuandai_tel_package_list = {}

	// 融合套餐
	, kuandai_selected_package = {}

	// 宽带组合 购机赠费
	, kuandai_phoneGiveFee = {}
	, kuandai_phoneListMap = {}

	, simcardinfo = {}


	// 纳入的号码套餐
	// 结构 "号码":返回的套餐 和 userInfo 信息
	, kuandai_oldUserInfo = {}
	// 结构 "号码":(融合的是一个固定的套餐,共享的是一个新套餐)
	, kuandai_oldNumberProduct = {} 		// 纳入号码时，老号码的套餐
	, kuandai_oldNumberProductList = {}
	, kuandai_oldNumberElementList = {}
	, kuandai_oldNumberPackageList = {} 	// 纳入号码时，老号码的套餐 package | element
	, kuandai_oldNumberProduct_Admissible = []	// 临时周转(纳入可用套餐)
	, kuandai_combination_list = []		// 沃家组合 两条宽带
	, kuandai_wojia_combination_addTwo = false	// 是否第二天宽带

	, kuandai_bssLan = {}
	, bssLanConfirm = ""

	, kuandai_number_into = true	// 是否显示纳入
	, kuandai_number_info = {} 		// 定制套餐 号码信息
	, kuandai_iptvinfo = {}
	, wx_orderCode = ""

	// 南阳宽带临时
	, lanElementId = ""
;
function reset_kuandai_wojia_package(){
	kuandai_tel_package = {
		"productId":"",
		"productName":"",
		"sub_productObj":{},
		"result":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"service":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"activity":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
	};
}
function reset_kuandai_wojia(){
	kuandai_combination_address = {
		"addressCode":"",
		"addressName":"",
		"setupaddress":"",
		"citycode":"",
		"detaileds":"",
		"detailed":""
	};
	kuandai_combination = {
		"broadband":{"productInfo":{},"lanproduct":[],"lanelementlist":[],"tv":{"lanproduct":[],"lanelementlist":[]},"activity":{"lanproduct":[],"lanelementlist":[]}}
		, "combination":{"info":{},"ElementList":[],"ElementListFlow":[],"ElementListVoice":[],"ElementListSMS":[],"ElementDetailList":[],"ElementList1-5G":[]}
		, "service":{"info":[],"ElementList":[]}
		, "totalLower":""	// 成功后 返回的订单总额
		, "feeList":[]		// 成功后 返回的价格列表
		, "remark":""		// 备注
		// 机顶盒硬件信息
		, "tvMacAddress":""
		, "tvPrice":""
		, "tvType":""
		// ftth硬件信息
		, "ftthMacAddress":""
		, "ftthMode":""
		, "ftthPrice":""
		, "ftthType":""
	};
	reset_kuandai_wojia_package();
	reset_authentication();

	// 号码列表
	kuandai_tel = {};
	simcardinfo = {};
	kuandai_iptvinfo = {};
	kuandai_tel_package_list = {};
	kuandai_selected_package = {
		"voice":[],
		"SMS":[],
		"tv":false,
		"tv_type":"",
		"1-5G":false
	};
	kuandai_oldUserInfo = {};
	kuandai_oldNumberProduct = {};
	kuandai_oldNumberPackageList = {};
	kuandai_oldNumberProduct_Admissible = [];

	kuandai_phoneGiveFee = {"imei":""};
	kuandai_phoneListMap = {};

	writesimNow = null;
	yy_order = {};
	wx_order = {};
	kuandai_wk_isFixedLan = false;
	cbss_commission = {};	// 套餐佣金

	
	kuandai_combination_list = [];		// 沃家组合 两条宽带
	kuandai_wojia_combination_addTwo = false;	// 是否第二天宽带
}


// function reset_kuandai_bssLan() {
// 	kuandai_bssLan = {
// 		"address":{
// 			"addresscode":""	// 地址编号
// 			,"addressname":"" 	// 地址名称
// 			, "setupaddress":""	// 具体安装地址

// 			, "accmode":"" 		// 接入方式
// 			, "accmodeName":"" 	// 接入方式名称
// 			, "resources":""	// 资源
// 			, "portnum":"" 		// 端口总数
// 			, "idlecount":"" 	// 端口空闲数
// 			, "exchcode":"" 	// 局向编码
// 			, "exchname":"" 	// 局向名称
// 			, "speed":"" 		// 支持速率
// 			, "projectcode":""	// 项目编码
// 			, "projectname":""	// 项目名称
// 			, "localnetid":""	// 后面找
// 		}
// 		, "lanaccount":""		// 宽带号码
// 		, "areaCode":""
// 		, "serviceAreaId":""
// 		, "serialNumber":""		// 预占返回的data
// 		, "serviceKind":""		// 接入方式
// 		, "innetMethod":""		// 接入方式
// 		, "accAreaId":""		//号码放号地区
// 		, "accAreaCode":""
// 		, "accAreaName":""
// 		, "bandWidth":""		// 选择宽带类型 "50M","100M"
// 		, "bandWidthName":""
// 		, "developerDealer":""	// 实施人信息的value
// 		, "developChannel":""
// 		, "areaTownId":""		// 所属地区信息(bss_lan_getAreaTownInfo)
// 		, "productId":""		// 宽带产品(bss_lan_getProductList)
// 		, "productName":""
// 		, "tvMacAddress":""
// 		, "tvInfo":{}
// 		, "ftthInfo":{}
// 	}
// 	reset_authentication();
// }

jump["wojia-combination"]={
	"address":"authentication-device",

	"package-tel":"kuandai-wojia-number-selected",
	"number-into":"kuandai-wojia-combination-package-tel-list-into",
	"number-list":"kuandai-wojia-combination-package-tel-list",
	"number-selected":"kuandai-wojia-combination-package-lan-list",

	"authentication":"kuandai-wojia-number-selected",
	"confirm":"kuandai-wojia-order-confirm",
	"signature":"kuandai-submit-wojia"
}
jump["cbssLan"]={
	"address":"authentication-device",
	"authentication":"kuandai-cbss-SingleLan-list",
	"confirm":"kuandai-cbss-single-order-confirm",
	"signature":"kuandai-cbss-submit-singleLan"
}
// jump["wojia-combination-56"]={
// 	"address":"kuandai-wojia-number-selected"

// 	, "package-tel":"kuandai-wojia-number-selected"
// 	, "number-into":"kuandai-wojia-combination-package-tel-list-into"
// 	, "number-list":"kuandai-wojia-combination-package-tel-customized"
// 	, "number-selected":"authentication-device"

// 	, "authentication":"kuandai-wojia-combination-package-lan-list"
// 	, "signature":"kuandai-submit-wojia"
// }
// jump["wojia-combination-88"]={
// 	"address":"kuandai-wojia-number-selected"

// 	, "package-tel":"kuandai-wojia-number-selected"
// 	, "number-into":"kuandai-wojia-combination-package-tel-list-into"
// 	, "number-list":"kuandai-wojia-combination-package-tel-customized"
// 	, "number-selected":"authentication-device"

// 	, "authentication":"kuandai-wojia-combination-package-lan-list"
// 	, "signature":"kuandai-submit-wojia"
// }
// jump["wojia-combination-88b"]={
// 	"address":"kuandai-wojia-number-selected"

// 	, "package-tel":"kuandai-wojia-number-selected"
// 	, "number-into":"kuandai-wojia-combination-package-tel-list-into"
// 	, "number-list":"kuandai-wojia-combination-package-tel-customized"
// 	, "number-selected":"authentication-device"

// 	, "authentication":"kuandai-wojia-combination-package-lan-list"
// 	, "signature":"kuandai-submit-wojia"
// }

jump["wojia-ronghe"]={
	 "address":"kuandai-wojia-number-selected"

	, "number-list":"kuandai-wojia-number-selected"
	, "number-into":"kuandai-wojia-number-selected"
	, "number-selected":"authentication-device"

	, "authentication":"kuandai-wojia-ronghe-package-index"
	, "signature":"kuandai-submit-wojia"
}
jump["wojia-share-suburb"]={
	 "address":"kuandai-wojia-number-selected"

	, "number-list":"kuandai-wojia-number-selected"
	, "number-into":"kuandai-wojia-number-selected"
	, "number-selected":"authentication-device"
	
	, "authentication":"kuandai-wojia-ronghe-package-index"
	, "signature":"kuandai-submit-wojia"
}
// jump["bssLan"]={
// 	  "authentication":"kuandai-bss-lan-lan_getinnetmethod"
// 	, "signature":"kuandai-bss-lan-submitOrder"
// }