function daili(_this) {
	_this
	//注册
	.state("sign-up", {
		  templateUrl:"templates/daili/signUp.html"
		, url:"/sign-up"
		, controller:"sign-up"
	})
	//店铺
	.state("daili-shop-index", {
		  templateUrl:"templates/daili/shopIndex.html"
		, url:"/daili-shop-index/:userId/:abnormal"
		, controller:"daili-shop-index"
	})
	//店铺列表
	.state("daili-shop-list", {
		  templateUrl:"templates/daili/shopList.html"
		, url:"/daili-shop-list"
		, controller:"daili-shop-list"
	})
	//店铺
	.state("daili-shop", {
		  templateUrl:"templates/daili/shop.html"
		, url:"/daili-shop"
		, controller:"daili-shop"
	})
	//店铺设置
	.state("daili-shop-set", {
		  templateUrl:"templates/daili/shopSet.html"
		, url:"/daili-shop-set"
		, controller:"daili-shop-set"
	})
	//添加店铺
	.state("daili-add-shop", {
		  templateUrl:"templates/daili/addShop.html"
		, url:"/daili-add-shop"
		, controller:"daili-add-shop"
	})
	//店铺用户登录时间记录表
	.state("daili-shop-login-log", {
		  templateUrl:"templates/daili/shopLoginLog.html"
		, url:"/daili-shop-login-log"
		, controller:"daili-shop-login-log"
	})
	//店铺用户登录状态记录表
	.state("daili-shop-login-state", {
		  templateUrl:"templates/daili/shopLoginState.html"
		, url:"/daili-shop-login-state"
		, controller:"daili-shop-login-state"
	})
	//业务员首页
	.state("daili-salesman-index", {
		  templateUrl:"templates/daili/salesmanIndex.html"
		, url:"/daili-salesman-index"
		, controller:"daili-salesman-index"
	})
	//业务员详情
	.state("daili-salesman", {
		  templateUrl:"templates/daili/salesman.html"
		, url:"/daili-salesman"
		, controller:"daili-salesman"
	})
	//添加业务员
	.state("daili-add-salesman", {
		  templateUrl:"templates/daili/addSalesman.html"
		, url:"/daili-add-salesman"
		, controller:"daili-add-salesman"
	})
	//通讯录
	.state("daili-address-book-list", {
		  templateUrl:"templates/daili/addressBookList.html"
		, url:"/daili-address-book-list"
		, controller:"daili-address-book-list"
	})
	.state("daili-address-book-detail", {
		  templateUrl:"templates/daili/addressBookDetail.html"
		, url:"/daili-address-book-detail"
		, controller:"daili-address-book-detail"
	})
	//用户照片审核
	.state("daili-avatar-check", {
		  templateUrl:"templates/daili/avatarCheck.html"
		, url:"/daili-avatar-check"
		, controller:"daili-avatar-check"
	})
	//用户照片审核订单详情
	// .state("daili-avatar-check-detail", {
	// 	  templateUrl:"templates/daili/avatarCheckDetail.html"
	// 	, url:"/daili-avatar-check-detail"
	// 	, controller:"daili-avatar-check-detail"
	// })
	//店铺权限分配
	.state("daili-dianpu-power-divsion", {
		  templateUrl:"templates/daili/dianpuPowerDivsion.html"
		, url:"/daili-dianpu-power-divsion"
		, controller:"daili-dianpu-power-divsion"
	})

	//修改密码
	.state("change-password", {
		  templateUrl:"templates/daili/changePassword.html"
		, url:"/change-password"
		, controller:"change-password"
	})
	// //设置手势密码
	// .state("lock", {
	// 	  templateUrl:"templates/daili/lock.html"
	// 	, url:"/lock"
	// 	, controller:"lock"
	// })
	//用户中心
	.state("uc", {
		  templateUrl:"templates/daili/uc.html"
		, url:"/uc"
		, controller:"uc"
	})
	//余额
	.state("user-account", {
		  templateUrl:"templates/daili/userAccount.html"
		, url:"/user-account"
		, controller:"user-account"
	})
	//佣金记录
	.state("commission-log", {
		  templateUrl:"templates/daili/commissionLog.html"
		, url:"/commission-log"
		, controller:"commission-log"
	})
	//佣金设置
	.state("commission-set", {
		  templateUrl:"templates/daili/commissionSet.html"
		, url:"/commission-set"
		, controller:"commission-set"
	})
	//订单列表（宽带）
	.state("kd-order-list", {
		  templateUrl:"templates/daili/kdOrderList.html"
		, url:"/kd-order-list/:startTime/:endTime/:status/:devdId"
		, controller:"kd-order-list"
	})
	//订单详情（宽带）
	.state("kd-order-detail", {
		  templateUrl:"templates/daili/kdOrderDetail.html"
		, url:"/kd-order-detail/:number/:orderCode/:numOrderCode"
		, controller:"kd-order-detail"
	})
	//订单列表（开卡）
	.state("kk-order-list", {
		  templateUrl:"templates/daili/kkOrderList.html"
		, url:"/kk-order-list/:startTime/:endTime/:status/:devdId"
		, controller:"kk-order-list"
	})
	//订单详情（开卡）
	.state("kk-order-detail", {
		  templateUrl:"templates/daili/kkOrderDetail.html"
		, url:"/kk-order-detail"
		, controller:"kk-order-detail"
	})
	//订单列表（话费）
	.state("hf-order-list", {
		  templateUrl:"templates/daili/hfOrderList.html"
		, url:"/hf-order-list"
		, controller:"hf-order-list"
	})
	//交易流水（列表）
	.state("transaction-log", {
		  templateUrl:"templates/daili/transactionLog.html"
		, url:"/transaction-log"
		, controller:"transaction-log"
	})
	//店铺充值（列表）
	.state("shop-recharge-log", {
		  templateUrl:"templates/daili/shopRechargeLog.html"
		, url:"/shop-recharge-log"
		, controller:"shop-recharge-log"
	})
	//绑定银行卡
	.state("bind-bank-card", {
		  templateUrl:"templates/daili/bindBankCard.html"
		, url:"/bind-bank-card"
		, controller:"bind-bank-card"
	})
	//提现申请
	.state("withdraws-cash", {
		  templateUrl:"templates/daili/withdrawsCash.html"
		, url:"/withdraws-cash"
		, controller:"withdraws-cash"
	})
	// 码上购管理 
	.state("mSg-account-list", {
			templateUrl:"templates/daili/mSgAccountList.html"
		, url:"/mSg-account-list"
		, controller:"mSg-account-list"
	})
	// 码上购发展人列表
	.state("mSg-developers-list", {
			templateUrl:"templates/daili/mSgDevelopersList.html"
		, url:"/mSg-developers-list"
		, controller:"mSg-developers-list"
	})
	// 码上购表单(创建/修改)
	.state("mSg-form", {
			templateUrl:"templates/daili/mSgForm.html"
		, url:"/mSg-form"
		, controller:"mSg-form"
	})
	//提现申请记录表
	.state("withdraws-cash-log", {
		  templateUrl:"templates/daili/withdrawsCashLog.html"
		, url:"/withdraws-cash-log"
		, controller:"withdraws-cash-log"
	})
	//CBSS::CBSS工号列表
	.state("cbss-account-list", {
		  templateUrl:"templates/daili/cbssAccountList.html"
		, url:"/cbss-account-list"
		, controller:"cbss-account-list"
	})
	//CBSS::CBSS店铺列表
	.state("cbss-shop-list", {
		  templateUrl:"templates/daili/cbssShopList.html"
		, url:"/cbss-shop-list"
		, controller:"cbss-shop-list"
	})
	//CBSS::修改CBSS密码
	.state("change-cbss-pwd", {
		  templateUrl:"templates/daili/changeCbssPwd.html"
		, url:"/change-cbss-pwd"
		, controller:"change-cbss-pwd"
	})
	//CBSS::添加CBSS工号
	.state("add-cbss-account", {
		  templateUrl:"templates/daili/addCbssAccount.html"
		, url:"/add-cbss-account"
		, controller:"add-cbss-account"
	})
	//CBSS::查询Cbss发展人
	.state("search-cbss-developer", {
		  templateUrl:"templates/daili/searchCbssDeveloper.html"
		, url:"/search-cbss-developer"
		, controller:"search-cbss-developer"
	})
	//CBSS::选择CBSS工号列表(发展人列表)
	.state("cbss-developers-list", {
		  templateUrl:"templates/daili/cbssDevelopersList.html"
		, url:"/cbss-developers-list"
		, controller:"cbss-developers-list"
	})
	//BSS::BSS工号列表
	.state("bss-account-list", {
		  templateUrl:"templates/daili/bssAccountList.html"
		, url:"/bss-account-list"
		, controller:"bss-account-list"
	})
	//BSS::修改BSS密码
	.state("change-bss-pwd", {
		  templateUrl:"templates/daili/changeBssPwd.html"
		, url:"/change-bss-pwd"
		, controller:"change-bss-pwd"
	})
	//BSS::BSS店铺列表
	.state("bss-shop-list", {
		  templateUrl:"templates/daili/bssShopList.html"
		, url:"/bss-shop-list"
		, controller:"bss-shop-list"
	})
	//BSS::添加BSS工号
	.state("add-bss-account", {
		  templateUrl:"templates/daili/addBssAccount.html"
		, url:"/add-bss-account"
		, controller:"add-bss-account"
	})
	//BSS::查询bss渠道
	.state("search-bss-channel", {
		  templateUrl:"templates/daili/searchBssChannel.html"
		, url:"/search-bss-channel"
		, controller:"search-bss-channel"
	})
	//BSS::bss渠道列表
	.state("bss-channel-list", {
		  templateUrl:"templates/daili/bssChannelList.html"
		, url:"/bss-channel-list"
		, controller:"bss-channel-list"
	})
	//BSS::选择BSS工号列表(发展人列表)
	.state("bss-developers-list", {
		  templateUrl:"templates/daili/bssDevelopersList.html"
		, url:"/bss-developers-list"
		, controller:"bss-developers-list"
	})
	


	//订单管理列表
	.state("order-manage-list", {
		  templateUrl:"templates/daili/orderManageList.html"
		, url:"/order-manage-list"
		, controller:"order-manage-list"
	})
	//店铺管理列表
	.state("dianpu-manage-list", {
		  templateUrl:"templates/daili/dianpuManageList.html"
		, url:"/dianpu-manage-list"
		, controller:"dianpu-manage-list"
	})
	//业务员管理列表
	.state("salesman-manage-list", {
		  templateUrl:"templates/daili/salesmanManageList.html"
		, url:"/salesman-manage-list"
		, controller:"salesman-manage-list"
	})
	//工号配置列表
	.state("jobnum-config-list", {
		  templateUrl:"templates/daili/jobnumConfigList.html"
		, url:"/jobnum-config-list"
		, controller:"jobnum-config-list"
	})
	//提现提示信息
	.state('aboutAccountFlow', {
	 	url: '/aboutAccountFlow',
	 	templateUrl: 'templates/daili/about-account-flow.html',
	 	controller: 'aboutAccountFlow'
	 })
	//固话订单
	.state('fixPhoneDaili', {
	 	url: '/fixPhoneDaili',
	 	templateUrl: 'templates/daili/fix-phone-daili.html',
	 	controller: 'fixPhoneDaili'
	 })
	//固话订单
	.state('fixPhoneDailiDetail', {
	 	url: '/fixPhoneDailiDetail',
	 	templateUrl: 'templates/daili/fix-phone-daili-detail.html',
	 	controller: 'fixPhoneDailiDetail'
	 })
	//用户信息（资料）
	.state("user-info", {
		  templateUrl:"templates/daili/userInfo.html"
		, url:"/user-info"
		, controller:"user-info"
	})
	//设置
	.state("user-set", {
		  templateUrl:"templates/daili/userSet.html"
		, url:"/user-set"
		, controller:"user-set"
	})
	//注册渠道信息
	.state("signup-channel", {
		  templateUrl:"templates/daili/signupChannel.html"
		, url:"/signup-channel"
		, controller:"signup-channel"
	})
	//巡店
	.state("shop-inspection", {
		  templateUrl:"templates/daili/shopInspection.html"
		, url:"/shop-inspection"
		, controller:"shop-inspection"
	})
	//巡店详情
	.state("shop-inspection-info", {
		  templateUrl:"templates/daili/shopInspectionInfo.html"
		, url:"/shop-inspection-info"
		, controller:"shop-inspection-info"
	})
	//巡店详情
	.state("shop-inspection-list", {
		  templateUrl:"templates/daili/shopInspectionList.html"
		, url:"/shop-inspection-list"
		, controller:"shop-inspection-list"
	})
	//添加巡店记录
	.state("add-shop-inspection-record", {
		  templateUrl:"templates/daili/addShopInspectionRecord.html"
		, url:"/add-shop-inspection-record"
		, controller:"add-shop-inspection-record"
	})
	//业务员持有卡
	.state("salesman-existing-card", {
		  templateUrl:"templates/daili/salesmanExistingCard.html"
		, url:"/salesman-existing-card"
		, controller:"salesman-existing-card"
	})
	//业务员发卡
	.state("salesman-send-card", {
		  templateUrl:"templates/daili/salesmanSendCard.html"
		, url:"/salesman-send-card"
		, controller:"salesman-send-card"
	})
	//机构管理
	.state("organization-manage", {
		  templateUrl:"templates/daili/organizationManage.html"
		, url:"/organization-manage"
		, controller:"organization-manage"
	})
	//机构管理号码订单
	.state("org-number-order-list", {
		  templateUrl:"templates/daili/orgNumberOrderList.html"
		, url:"/org-number-order-list"
		, controller:"org-number-order-list"
	})
	//机构管理宽带订单
	.state("org-Lan-order-list", {
		  templateUrl:"templates/daili/orgLanOrderList.html"
		, url:"/org-Lan-order-list"
		, controller:"org-Lan-order-list"
	})
	//机构添加业务员
	.state("org-add-salesman", {
		  templateUrl:"templates/daili/orgAddSalesman.html"
		, url:"/org-add-salesman"
		, controller:"org-add-salesman"
	})
	//b工号机构添加店铺
	.state("org-add-shop", {
		  templateUrl:"templates/daili/orgAddShop.html"
		, url:"/org-add-shop"
		, controller:"org-add-shop"
	})
	//机构管理首页业务员列表
	.state("daili-org-index-list", {
		  templateUrl:"templates/daili/org-index-list.html"
		, url:"/daili-org-index-list"
		, controller:"daili-org-index-list"
	})
	//机构管理店铺列表
	.state("daili-org-saleman-shop-list", {
		  templateUrl:"templates/daili/org-saleman-shop-list.html"
		, url:"/daili-org-saleman-shop-list/:levelCode/:deptCode"
		, controller:"daili-org-saleman-shop-list"
	})
	//机构管理店铺信息
	.state("daili-org-saleman-shop-info", {
		  templateUrl:"templates/daili/org-saleman-shop-info.html"
		, url:"/daili-org-saleman-shop-info"
		, controller:"daili-org-saleman-shop-info"
	})
	//机构管理订单详情
	.state("daili-org-shop-order-info", {
		  templateUrl:"templates/daili/org-shop-order-info.html"
		, url:"/daili-org-shop-order-info"
		, controller:"daili-org-shop-order-info"
	})
	//上传门头及营业执照
	.state("daili-addshop-upload-pic", {
		  templateUrl:"templates/daili/addshop-upload-pic.html"
		, url:"/daili-addshop-upload-pic/:userId"
		, controller:"daili-addshop-upload-pic"
	})
	//提现绑定银行卡
	.state("daili-bond-bank-card", {
		  templateUrl:"templates/daili/bond-bank-card.html"
		, url:"/daili-bond-bank-card"
		, controller:"daili-bond-bank-card"
	})
	//虚拟走账
	.state("daili-virtual-account", {
		  templateUrl:"templates/daili/virtual-account.html"
		, url:"/daili-virtual-account"
		, controller:"daili-virtual-account"
	})
	//虚拟充值界面
	.state("daili-virtual-recharge", {
		  templateUrl:"templates/daili/virtual-recharge.html"
		, url:"/daili-virtual-recharge/:userId"
		, controller:"daili-virtual-recharge"
	})
	//业务员派发佣金
	.state("daili-saleman-send-commission", {
		  templateUrl:"templates/daili/saleman-send-commission.html"
		, url:"/daili-saleman-send-commission"
		, controller:"daili-saleman-send-commission"
	})
	//店铺派发佣金
	.state("daili-dianpu-send-commission", {
		  templateUrl:"templates/daili/dianpu-send-commission.html"
		, url:"/daili-dianpu-send-commission"
		, controller:"daili-dianpu-send-commission"
	})
	//查看佣金记录
	.state("daili-obtain-commission-record", {
		  templateUrl:"templates/daili/obtain-commission-record.html"
		, url:"/daili-obtain-commission-record"
		, controller:"daili-obtain-commission-record"
	})

	//CBSS 验证码登录
		.state("daili-cbss-smscode-login", {
		  templateUrl:"templates/daili/cbssSmsCode/login.html"
		, url:"/daili-cbss-smscode-login"
		, controller:"daili-cbss-smscode-login"
	})

	//代理商统计
	//财务统计
	// .state("daili-financial-statistics", {
	// 	  templateUrl:"templates/daili/financialStatistics.html"
	// 	, url:"/daili-financial-statistics"
	// 	, controller:"daili-financial-statistics"
	// })
	// //产品统计
	// .state("daili-product-statistics", {
	// 	  templateUrl:"templates/daili/productStatistics.html"
	// 	, url:"/daili-product-statistics"
	// 	, controller:"daili-product-statistics"
	// })
	// //业务员统计
	// .state("daili-saleman-statistics", {
	// 	  templateUrl:"templates/daili/salemanStatistics.html"
	// 	, url:"/daili-saleman-statistics"
	// 	, controller:"daili-saleman-statistics"
	// })
	// //店面统计
	// .state("daili-shop-statistics", {
	// 	  templateUrl:"templates/daili/shopStatistics.html"
	// 	, url:"/daili-shop-statistics"
	// 	, controller:"daili-shop-statistics"
	// })

}
