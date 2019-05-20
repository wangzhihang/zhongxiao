appControllers.controller('bussniess-type', function($scope,$http,$rootScope,$state,my,$stateParams) {
	

	$scope.title = '服务';
	$scope.appFuncListShow=appFuncListShow;
	$scope.current = $stateParams.tag ? $stateParams.tag : "1";

	if(localStorage.getItem('businessTag')){
		$scope.current = localStorage.getItem('businessTag')
	}

	$scope.setCurrent=function (param){
			$scope.current = param;
			localStorage.setItem('businessTag',param);
	}

  	

  	$scope.dianpuBssList = function(){
  		$state.go('dianpu-bss-list');
	}
	$scope.dianpuCbssList = function(){
		$scope.accountBalance('dianpu-cbss-list');
	}

	$scope.myWeiDianList = function(){
		$state.go('dianpu-my-shop');
	}

  // 存量续费类型
	$scope.assertUserType = function(e){
		assertUserType = e;
		$state.go('assert-user');
	}

// 商务座机
	$scope.bssPstnReturn = function(){
		reset_dianpu_bss();
		order_type = "pstn";
		app = "dianpu";
		service_type = "bssPstnReturn";
		number_pool = "BSS";
		source = "000006";
		sourceName = "商务座机";
		dianpu_order_amount = null;
		$state.go("dianpu-pstn-dealerreturn");
	}

	$scope.bssPstnReturn8 = function(){
		reset_dianpu_bss();
		order_type = "pstn";
		app = "dianpu";
		service_type = "bssPstnReturn8";
		number_pool = "BSS";
		source = "000006";
		sourceName = "商务座机";
		dianpu_order_amount = null;
		$state.go("dianpu-pstn-dealerreturn");
	}

	$scope.cbss_id_check = function(){
		service_type = "cbssIdCheck";
		$state.go("authentication-device");
	}

	$scope.weiDian = function(pageTitle){
		$state.go('dianpu-wei-dian', {pageTitle:'我的微店'});
	}
	// $scope.myCode = function(pageTitle){
	// 	$state.go('dianpu-my-code', {pageTitle:'我的二维码'});
	// }
	
	$scope.newBroadband = function(pageTitle){
		$state.go('dianpu-series-product', {pageType:'000001',category:"000002"});
	}

	$scope.giveBroadband = function(pageTitle){
		$state.go('dianpu-series-product', {pageType:'000002',category:"000002"});
	}

	$scope.iceCream = function(pageTitle){
		$state.go('dianpu-series-product', {pageType:'000001',category:"000001"});
	}

	$scope.combination = function(){
		empty_filterSelect();
		filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = false;	// 判断是不是共享套餐
		wojiaRootProductId = "89706086";
		KuandaiMainProductName = "沃家组合";
		service_type = "wojia-combination";
		kuandai_number_into = true;
		reelectNumber = 0;
		$scope.accountBalance("kuandai-wojia-address-area");
	}


	$scope.wojiaShareSuburb = function(){
		empty_filterSelect();
		filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = true;
		wojiaRootProductId = "89248286";
		wojiaflowProductId = "51221004";
		KuandaiMainProductName = "沃家共享郊县";
		service_type = "wojia-share-suburb";
		kuandai_number_into = true;
		reelectNumber = 0;
		$scope.accountBalance("kuandai-wojia-address-area");
	}

	$scope.bssLan = function(){
		reset_kuandai_bssLan();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "BSS";
		service_type = "bssLan";
		KuandaiMainProductName = "BSS单宽";
		reelectNumber = 0;
		$scope.accountBalance("kuandai-bss-lan-address-area");
	}
	// cbss副卡
	$scope.cbsszFuka = function(){
		reset_dianpu_cbss();
		order_type = "kaika";
		app = "dianpu";
		service_type = "cbssFuka";
		number_pool = "CBSS";
		source = "000004";
		sourceName = "CBSS副卡";
		dianpu_order_amount = null;
		$scope.accountBalance("number-list");
	}


	// $scope.cbssLan = function(){
	// 	reset_kuandai_wojia();
	// 	order_type = "kuandai";
	// 	app = "kuandai";
	// 	number_pool = "CBSS";
	// 	service_type = "cbssLan";
	// 	KuandaiMainProductName = "CBSS单宽";
	// 	$scope.accountBalance("kuandai-wojia-address-area");
	// }
	$scope.cbssLan = function(){
		reset_kuandai_wojia();
		kuandai_wk_isFixedLan = arguments[0] === true ?  true : false;
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		service_type = "cbssLan";
		KuandaiMainProductName = "CBSS单宽";
		if(arguments[0]){
			$scope.accountBalance("kuandai-cbss-SingleLan-wk");
		}else{
			$scope.accountBalance("kuandai-wojia-address-area");
		}
	}


	//判断账户余额
	$scope.accountBalance=function(url){
		if(userBo.testTag=="000001" && $scope.accountType=="000002"){
			if(shopInfo.shopBo.minBalance>shopInfo.shopBo.shopBalance){
				 my.alert('当前用户余额不足，请联系代理商进行充值').then(function(){ 
	                $state.go('index');
	                return;
	            }); 
			}
		}
		$state.go(url);
	}

	$scope.hotComboInfo=function(data){
		if(data.fun){
			$scope[data.fun](data);
		}else{
			$state.go(data.url);
		}
		// $scope[params.fun](params);
	}

	$scope.cbssJumpPackage = function(){
		reset_dianpu_cbss();
		$http({
			method:'get',
			url:'data/cbss/'+arguments[0].productId+'.json'
		}).success(function(data){
			dianpu_cbss_package_array = data;
			order_type = "kaika";
			GoodHaoma = false;
			app = "dianpu";
			service_type = "cbssJumpPackage";
			number_pool = "CBSS";
			source = "000004";
			sourceName = "CBSS选号";
			dianpu_order_amount = null;
			$scope.accountBalance("number-list");
		})
	}

	// 跳过选套餐这一步
	$scope.cbssJumpHalfPackage = function(){
		reset_dianpu_cbss();
		JumpHalfPackage = {"productId":arguments[0].productId, "productName":arguments[0].productName};
		order_type = "kaika";
		GoodHaoma = true;
		app = "dianpu";
		service_type = "cbssJumpHalfPackage";
		number_pool = "CBSS";
		source = "000004";
		sourceName = "CBSS选号";
		dianpu_order_amount = null;
		$scope.accountBalance("number-list");
	}



	//获取套餐信息
	$scope.getSeriesList=function(){
		$http({
			method:'get',
			url:ajaxurl +'ylShop/queryShopBrochuresInfo?token='+$rootScope.token,
			params:{userId:userBo.userId},
			// params:{userId:36291},
			timeout: 5000
		}).success(function(data){
			console.log("data--"+JSON.stringify(data));
				$scope.infoList = data.data;
				$scope.smallProgramImgList=data.data.smallProgramImgList;
		})
	}
	$scope.getSeriesList();


	// 查看对应宣传页

	$scope.ComboInfoUrl=function(e,imgId){
		// $scope.e = e;
		console.log("e===="+e)
		console.log("e.id===="+JSON.stringify($scope.smallProgramImgList[e]));
		localStorage.setItem('imgListId',$scope.smallProgramImgList[e].id);
		localStorage.setItem('imgListShortExplain',$scope.smallProgramImgList[e].shortExplain);
		localStorage.setItem('imgListProductName',$scope.smallProgramImgList[e].productName);
		localStorage.setItem('imgListPhoto',$scope.smallProgramImgList[e].photo);
		localStorage.setItem('imgListPageType',$scope.smallProgramImgList[e].pageType);
		$state.go("dianpu-combo-info");
	
	}

	//宽带跳转页，暂时只有渭南业务
	// $scope.broadband=function(){
	// 	window.location.href = "http://z.haoma.cn/tms-app-war/preOrderApp/toLanPrePage?username=a88";
	// }







});