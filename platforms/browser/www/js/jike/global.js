
	// 学校
var school = {
		"groupid":"",
		"groupname":"",
		"productid":""
	},

	// 校园活动
	schoolActivity = {"tel":"","type":""},

	// 固带移卡
	groupLanBss = {

		  "groupkeyword":""
		, "groupId":""
		, "groupName":""
		, "userRole":"0"	// 业务群(0:无客户群)

		, "lanaccount":""		// 手机号
		, "productCode":""		// 产品编码
		, "productName":""

		
		, "dealerkeyword": "" 	//查询发展人关键字 和getDealerList保持一致
		, "dealerCode":"" 		//发展人编号 选出来的，不是系统自带的
		, "dealerName":"" 		//发展人姓名
		, "dealerUserCode":"" 	//发展人用户编码
		, "payMoney":"" 		//储值金额

		, "groupSubmitId":""	// 第一步提交时返回的data
	},

	// 学校 固带移卡
	schoolLanBss = {

		  "groupkeyword":""
		, "groupId":""
		, "groupName":""
		, "userRole":"0"	// 业务群(0:无客户群)

		, "lanaccount":""		// 手机号
		, "productCode":""		// 产品编码
		, "productName":""

		
		, "dealerkeyword": "" 	//查询发展人关键字 和getDealerList保持一致
		, "dealerCode":"" 		//发展人编号 选出来的，不是系统自带的
		, "dealerName":"" 		//发展人姓名
		, "dealerUserCode":"" 	//发展人用户编码
		, "payMoney":"" 		//储值金额

		, "groupSubmitId":""	// 第一步提交时返回的data
	},


	// group 套餐
	group = {
		  "groupId":""
		, "productUserId":""
		, "groupProductId":""
		, "groupName":""
		, "groupCustId":""
		, "packageService":{}
		, "packageActivity":{}
		, "PackageBo":{}
		, "productObj":{}
	},

	// bss 预登陆返单+活动
	dealerreturn2activity = {
		  "productCode":""
		, "productName":""
		, "activityId":""
	}

	, submitFee = ""
	, bss_enterpriseInfo = {}
;
reset_dianpu_cbss();






// 集客CBSS开卡(选号)
jump["groupCbssNumber"]={
	  "number-list":"group-querygrouplist"
	, "authentication":"jike-group-write-sim"
	, "signature":"jike-group-write-sim-submit"
};
// 集客固态移卡(预制卡)
jump["groupLanBss"]={
	  "authentication":"group-lan-bss-confirm"
	, "signature":"group-lan-bss-submit"

};
// 校园BSS选号
jump["schoolBssNumber"]={
	  "number-list":"school-package"
	, "authentication":"school-writesim"
	, "signature":"school-writesim-submit"
};
//CBSS 对公开户
jump["groupCbssEnterprise"]={
	  "number-list":"group-getGroupListByCode"
	, "authentication":"jike-group-write-sim"
	, "signature":"jike-group-write-sim-submit"
};
// BSS 对公开户
jump["groupBssEnterprise"]={
	  "number-list":"school-package"
	, "authentication":"school-writesim"
	, "signature":"school-writesim-submit"
};
// 固态移卡(选号)
// jump["groupLanBssSelectNumber"]={
// 	  "number-list":"school-package"
// 	, "authentication":"group-lan-bss-confirm"
// 	, "signature":"group-lan-bss-submit"
// };
// 集客CBSS半成卡
// jump["groupCbssSemiManufactures"]={
// 	  "number-list":"group-querygrouplist"
// 	, "authentication":"group-write-sim"
// 	, "signature":"group-write-sim-submit"
// };
// 集客顺丰定制版(半成卡)
// jump["groupSfCbssSemiManufactures"]={
// 	  "number-list":"group-queryproductbygroupid"
// 	, "authentication":"group-write-sim"
// 	, "signature":"group-write-sim-submit"
// };

// 公安定制版(选号)
// jump["policeLanBss"]={
// 	"authentication":"group-lan-bss-submit"
// };
// jump["policeDealerreturnActivity"]={
// 	  "authentication":"bss-dealerreturn-activity-confirm"
// 	, "signature":"bss-dealerreturn-activity-submit"
// };


// jump["zhuNongKaBssNumber"]={
// 	  "number-list":"school-package"
// 	, "authentication":"school-writesim"
// 	, "signature":"school-writesim-submit"
// };