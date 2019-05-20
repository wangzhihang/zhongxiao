var	  ajaxurl = "http://z.haoma.cn/tms-app-war/"	// JAVA服务器地址
// var	  ajaxurl = "http://116.62.29.167/tms-app-war/"	// JAVA服务器地址
// var	  ajaxurl = "http://192.168.31.16:8080/tms-app-war/"
	, unicommServer = ""
	// , unicommServer = "114.55.2.229:10060"
	// , unicommServer = "120.27.150.113:10060"
	, app = ""
	, appName = "便捷受理系统"
	, agencyId = ""		// 代理ID (登录时获取)
	
	, appFuncListShow = {} 		// 可使用的功能
	, appFuncListRx = [] 		// 热门套餐
	
	, disPreCharge = 100		// 地区最低预存(宝鸡地区要求预存为0,现在临时在登录加了一个补丁)
	// cbss套餐获取方式 更改后 可以删
	, activityFee = 0 	// cbss选择活动后是否不允许在添加预存 1是不允许
	, preChargeAddActivity = 0 	// cbss预存和活动 0:不相加 1:相加
	, disPreChargeList = []		// 预存
	
	, versionName = "zx_version"
	, version = "0.2.12.49"

	// , pdfContent = null // 成功后生产的工单内容
	// , appDevice = ""


	// 登录信息
	, bssInfo = {}
	, cbssInfo = {}
	, bssInfoHaoma = {}
	, unicomm_account = {}
	
	, userInfo = {}
	, userBo = {}
	,deptInfo={}
	,accountInfo={}
	// 微店
	, shopInfo = {
		"shopname":null,
		"shopUrl":null
	}
	// 存量维系
	, assertUserType = ''

	, shopBo = {}
	// 附加套餐活动显示情况,预付款设置,减免金额(现在只有四川有)
	, cateInfo = {}


	// 号码列表页 
	, numberSelect = -1	// 选中号码的 index 值
	, filterData = {}	// 筛选Json
	, filterSelect = {}	// 筛选Json


	, number_pool = ""		// 联通号池 BSS|CBSS
	, service_type = ""		// 办理的业务类型
	, source = "" 			// 业务编码
	, sourceName = ""
	, order_type = "" 		// 订单类型
	, order_type2id = {
		"kaika":"000001",
		"kuandai":"000002",
		"pstn":"000003"
	}
	, jump = {} 			// 共用文件跳转 控制


	// 认证信息
	, authentication = {}
	// 号码信息
	, telInfo = {}

	// 硬件相关
	, CameraOptions = ""	// 拍摄设置
	, BLEcurrDevice = null 	// 蓝牙链接标识符
	, SelectDevice = null 	// 选中设备 nfc|ble


	// 个人中心->订单
	, order = {
		"number":""	// 订单详情需要的号码
	}

	, bssPdf = {"personInfo":{}} 	// bss 电子工单

	, order_amount = "0"


	// 微信订单
	, wx_order = {
		"number":"",
		"orderCode":"",
		"orderStatus":"",
		"orderType":"",
		"category":"",
		"userId":""
	}
	, order_info = {
		"number":"",
		"productId":"",
		"productName":""
	}
	//异业办理
	, yy_order={}
	// 营业厅订单
	, scanCode_order={
		"id":"",
		"orderCode":"",
		"name":"",
		"cardId":""
	}

	, senruiAccount
	, senruiList
	, senruiActive
	, tms_valid_token = guid()	// cmd token
	, GoodHaoma = true


	, BusinessSubmission = false
	, cropperID		// 拍照 身份验证 的裁剪页面ID
	, camera_authentication={} // 拍照 身份验证 信息周转
	, qrgoInfo = {} // 码上购

	, authentication_faceVerify = false

	, cbss_commission = {}
;



function reset_authentication() {
	authentication = {
		"name":"", 				// 客户姓名
		"cardId":"", 			// 身份证号码
		"idHeadImg":"", 		// 客户照片的base64
		"imagepath":"", 		// 拍照 图片地址
		"customerImageUrl":"",  // 拍照 图片地址(上面的要取消)
		"customerImagebase64":"",  // 拍照 base64 bss需要
		"address":"", 			// 客户地址，一般为身份证地址
		"start_date":"", 		// 身份证有效日期，格式为yyyy-MM-dd
		"end_date":"", 			// 身份证有效日期，格式为yyyy-MM-dd
		"birthday":"", 			// 出生年月日，格式为yyyy-MM-dd
		"contractNumber":"", 	// 联系人号码
		"gender":"", 			// 性别
		"police":"", 			// 公安局
		"nation":"", 			// 国家
		"orderNo":"", 			// 订单
		"telOrderNo":"", 		// 订单
		"uploadLivePhoto":[], 
	}
}
function reset_telInfo(){
	telInfo = {
		"tel":"",
		"package":"",
		"orderNo":"",		// 订单
		"costPrice":"",	// 号码费用
		"preCharge":"",	// 预存话费
		"lowCost":"",		// 最低消费
		"leaseLength":"",	// 在网时间
		"productId":"",	// 主套餐ID
		"productName":"",	// 主套餐Name
		"isOldNumber":null,
		"write":null,
		"tradeType":",0"
	}
}

function reset_login(){
	userInfo = {};
	shopInfo = {};
	shopBo = {};
	cateInfo = {};

	bssInfo = {};
	cbssInfo = {};
	bssInfoHaoma = {};
	unicomm_account = {};
}