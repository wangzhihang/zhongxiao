function jikeState(_this) {

	_this
	
	.state('bss-getEnterpriseInfo', {
		url: '/bss-getEnterpriseInfo',
		templateUrl: 'templates/jike/bss/school/EnterpriseInfo.html',
		controller: 'bss-getEnterpriseInfo'
	})
	.state('school-querygrouplist', {
		url: '/school-querygrouplist',
		templateUrl: 'templates/jike/bss/school/selectNumber/querylist.html',
		controller: 'school-querygrouplist'
	})
	.state('school-package', {
		url: '/school-package',
		templateUrl: 'templates/jike/bss/package.html',
		controller: 'school-package'
	})
	.state('school-querydealer', {
		url: '/school-querydealer',
		templateUrl: 'templates/jike/bss/01querydealer.html',
		controller: 'school-querydealer'
	})
	.state('school-querydevelopcode', {
		url: '/school-querydevelopcode',
		templateUrl: 'templates/jike/bss/02querydevelopcode.html',
		controller: 'school-querydevelopcode'
	})
	.state('school-queryareatown', {
		url: '/school-queryareatown',
		templateUrl: 'templates/jike/bss/03queryareatown.html',
		controller: 'school-queryareatown'
	})
	.state('school-writesim', {
		url: '/school-writesim',
		templateUrl: 'templates/jike/bss/writesim.html',
		controller: 'school-writesim'
	})
	.state('school-writesim-submit', {
		url: '/school-writesim-submit',
		templateUrl: 'templates/jike/bss/writesim-submit.html',
		controller: 'school-writesim-submit'
	})



	// 集团用户
	.state('group-querygrouplist', {
		url: '/group-querygrouplist',
		templateUrl: 'templates/jike/cbss/01querygrouplist.html',
		controller: 'group-querygrouplist'
	})
	.state('group-querygroupproductlist', {
		url: '/group-querygroupproductlist',
		templateUrl: 'templates/jike/cbss/02querygroupproductlist.html',
		controller: 'group-querygroupproductlist'
	})
	.state('group-queryproductbygroupid', {
		url: '/group-queryproductbygroupid',
		templateUrl: 'templates/jike/cbss/03queryproductbygroupid.html',
		controller: 'group-queryproductbygroupid'
	})
	.state('jike-group-write-sim', {
		url: '/jike-group-write-sim',
		templateUrl: 'templates/jike/cbss/group-write-sim.html',
		controller: 'jike-group-write-sim'
	})
	.state('jike-group-write-sim-submit', {
		url: '/jike-group-write-sim-submit',
		templateUrl: 'templates/jike/cbss/group-write-sim-submit.html',
		controller: 'jike-group-write-sim-submit'
	})

	.state('jike-cbbs-package-result', {
		url: '/jike-cbbs-package-result',
		templateUrl: 'templates/dianpu/kaika/cbbs-package-result.html',
		controller: 'jike-cbbs-package-result'
	})
	// CBSS套餐附加商品
	.state('jike-cbbs-package-service', {
		url: '/jike-cbbs-package-service',
		templateUrl: 'templates/jike/cbss/cbbs-package-service.html',
		controller: 'jike-cbbs-package-service'
	})
	// CBSS套餐活动
	.state('jike-cbbs-package-activity', {
		url: '/jike-cbbs-package-activity',
		templateUrl: 'templates/dianpu/kaika/cbbs-package-activity.html',
		controller: 'jike-cbbs-package-activity'
	})

	// .state('pc-camera-ok', {
	// 	url: '/pc-camera-ok',
	// 	templateUrl: 'templates/authentication/pc/ok.html',
	// })

	// 对公 机构信息
	.state('group-getGroupListByCode', {
		url: '/group-getGroupListByCode',
		templateUrl: 'templates/jike/cbss/getGroupListByCode.html',
		controller: 'group-getGroupListByCode'
	})







	// 套餐Error: Could not resolve '' from state 'number-list'
	// .state('cbss-package-list', {
	// 	url: '/cbss-package-list',
	// 	templateUrl: 'templates/kaika/cbss-package.html',
	// 	controller: 'cbss-package-list'
	// })
	// 主套餐详情页面
	        




	// 套餐
	// .state('tel-package', {
	// 	url: '/tel-package',
	// 	templateUrl: 'templates/kaika/package.html',
	// 	controller: 'tel-package'
	// })
	// BSS 白卡&半成卡
	// .state('bss-write-sim-type', {
	// 	url: '/bss-write-sim-type',
	// 	templateUrl: 'templates/kaika/bss-write-sim-type.html',
	// 	controller: 'bss-write-sim-type'
	// })
	// BSS 白卡
	// .state('bss-write-sim', {
	// 	url: '/bss-write-sim',
	// 	templateUrl: 'templates/kaika/bss-write-sim.html',
	// 	controller: 'bss-write-sim'
	// })
	// BSS 半成卡
	// .state('bss-write-halfCard', {
	// 	url: '/bss-write-halfCard',
	// 	templateUrl: 'templates/kaika/bss-write-halfCard.html',
	// 	controller: 'bss-write-halfCard'
	// })




	//校园活动受理
	// .state('school-activity-bss-flash_getcustomerinfo', {
	//  	url: '/school-activity-bss-flash_getcustomerinfo',
	//  	templateUrl: 'templates/jike/school/activity/flash_getcustomerinfo.html',
	//  	controller: 'school-activity-bss-flash_getcustomerinfo'
	//  })
	// .state('school-activity-bss-flash_finishtrade', {
	//  	url: '/school-activity-bss-flash_finishtrade',
	//  	templateUrl: 'templates/jike/school/activity/flash_finishtrade.html',
	//  	controller: 'school-activity-bss-flash_finishtrade'
	//  })


	
	

	//固带移卡
	.state('group-lan-bss-getLanaccount', {
		url: '/group-lan-bss-getLanaccount',
		templateUrl: 'templates/jike/lan-bss/group-lan-bss-getLanaccount.html',
		controller: 'group-lan-bss-getLanaccount'
	})
	.state('group-lan-bss-getProductList', {
		url: '/group-lan-bss-getProductList',
		templateUrl: 'templates/jike/lan-bss/getProductList.html',
		controller: 'group-lan-bss-getProductList'
	})
	.state('group-lan-bss-getGroupList', {
		url: '/group-lan-bss-getGroupList',
		templateUrl: 'templates/jike/lan-bss/group-lan-bss-getGroupList.html',
		controller: 'group-lan-bss-getGroupList'
	})
	.state('group-lan-bss-getDealerList', {
		url: '/group-lan-bss-getDealerList',
		templateUrl: 'templates/jike/lan-bss/group-lan-bss-getDealerList.html',
		controller: 'group-lan-bss-getDealerList'
	})
	.state('group-lan-bss-confirm', {
		url: '/group-lan-bss-confirm',
		templateUrl: 'templates/jike/lan-bss/group-lan-bss-confirm.html',
		controller: 'group-lan-bss-confirm'
	})
	.state('group-lan-bss-submit', {
		url: '/group-lan-bss-submit',
		templateUrl: 'templates/jike/lan-bss/group-lan-bss-submit.html',
		controller: 'group-lan-bss-submit'
	})
	// .state('bsslan-signature', {
	// 	url: '/bsslan-signature',
	// 	templateUrl: 'templates/jike/signature.html',
	// 	controller:'bsslan-signature'
	// })

	//固带移卡
	// .state('school-lan-bss-getLanaccount', {
	// 	url: '/school-lan-bss-getLanaccount',
	// 	templateUrl: 'templates/jike/school/lan-bss/school-lan-bss-getLanaccount.html',
	// 	controller: 'school-lan-bss-getLanaccount'
	// })
	// .state('school-lan-bss-getProductList', {
	// 	url: '/school-lan-bss-getProductList',
	// 	templateUrl: 'templates/jike/school/lan-bss/getProductList.html',
	// 	controller: 'school-lan-bss-getProductList'
	// })
	// .state('school-lan-bss-getGroupList', {
	// 	url: '/school-lan-bss-getGroupList',
	// 	templateUrl: 'templates/jike/school/lan-bss/school-lan-bss-getGroupList.html',
	// 	controller: 'school-lan-bss-getGroupList'
	// })
	// .state('school-lan-bss-getDealerList', {
	// 	url: '/school-lan-bss-getDealerList',
	// 	templateUrl: 'templates/jike/school/lan-bss/school-lan-bss-getDealerList.html',
	// 	controller: 'school-lan-bss-getDealerList'
	// })

	// .state('school-lan-bss-submit', {
	// 	url: '/school-lan-bss-submit',
	// 	templateUrl: 'templates/jike/school/lan-bss/school-lan-bss-submit.html',
	// 	controller: 'school-lan-bss-submit'
	// })



	// 
	// .state('bss-dealerreturn-activity-tel', {
	// 	url: '/bss-dealerreturn-activity-tel',
	// 	templateUrl: 'templates/jike/bss/dealerreturn-activity/tel.html',
	// 	controller: 'bss-dealerreturn-activity-tel'
	// })
	// .state('bss-dealerreturn-activity-confirm', {
	// 	url: '/bss-dealerreturn-activity-confirm',
	// 	templateUrl: 'templates/jike/bss/dealerreturn-activity/confirm.html',
	// 	controller: 'bss-dealerreturn-activity-confirm'
	// })
	// .state('bss-dealerreturn-activity-submit', {
	// 	url: '/bss-dealerreturn-activity-submit',
	// 	templateUrl: 'templates/jike/bss/dealerreturn-activity/submit.html',
	// 	controller: 'bss-dealerreturn-activity-submit'
	// })
};