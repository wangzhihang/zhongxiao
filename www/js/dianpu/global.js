	// bss 套餐
var	dianpu_bss_package_array = {
		"bssPackageList":[],
		"bssPackageSelect":null
	}

	, bss_huinongka = ""
	, bss_faceCheckAndUploadPhoto_uploadResponse = ""// bss国政通图片校验

	// CBBS开卡订单 需要参数
	, dianpu_cbss_package_array = {}
	, cbss_wzhDeal_orderinfo = null		// cbss单卡 无纸化
	, dianpu_cbss_zf_tradeType = "0"  	// 主副卡 0:白卡 3:副卡 4:主卡
	, dianpu_cbss_zkInfo = {}			// 做副卡是的(主卡信息)

	// 成卡返单
	, dianpu_dealerreturn = {
		"number":"",
		"orderNo":"",
		"productCode":"",		// 套餐的productId
		"productName":"",		// 套餐名称
		"queryServiceInfo":""	// 默认卡信息(包含默认套餐,sim卡信息等内容)
	}

	// 商务座机
	, dianpu_pstn = {}

	// cbss 购机赠费
	, dianpu_phoneGiveFee = {
		"imei":"",
		"phoneinfo":{}
	}

	, dianpu_order_amount = "0"	// 订单返回总额(可以删除了)

	, reelectNumber = 0 		// 是否重选号码
	, reelectPackage = 0
	, reelectPhone = 0
	, cbss_huabei = 0
	, changeOrderInfo = null

	, photoGraph_orderNo = ""
	, signature_orderNo = ""

	, submitFee = ""
	, submitAmount = ""

	, changshiProduct = false  	// 畅视卡
	, changshiInfo = {}

	,cbss_package_original = ""
	,cbbs_package = {
		"contractId":"",
		"productId":""		// 主套餐ID
	}
	,temp_cbss_activity = ""	// 集客活动临时


	// CBBS开卡订单 需要参数
	,jike_cbss_package_arr = {
		"result":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"service":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"activity":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""}
	},

	cbss_commission = {},
	dianpu_cbss_groupData = null	// 社会渠道cbss集团归集
	cbss_packageList = [];
	orderContinue = {}

;

function reset_dianpu_cbss(){
	var type = arguments[0];
	dianpu_cbss_package_array = {
		"sub_productObj":{},
		"result":  {"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"service": {"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"activity":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"phoneGiveFee":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"zhuka":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""} 	// 主卡包
	}
	reelectNumber = 0;
	reelectPackage = 0;
	reelectPhone = 0;
	cbss_huabei = 0;
	changeOrderInfo = null;

	cbss_wzhDeal_orderinfo = null;
	dianpu_cbss_zf_tradeType = "0"  	// 主副卡 0:白卡 3:副卡 4:主卡
	dianpu_cbss_zkInfo = {}				// 主卡信息
	eleWorkPdf = {}

	order_amount = null;
	submitFee = "" 	// cbss确认后的信息 "preFee"预存
	submitAmount = "" // cbss 费用总额
	writesimNow = null;
	reset_authentication();
	reset_telInfo();
	empty_filterSelect();
	sourceName = "";
	order_info = {
		"number":"",
		"productId":"",
		"productName":"",
		"activityId":"",
		"activityName":""
	};
	if(type && type.wx == true){
	}else{
		wx_order = {};
	}
	changshiProduct = false;	// 是否畅视卡
	yy_order = {};
	JumpHalfPackage = {};


	// jike jike
	// 点击套餐列表具体到套餐是 获取到的原始数据(包含了套餐的详细信息,所以不用再列表页获取主套餐的信息)
	cbss_package_original = "";
	cbbs_package = {
		"contractId":"",
		"productId":""		// 主套餐ID
	};
	temp_cbss_activity = ""	// 集客活动临时


	// CBBS开卡订单 需要参数
	jike_cbss_package_arr = {
		"result":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"service":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
		"activity":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""}
	};

	scanCode_order={
		"id":"",
		"orderCode":"",
		"name":"",
		"cardId":""
	};
	
	jike_group_person = {};
	dianpu_cbss_groupData = null;
	orderContinue = {};
	reste_dianpu()
}
function reset_dianpu_bss(){
	var type = arguments[0];
	reelectNumber = 0;
	eleWorkPdf = {};

	order_amount = null;
	submitFee = "";
	writesimNow = null;
	reset_authentication();
	reset_telInfo();
	empty_filterSelect();
	sourceName = "";
	order_info = {
		"number":"",
		"productId":"",
		"productName":"",
		"activityId":"",
		"activityName":""
	};
	bss_huinongka = "";
	if(type && type.wx == true){
	}else{
		wx_order = {};
	}
	yy_order = {};
	bss_faceCheckAndUploadPhoto_uploadResponse = "";// bss国政通图片校验
	reste_dianpu()
}

function reste_dianpu(){
	camera_authentication = {
		"list":{},
		"show":{"birthday":{},"limitedPeriod":""},
		"photo":{},
		"isHeadSide":{}
	};
	cbss_commission = {}

}

reset_dianpu_cbss();
reset_dianpu_bss();


jump["cbssJumpPackage"] = {
	"number-list":"authentication-device",
	"authentication":"dianpu-cbss-write-sim",
	"signature":"dianpu-cbss-write-sim-submit"
};
jump["cbssJumpHalfPackage"] = {
	"number-list":"dianpu-cbbs-package-result",
	"authentication":"dianpu-cbss-write-sim",
	"signature":"dianpu-cbss-write-sim-submit"
};
jump["telSelectCBSS"] = {
	"number-list":"dianpu-cbss-package-list",
	"authentication":"dianpu-cbss-write-sim",
	"signature":"dianpu-cbss-write-sim-submit"
};
jump["cbssSemiManufactures"] = {
	"number-list":"dianpu-cbss-package-list",
	"authentication":"dianpu-cbss-write-sim",
	"signature":"dianpu-cbss-write-sim-submit"
};
jump["cbssPhoneGiveFee"] = {
	"number-list":"dianpu-cbss-package-list",
	"authentication":"dianpu-cbss-write-sim",
	"signature":"dianpu-cbss-write-sim-submit"
};

// 未签名前置
jump["cbssDealerreturn"]={
	"authentication":"dianpu-cbss-dealerreturn-confirm",
	"signature":"dianpu-cbss-dealerreturn-submit"
};
jump["cbssFuka"]={
	"number-list":"authentication-device",
	"authentication":"dianpu-cbss-fukaInfo",
	"dianpu-cbss-package-list":"dianpu-cbss-write-sim",
	"signature":"dianpu-cbss-write-sim-submit"
};



jump["telSelectBSS"]= {
	"number-list":"dianpu-bss-package-list",
	"dianpu-bss-package-list":"authentication-device",
	"authentication":"dianpu-bss-write-sim",
	"signature":"dianpu-bss-write-sim-submit"
};
jump["telSelectNewBSS"]= {
	"number-list":"dianpu-bss-package-list",
	"dianpu-bss-package-list":"authentication-device",
	"authentication":"dianpu-bss-write-sim",
	"signature":"dianpu-bss-write-sim-submit"
};
jump["bssSemiManufactures"]= {
	"number-list":"dianpu-bss-package-list",
	"dianpu-bss-package-list":"authentication-device",
	"authentication":"dianpu-bss-write-sim",
	"signature":"dianpu-bss-write-sim-submit"
};

jump["bssDealerreturn"]={
	"authentication":"dianpu-bss-dealerreturn-confirm",
	"signature":"dianpu-bss-dealerreturn-submit"
};
jump["bssPstnReturn"]={
	"authentication":"dianpu-bss-dealerreturn-confirm",
	"signature":"dianpu-bss-dealerreturn-submit",
	"pstn":"dianpu-pstn-confirm"
};
jump["bssPstnReturn8"]={
	"authentication":"dianpu-pstn-confirm"
};
jump["qrgo"]={
	"authentication":"dianpu-qrgo-submitOrder",
	"signature":"dianpu-qrgo-writesimok"
};
jump["qrgo2"]={
	"authentication":"dianpu-qrgoV2-submitOrder",
	"signature":"dianpu-qrgoV2-writesimok"
};