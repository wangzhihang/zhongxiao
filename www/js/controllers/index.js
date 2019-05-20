appControllers.controller('index', function($scope, $state, $http,$stateParams,$rootScope, $ionicPopup, $filter, $timeout, my) {
	$scope.title = "联通"+appName;
	$scope.appFuncListShow = appFuncListShow;
	$scope.lanPreOrderList=[];
	$scope.numPreOrderList=[];
	$scope.picWallList=[];
	$scope.noticeList = [];
	$scope.allData=[];
	$scope.allDataSortDownByTime=[];
	$scope.localData=[];
	$scope.messagesArr=[];
	$scope.haomaMessages=[];
	$scope.haomaColor=false;
	$scope.lanColor=false;
	$scope.isNoShowMallOrder=false;
	$scope.isNoShowMallLading=false;
	$scope.isNoShowLanlOrder=false;
	$scope.isNoShowLanUser=false;
	$scope.ifShowShare=false;
	$scope.ifShowNews=false;
	$scope.ifShowNewOpen=true;
	$scope.ifShowNewsIcon=true;

	$scope.hasNews=true;

	$scope.accountType = localStorage.getItem('accountType');


	// 临时为三个工号添加 共享宽带
	$scope.wojiaGxkuandai = ["130360795", "122272862", "at5605293", "AT5605293"].indexOf(cbssInfo.username) !== -1;


	// 版本更新
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	$http({
		method:'get',
		url:ajaxurl + 'appVersion/queryAppVersionByAppName',
		params:{"appName":'zx_app', "appType":(isAndroid == true ? "android" : "ios")}
    }).success(function(data){
		var localVersion = localStorage.getItem("localVersion");
    	if(!(data.result.appVersion == version || data.result.appVersion == localVersion)){
    		if(data.result.status == "000002" || data.result.appLowVersion != localVersion){
    			my.alert(data.result.updateContent, "版本更新提示", "更新版本").then(function(){
					// $scope.upVersion(data.result)
    			})
    		}else{
				my.confirm(data.result.updateContent, "版本更新提示", "更新版本", "暂不更新").then(function(){
					$scope.upVersion(data.result)
    			}, function(){
					localStorage.setItem("localVersion", data.result.appVersion);
    			})
    		}
    	}
	})
	$scope.upVersion = function(data){
		my.loaddingShow('版本更新中');
		chcp.fetchUpdate(function(error) {
			if (error) {
				my.loaddingHide();
				return;
			}
			localStorage.setItem("localVersion", data.appVersion);
			chcp.installUpdate();
		}, {'config-file': data.url});
	}

	//只有渭南自有工号才显示分享注册
	if(agencyId=="26048"){
		$scope.ifShowShare=true;
	}
	
	//消息通知
	$scope.ifLookedNews=localStorage.getItem('ifLookedNews')//实际就是第一条消息的id
	$scope.judgeNews=localStorage.getItem('judgeNews');//判断是否进入过页面
	localStorage.removeItem("judgeNews");


//手动 看过并关闭消息
    $scope.lookedNews=function(){
		$scope.hasNews=false;
		localStorage.setItem('noticeListId',$scope.noticeListId)//保存当前显示的Id
	}

//对比是否是新消息
	$scope.contrastInfoId=function(){
		// console.log("当前展示消息Id===",$scope.oldnewsId);
		// console.log("所有消息列表第一项===",noticeList[0].id);
		// console.log("看过展示消息了===",localStorage.getItem('readedNews'));
		if(noticeList && noticeList[0] && noticeList[0].id){
				if(noticeList[0].id ==  localStorage.getItem('noticeListId')){
    				$scope.hasNews=false;
    			}else{
    				$scope.hasNews=true;
					$scope.noticeListTitle=noticeList[0].title;
					$scope.noticeListId=noticeList[0].id;
				}
		}
	}
    $scope.contrastInfoId();

// 根据消息Id获取消息详情
	$scope.getNewsData=function(){
        $http({
            method: 'GET',
            url: ajaxurl + "baseApp/queryNoticeInfoById?token=" + $rootScope.token,
            params: {"id": noticeList[0].id}
        }).success(function(data){
            // console.log("xiangqing===",JSON.stringify(data));
            $scope.noticeListContent=data.content;
        }).error(function () {
        });
    }
    $scope.getNewsData();


    $scope.timer=$timeout(function(){
		$scope.ifShowNews=false;
		$scope.ifShowNewOpen=true;
	},6000);
	$scope.newInform = function(){
		$state.go("news-list");

	}
	// $scope.enterNews=function(){
		// $state.go("news-inform",{"id":noticeList[0].id})
		// $state.go("news-list");
	// }

	//选择不同的商城订单
	for(var i in shopInfo.appFuncList){
		if(shopInfo.appFuncList[i].funcId==42){
			for(var j in shopInfo.appFuncList[i].appList){
				if(shopInfo.appFuncList[i].appList[j].funcId==43){
					$scope.isNoShowMallOrder=true;
				}
				if(shopInfo.appFuncList[i].appList[j].funcId==44){
					$scope.isNoShowMallLading=true;
				}
				if(shopInfo.appFuncList[i].appList[j].funcId==49){
					$scope.isNoShowLanOrder=true;
				}
				if(shopInfo.appFuncList[i].appList[j].funcId==50){
					$scope.isNoShowLanUser=true;
				}
			}
		}
	}
	//图片轮播
	$scope.autoPlay=function(){
		$scope.swiper =new Swiper('.swiper-container', {
	        pagination: '.swiper-pagination',
	        nextButton: '.swiper-button-next',
	        prevButton: '.swiper-button-prev',
	        paginationClickable: true,
	        spaceBetween: 30,
	        centeredSlides: true,
	        autoplay: 2500,
	        autoplayDisableOnInteraction: false
	    }); 
	}
	$scope.autoPlay();


		$scope.getInformationList = function (){
			$http({
			method:'get',
			url:ajaxurl + 'userApp/queryUserMessageCenter?token=' + $rootScope.token,
			params:{type:'000000'}
		}).success(function(data){
			//console.log("0000==="+JSON.stringify(data));
			$scope.msgList=data.msgList;
			// console.log("1111xiaoxi111=",$scope.msgList);
			for(var i in $scope.msgList){
				if($scope.msgList.length >= 1){
					//console.log($scope.msgList[i].type);
					if($scope.msgList[i].type=='000001'||$scope.msgList[i].type=='000002'||$scope.msgList[i].type=='000003'){
						$scope.noticeList.push({
							'id':$scope.msgList[i].id,
							'orderCode':$scope.msgList[i].orderCode,
							'showTag':$scope.msgList[i].userId,
							'message':$scope.msgList[i].message,
							'updateTime':$scope.msgList[i].updateTime,
							'type':$scope.msgList[i].type,
							'imgUrl':'img/xtxx.png',
							'textType':'系统消息',
							'messagesArr1':$scope.msgList[i].message
					    });
					}
					if($scope.msgList[i].type=='000004'){
						//console.log($scope.msgList[i]);
						$scope.message=$scope.msgList[i].message;
					    $scope.messagesSplitArr=$scope.message.split("号码");
					    //console.log($scope.messagesSplitArr);
					    $scope.haomaText='号码';
					    $scope.haomaColor=true;
					    $scope.lanColor=false;
					    // $scope.haomaText= rustAsHtml("<span style='color:#1E82D2;'>号码</span>");
					    $scope.messagesArr=[$scope.messagesSplitArr[0],$scope.haomaText,$scope.messagesSplitArr[1]];
					    $scope.haomaMessages=$scope.messagesArr.join("");
					    //console.log("$scope.haomaMessages=="+$scope.haomaMessages);
						$scope.noticeList.push({
							'id':$scope.msgList[i].id,
							'orderCode':$scope.msgList[i].orderCode,
							'showTag':$scope.msgList[i].userId,
							'message':$scope.haomaMessages,
							'updateTime':$scope.msgList[i].updateTime,
							'type':$scope.msgList[i].type,
							'imgUrl':'img/wxdd.png',
							'textType':'微信号码订单',
							'haomaText':$scope.haomaText,
							'messagesArr0':$scope.messagesSplitArr[0],
							'messagesArr1':$scope.messagesSplitArr[1],
							'haomaColor':$scope.haomaColor,
							'lanColor':$scope.lanColor
					    });
					    //console.log("号码   "+JSON.stringify($scope.noticeList));
					}
					if($scope.msgList[i].type=='000005'){
						//console.log($scope.msgList[i]);
						$scope.message=$scope.msgList[i].message;
					    $scope.messagesSplitArr=$scope.message.split("宽带");
					    $scope.haomaText='宽带';
					    $scope.haomaColor=false;
					    $scope.lanColor=true;
					    //$scope.haomaText= rustAsHtml("<span style='color:#ff5800;'>宽带</span>");
					    $scope.messagesArr=[$scope.messagesSplitArr[0],$scope.haomaText,$scope.messagesSplitArr[1]];
					    $scope.haomaMessages=$scope.messagesArr.join("");
						$scope.noticeList.push({
							'id':$scope.msgList[i].id,
							'orderCode':$scope.msgList[i].orderCode,
							'showTag':$scope.msgList[i].userId,
							'message':$scope.haomaMessages,
							'updateTime':$scope.msgList[i].updateTime,
							'type':$scope.msgList[i].type,
							'imgUrl':'img/wxdd.png',
							'textType':'微信宽带订单',
							'haomaText':$scope.haomaText,
							'messagesArr0':$scope.messagesSplitArr[0],
							'messagesArr1':$scope.messagesSplitArr[1],
							'haomaColor':$scope.haomaColor,
							'lanColor':$scope.lanColor
					    });
					    //console.log("宽带   "+JSON.stringify($scope.noticeList));
					}
					if($scope.msgList[i].type=='000006'){
						//console.log($scope.msgList[i]);
						$scope.noticeList.push({
							'id':$scope.msgList[i].id,
							'orderCode':$scope.msgList[i].orderCode,
							'showTag':$scope.msgList[i].userId,
							'messagesArr1':$scope.msgList[i].message,
							'updateTime':$scope.msgList[i].updateTime,
							'type':$scope.msgList[i].type,
							'imgUrl':'img/zpbl.png',
							'textType':'照片审核',
					    });

					}
				}
			}
			// console.log("noticeListxiaoxi===",$scope.noticeList);
			// console.log("msgListxiaoxi===",$scope.msgList);
		})
		}
		$scope.getInformationList();
	
	//下拉刷新
	$scope.doRefresh = function() {
		$scope.noticeList=[];
		$scope.hotSection=true;
		$scope.businessSection=true;
		$scope.tag.current = 1;
		$scope.netSection=false;
		$scope.shopSection=false;
		$scope.maintainSection=false;
		$scope.getInformationList();
		$timeout(function() {
			$scope.$broadcast('scroll.refreshComplete');
		}, 3000);
	}
	//停止刷新
	function endRefreshAction() {  
		$scope.$broadcast('scroll.refreshComplete');
	}
	//点击叉号隐藏
	/*$scope.cancel=function(id,showTag,index){
		localStorage.setItem("showTag","000002");
		$scope.allData[index].showTag = "000002";
		//console.log(localStorage.getItem("showTag"));
		//console.log($scope.allDataSortDownByTime);	
	}*/
	//删除列表信息
	$scope.deleteList=function(index){
		$scope.id=$scope.noticeList[index].id;
		//console.log($scope.id);
		var myPopup = $ionicPopup.show({
			title: '提示信息',
			template: '确定删除该条消息？',
			buttons:[
			{text:'取消'},
			{
				text:'<b>确定</b>',
				type:'button-positive',
				onTap:function(){
					$http({
						method:'GET',
						url:ajaxurl + '/userApp/delMessage?token=' + $rootScope.token,
						params:{msgId:$scope.id}
					}).success(function(data){
						$scope.noticeList[index].type='000010';
					});
				}
			},
			]
		});
	}
	//查看订单详情
	$scope.numberOrderDetail = function(orderCode,type,index) {
		order["orderCode"] = arguments[0];
		//console.log(arguments[1]);
		if(arguments[1]=='000001'){
			order["orderCode"] = arguments[0];
			$state.go("numberOrderDetail");
		}else if(arguments[1]=='000002'){
			order["orderCode"] = arguments[0];
			$state.go("kdOrderDetail");
		}else if(arguments[1]=='000006'){
			order["orderCode"] = arguments[0];
			$state.go("numberOrderDetail");
		}else if(arguments[1]=='000004'){
			order["orderCode"] = arguments[0];
			$state.go("dianpu-wx-order-detail");
		}else if(arguments[1]=='000005'){
			order["orderCode"] = arguments[0];
			// console.log(arguments[0]);
			$state.go("dianpu-wx-lan-order-detail");
		}else if(arguments[1]=='000003'){
			order["orderCode"] = arguments[0];
			$state.go("fixPhoneDetail");
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

	/*-子页面-----------------------------------------------------*/

	$scope.dianpuBssList = function(){
		$state.go('dianpu-bss-list');
		
	}
	$scope.dianpuCbssList = function(){
		$scope.accountBalance('dianpu-cbss-list');
	}
	$scope.dianpuKdList = function(){
		$scope.accountBalance('dianpu-kd-list');
	}


	$scope.dianpuJikeBSSList = function(){	
		$state.go('bussniess-type');;
	}
	$scope.dianpuJiKeCBSSList = function(){	
		$state.go('bussniess-type');;
	}





	$scope.dianpuInterDrainage = function(){	
		$state.go('bussniess-type',{tag:3});;
	}
	$scope.dianpuShopDrainage = function(){	
		$state.go('bussniess-type',{tag:4});;
	}
	$scope.dianoCustom = function(){	
		$state.go('bussniess-type',{tag:5});;
	}

	$scope.dianpuToMore = function(){
		$state.go('bussniess-type',{tag:1});
	}


	//判断是否显示抢单功能
	// $http({
	// 	method:'GET',
	// 	url:ajaxurl + 'unicomShareApp/validateIsShowGrab?token=' + $rootScope.token,
	// }).success(function(data){
	// 	if(data.status=="000001"){
	// 		$scope.isNoShowgrap=true;
	// 	}else{
	// 		if(userBo.userId==48){
	// 			$scope.isNoShowgrap=true;
	// 		}else{
	// 			$scope.isNoShowgrap=false;
	// 		}
	// 	}
	// })


	$scope.childTitle = $stateParams.pageTitle;

	if($scope.childTitle == undefined){
		// 订单滚动显示
		$scope.newOrderList = [];
		$scope.orderListI = 0;
		$scope.orderListLength = 0;
		$scope.newOrderFact = {};
		$scope.showAnimate = false;
		$http({
			method:'get',
			url:ajaxurl + 'orderPushApp/queryPushOrder?token=' + $rootScope.token
		}).success(function (data){
			$scope.loadingInfo = true;
			$scope.showAnimate = true;
			for(var i = 0;i < data['list'].length;i++){
				$scope.newOrderList.push(data['list'][i]);
				if(data['list'][i].orderType == '000001'){
					$scope.newOrderList[i].orderType = '号码办理';
					$scope.newOrderList[i].showInfo = $filter('hideCode')(data['list'][i].number,'3,4,5,6');
				}else if(data['list'][i].orderType == '000002'){
					$scope.newOrderList[i].orderType = '宽带业务';
					$scope.newOrderList[i].showInfo = $filter('cut')(data['list'][i].productName,true,8,'...');;
				}else if(data['list'][i].orderType == '000003'){
					$scope.newOrderList[i].orderType = '固话订单';
					$scope.newOrderList[i].showInfo = $filter('hideCode')(data['list'][i].number,'3,4,5,6');
				}
				//订单状态
				if(data['list'][i].status == '000003'){
					$scope.newOrderList[i].status = '成功办理';
				}else{
					$scope.newOrderList[i].status = '正在办理';
				}
			}
			$scope.orderListLength = $scope.newOrderList.length;
			$scope.nextFact();
		});

		$scope.nextFact = function(){
			$scope.newOrderFact = $scope.newOrderList[$scope.orderListI];
			$scope.orderListI++;
			if($scope.orderListI >= $scope.orderListLength){
				$scope.orderListI = 0;
			}
			$timeout(function () {
				$scope.nextFact()
			}, 5 * 1000);
		}
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


	/*-CBSS-----------------------------------------------------*/


	// 跳过选套餐这一步
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
		JumpHalfPackage = {"id":arguments[0]};
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

	// cbss 白卡
	$scope.cBSSOrder = function(){
		reset_dianpu_cbss(arguments[0]);
		order_type = "kaika";
		app = "dianpu";
		service_type = "telSelectCBSS";
		number_pool = "CBSS";
		source = "000004";
		sourceName = "CBSS选号";
		dianpu_order_amount = null;
		$scope.accountBalance("number-list");
		//$state.go("number-list");
	}
	//
	$scope.CbssShangshi = function(){
		reset_dianpu_cbss();
		order_type = "kaika";
		app = "dianpu";
		service_type = "telSelectCBSS";
		number_pool = "CBSS";
		source = "000004";
		sourceName = "CBSS选号";
		dianpu_order_amount = null;
		changshiProduct = true;
		//$scope.accountBalance("number-list","");
		$state.go("number-list");
	}

	// cbss半成卡
	$scope.cbssSemiManufactures = function(){
		reset_dianpu_cbss();
		order_type = "kaika";
		app = "dianpu";
		service_type = "cbssSemiManufactures";
		number_pool = "CBSS";
		source = "000019";
		sourceName = "CBSS半成卡";
		dianpu_order_amount = null;
		$scope.accountBalance("dianpu-semiManufactures-sim");
		//tate.go("number-list");
	}

	// 购机赠费
	$scope.cbssPhoneGiveFee = function(){
		reset_dianpu_cbss(arguments[0]);
		order_type = "kaika";
		app = "dianpu";
		service_type = "cbssPhoneGiveFee";
		number_pool = "CBSS";
		source = "000011";
		sourceName = "购机赠费";
		dianpu_order_amount = null;
		//$scope.accountBalance("number-list","");
		$state.go("number-list");
	}
	var huabeiKt = ["7100000","7140000","7230000","7270000","7120000","7250000","7190000"];
	huabeiKt.push("4300000");
	$scope.cbssPhoneGiveFee_huabei = function(){
		if(huabeiKt.indexOf(shopInfo.shopBo.city) !== -1){
			reset_dianpu_cbss(arguments[0]);
			cbss_huabei = 1;
			order_type = "kaika";
			app = "dianpu";
			service_type = "cbssPhoneGiveFee";
			number_pool = "CBSS";
			source = "000111";
			sourceName = "购机赠费";
			dianpu_order_amount = null;
			$state.go("number-list");
		}else{
			my.alert("此地区尚未开通，有需求请向当地联通公司申请");
		}
	}

	$scope.cbssPhoneGiveFee_huabei_old = function(){
		if(huabeiKt.indexOf(shopInfo.shopBo.city) !== -1){
			reset_dianpu_cbss(arguments[0]);
			cbss_huabei = 1;
			order_type = "kaika";
			app = "dianpu";
			service_type = "cbssPhoneGiveFee";
			number_pool = "CBSS";
			source = "000112";
			sourceName = "购机赠费";
			dianpu_order_amount = null;
			$state.go("dianpu-cbss-oldUserInfo");
		}else{
			my.alert("此地区尚未开通，有需求请向当地联通公司申请");
		}
	}

	// cbss成卡返单
	$scope.cbssDealerreturn = function(){
		reset_dianpu_cbss();
		order_type = "kaika";
		app = "dianpu";
		service_type = "cbssDealerreturn";
		number_pool = "CBSS";
		source = "000018";
		sourceName = "CBSS成卡";
		dianpu_order_amount = null;
		$scope.accountBalance("dianpu-cbss-dealerreturn");
		//$state.go("dianpu-cbss-dealerreturn");
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


	/*-宽带-----------------------------------------------------*/

	$scope.combination = function(){
		
		empty_filterSelect();
		filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = false;	// 判断是不是共享套餐
		wojiaRootProductId = arguments[0] ? arguments[0] : "89706086";
		KuandaiMainProductName = "沃家组合";
		service_type = "wojia-combination";
		kuandai_number_into = true;
		reelectNumber = 0;
		$scope.accountBalance("kuandai-wojia-address-area");

	}
	$scope.combination56 = function(){
		empty_filterSelect();
		filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = false;	// 判断是不是共享套餐
		wojiaRootProductId = "89706086";
		KuandaiMainProductName = "沃家组合(56)";
		service_type = "wojia-combination-56";
		kuandai_number_into = false;
		reelectNumber = 0;
		kuandai_number_info = {
			"productId":"90339638",
			"activityProductId":"90274159"
		}
		$scope.accountBalance("kuandai-wojia-address-area");
	}
	$scope.combination56_old = function(){
		empty_filterSelect();
		filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = false;	// 判断是不是共享套餐
		wojiaRootProductId = "89706086";
		KuandaiMainProductName = "沃家组合(56)";
		service_type = "wojia-combination-56";
		kuandai_number_into = false;
		reelectNumber = 0;
		kuandai_number_info = {
			"productId":"90166583",
			"activityProductId":"90274159"
		}
		$scope.accountBalance("kuandai-wojia-address-area");
	}
	
	$scope.combination88 = function(){
		empty_filterSelect();
		filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = false;	// 判断是不是共享套餐
		wojiaRootProductId = "89706086";
		KuandaiMainProductName = "沃家组合(88)";
		service_type = "wojia-combination-88";
		kuandai_number_into = false;
		reelectNumber = 0;
		kuandai_number_info = {
			"productId":"90269989",
			"activityProductId":"90274159"
		}
		$scope.accountBalance("kuandai-wojia-address-area");
	}
	$scope.combination88b = function(){
		empty_filterSelect();
		filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = false;	// 判断是不是共享套餐
		wojiaRootProductId = "89706086";
		KuandaiMainProductName = "沃家组合(88-特定终端)";
		service_type = "wojia-combination-88b";
		kuandai_number_into = false;
		reelectNumber = 0;
		kuandai_number_info = {
			"productId":"90270007"
			// , "activityProductId":"90274159"
		}
		$scope.accountBalance("kuandai-wojia-address-area");
	}

	$scope.wojia = function(){
		wojiaProduct = arguments[0] ? arguments[0] : {"wojiaRootProductId":"89017299", "wojiaflowProductId":"51018053", "LanList":["90045429", "90045817"], "ITVpackageID":"89003362"}
		empty_filterSelect();
		filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = true;
		wojiaRootProductId = wojiaProduct["wojiaRootProductId"];	// 主套餐
		wojiaflowProductId = wojiaProduct["wojiaflowProductId"];	// 主资费包
		KuandaiMainProductName = "沃家共享";
		service_type = "wojia-ronghe";
		kuandai_number_into = true;
		reelectNumber = 0;
		$scope.accountBalance("kuandai-wojia-address-area");
	}


	$scope.wojiaShareSuburb = function(){
		wojiaProduct = arguments[0] ? arguments[0] : {"wojiaRootProductId":"89248286", "wojiaflowProductId":"51221004", "LanList":["90360152"], "ITVpackageID":"89003362"}
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

	// $scope.bssLan = function(){
	// 	reset_kuandai_bssLan();
	// 	order_type = "kuandai";
	// 	app = "kuandai";
	// 	number_pool = "BSS";
	// 	service_type = "bssLan";
	// 	KuandaiMainProductName = "BSS单宽";
	// 	reelectNumber = 0;
	// 	$scope.accountBalance("kuandai-bss-lan-address-area");
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


	// 集客
	// cbss
	$scope.jikeCbssOrder = function(){
		app = "jike";
		order_type = "kaika";
		empty_filterSelect();
		number_pool = "CBSS";
		service_type = "groupCbssNumber";
		source = "000007";
		reset_dianpu_cbss();
		reset_authentication();
		reset_telInfo();
		$state.go("number-list");
	}
	$scope.jikegroupCbssEnterprise = function(){
		app = "jike";
		order_type = "kaika";
		empty_filterSelect();
		number_pool = "CBSS";
		service_type = "groupCbssEnterprise";
		source = "000024";
		reset_dianpu_cbss();
		reset_authentication();
		reset_telInfo();
		$state.go("number-list");
	}
	// bss
	$scope.jikeBssNumber = function(){
		app = "jike";
		order_type = "kaika";
		empty_filterSelect();
		reset_authentication();
		reset_telInfo();
		number_pool = "BSS";
		service_type = "schoolBssNumber";
		source = "000010";
		$state.go("number-list");
	}
	$scope.jikegroupBssEnterprise = function(){
		app = "jike";
		order_type = "kaika";
		empty_filterSelect();
		reset_authentication();
		reset_telInfo();
		number_pool = "BSS";
		service_type = "groupBssEnterprise";
		source = "000010";
		bss_enterpriseInfo = {};
		$state.go("number-list");
	}
	// 固带移预制卡
	$scope.jikeLanBss = function(){
		app = "jike";
		order_type = "kaika";
		empty_filterSelect();
		reset_authentication();
		reset_telInfo();
		number_pool = "BSS";
		service_type = "groupLanBss";
		source = "000009";
		$state.go("group-lan-bss-getLanaccount");
	}


	// 存量续费类型
	$scope.assertUserType = function(e){
		assertUserType = e;
		$state.go('assert-user');
	}

	$scope.xiehaoruwang = function(e){
		my.alert("此地区暂未开通，敬请期待!");
	}

	//查看套餐详情
	$scope.ComboInfoUrl=function(url){
		$state.go("dianpu-combo-info",{url:url});
	}

	//首页动态滚动
	$scope.hotSection=true;
	$scope.businessSection=true;
	$scope.netSection=false;
	$scope.shopSection=false;
	$scope.maintainSection=false;
	$scope.tag={
		current:1
	}
	if(localStorage.getItem('indexTag')){
		$scope.indexTag=JSON.parse(localStorage.getItem('indexTag'));
		$scope.businessSection=false;
		$scope.tag.current=$scope.indexTag.showSection;
		if($scope.indexTag.businessSection){
			$scope.businessSection=$scope.indexTag.businessSection;
		}
		if($scope.indexTag.netSection){
			$scope.netSection=$scope.indexTag.netSection;
		}
		if($scope.indexTag.shopSection){
			$scope.shopSection=$scope.indexTag.shopSection;
		}
		if($scope.indexTag.maintainSection){
			$scope.maintainSection=$scope.indexTag.maintainSection;
		}
	}
	
	$scope.scrollBusinessArea=function(param){
		$scope.tag.current = param;
		$scope.hotSection=false;
		$scope.businessSection=true;
		$scope.netSection=false;
		$scope.shopSection=false;
		$scope.maintainSection=false;
		localStorage.setItem('indexTag',JSON.stringify({
			'showSection':param,
			'businessSection':true
		}));
	}
	$scope.scrollNetArea=function(param){
		$scope.tag.current = param;
		$scope.hotSection=false;
		$scope.businessSection=false;
		$scope.netSection=true;
		$scope.shopSection=false;
		$scope.maintainSection=false;
		localStorage.setItem('indexTag',JSON.stringify({
			showSection:param,
			'netSection':true
		}));
	}
	$scope.scrollShopArea=function(param){
		$scope.tag.current = param;
		$scope.hotSection=false;
		$scope.businessSection=false;
		$scope.netSection=false;
		$scope.shopSection=true;
		$scope.maintainSection=false;
		localStorage.setItem('indexTag',JSON.stringify({
			showSection:param,
			'shopSection':true
		}));
	}
	$scope.scrollMaintainArea=function(param){
		$scope.tag.current = param;
		$scope.hotSection=false;
		$scope.businessSection=false;
		$scope.netSection=false;
		$scope.shopSection=false;
		$scope.maintainSection=true;
		localStorage.setItem('indexTag',JSON.stringify({
			showSection:param,
			'maintainSection':true
		}));
	}


	//热门套餐的点击
	// $scope.hotComboList = [];
	// for(var i in appFuncListRx){
	// 	$scope.hotComboList.push(appFuncListRx[i]);
	// }
	// $http({
	// 	method:'get',
	// 	url:ajaxurl + 'numbercontract/queryHotProduct?token=' + $rootScope.token
	// }).success(function(data){
	// 	if(data.list.length>=0){
	// 		$scope.isShowHotCombo=true;
	// 		for(var k in data.list){
	// 			$scope.hotComboList.push(JSON.parse(data.list[k].remark))
	// 		}
	// 	}
	// })
	$scope.hotComboInfo=function(data){
		console.log(data);
		if(data.fun){
			$scope[data.fun](data);
		}else{
			$state.go(data.url);
		}
	}
	$scope.hotCombo99=function(){
		var id = ""
		for(var i in cbss_packageList){
			if(cbss_packageList[i].productNum == "90356341"){
				id = cbss_packageList[i].id;
			}
		}
		if(id == ""){
			my.alert("获取套餐失败，请重试!")
		}else{
			$scope.cbssJumpHalfPackage(id)
		}

	}
	$scope.queryCommissionRelList = function(){
		$http({
			method: 'GET',
			url: ajaxurl + 'commission/queryCommissionRelList',
			params:{
				"token":$rootScope.token,
				"source":"000001"
			}
		}).success(function(data){
			if(data.data && data.data.length){
				for(var i in data.data){
					var temp = data.data[i];
					temp["productId"] = temp["productNum"];
					temp["productName"] = temp["productAlias"] ? temp["productAlias"] : temp["productName"]
					cbss_packageList.push(temp);
				}
			}
		});
	}
	if(!cbss_packageList.length){
		$scope.queryCommissionRelList();
	}
});
