appControllers.controller('dianpu-microshop-lan-order-detail', function($scope,$state,$rootScope, $http, $ionicPopup,$ionicLoading,my) {

	$scope.title = '预约订单详情';
	$scope.loading = false;
	$scope.orderInfo = {};
	$scope.telList = [];
	$scope.orderNumber = "";
	$scope.readMore = false;

	var orderStatus = {
		//  "000000":{"color":"txtOrange","text":"全部订单","btn":0},
		"000001":{"color":"goingStatus","text":"待处理","btn":0},
		"000002":{"color":"goingStatus","text":"地址预判成功,等待实名","btn":0},
		"000003":{"color":"otherStatus","text":"实名成功,等待开卡","btn":1},
		// ,"000004":{"color":"approveSucColor","text":"开卡成功,等待快递","btn":1},
		// ,"000005":{"color":"longNumColor","text":"快递中","btn":1},
		"000100":{"color":"otherStatus","text":"订单完成,未收费","btn":2},
		"000101":{"color":"finishStatus","text":"订单完成,已收费","btn":10},
		"000200":{"color":"unfinishedStatus","text":"订单失败","btn":10},
		"000201":{"color":"unfinishedStatus","text":"用户取消","btn":10},
	}

	//适配宽照片
    $scope.imgAdapt = function(imgSrc){
        var img = new Image(); 
        img.src =  imgSrc; 
        img.onload = function(){
            if(img.width > img.height){
                $scope.imgProp = {
                    'max-height': '27vw',
                    'height': '110px'
                }
            }
        }
    }

	$http({
		method: 'GET',
		url: ajaxurl + "lanPreorderApp/queryPreorderDetailByOrderCode?token=" + $rootScope.token,
		params: {"orderCode":order["orderCode"]}
	}).success(function(data){
		$scope.loading = true
		$scope.preorderInfo=data.preorderInfo;
		$scope.customerInfo = data.customerInfo;
		$scope.combineInfo = data.combineInfo;
		$scope.imgAdapt('http://z.haoma.cn/upload/'+$scope.customerInfo.idCardHeadUrl);
		$scope.imgAdapt('http://z.haoma.cn/upload/'+$scope.customerInfo.customerImageUrl);
		if($scope.combineInfo.signName == null){
        	$scope.showBtn = true;
        }else{
        	$scope.showBtn = false;
        	$scope.imgAdapt('http://z.haoma.cn/upload/'+$scope.combineInfo.signName);
        }
		$scope.customerInfo=data.customerInfo;
		if(data.preorderInfo){
			$scope.preorderInfo=data.preorderInfo;
			$scope.orderInfo = data;
			$scope.btnIsHide=false;
			if($scope.preorderInfo.remark==""||$scope.preorderInfo.remark==null){
				$scope.numberActive=false;
			}
			else{
				$scope.numberActive=true;
			}
			
			if($scope.preorderInfo.status == "000003" && $scope.preorderInfo.projectAddress==null){
				$scope.OrderState='签名完成，地址未预判';
			}else{
				$scope.OrderState=orderStatus[$scope.preorderInfo.status].text;	
			}
			$scope.OrderColor=orderStatus[$scope.preorderInfo.status].color;
			if($scope.preorderInfo.status == "000003" && $scope.preorderInfo.projectAddress!=null){
			}
		}
		
		// 号码列表
		var tilList = JSON.parse($scope.preorderInfo.choiceNumbers);
		for(var i in tilList){
			var orderAs = "kaikaGo";
			var orderNo = tilList[i][1] ? tilList[i][1] : "";
			if(i == 0){
				orderAs = "managez";
				orderNo = $scope.orderInfo.customerInfo["orderNo"];
			}
			var status = new Boolean(orderNo !== "" && data.orderStatus ? data.orderStatus[orderNo] : false);
			$scope.telList.push({"as":orderAs, "number":String(tilList[i][0]), "status":status,"orderNo":orderNo})
		}
		
	}).error(function () {
		my.alert('数据信息获取失败！请稍后尝试。').then(function(){
			$state.go('dianpu-microshop-lan-order-list');
		});
	});
	
	$scope.SetAuthentication = function(){
		authentication["name"] 		= $scope.orderInfo.customerInfo["name"];
		authentication["cardId"] 	= $scope.orderInfo.customerInfo["cardId"];
		authentication["address"] 	= $scope.orderInfo.customerInfo["address"];
		authentication["birthday"] 	= $scope.orderInfo.customerInfo["birthday"];
		authentication["police"] 	= $scope.orderInfo.customerInfo["police"];
		authentication["nation"] 	= $scope.orderInfo.customerInfo["nation"];
		authentication["gender"] 	= $scope.orderInfo.customerInfo["sex"];
		authentication["start_date"]= $scope.orderInfo.customerInfo["validStart"];
		authentication["end_date"] 	= $scope.orderInfo.customerInfo["validEnd"];
		authentication["contractNumber"] = $scope.orderInfo.preorderInfo["contactNumber"];
		authentication["idHeadImgUrl"] = $scope.orderInfo.customerInfo["idCardHeadUrl"];
		authentication["customerImageUrl"] = $scope.orderInfo.customerInfo["customerImageUrl"];
		authentication["idHeadImg"] = $scope.orderInfo.customerInfo[""];
		authentication["sign"] = $scope.orderInfo.combineInfo["signUrl"];
		authentication["orderNo"] = $scope.orderInfo.customerInfo["orderNo"];
	}
	
	//点击办理
	$scope.order = function(i){
		$scope.orderNumber = $scope.telList[i];
		$scope[$scope.telList[i].as]();
	}

	$scope.managez = function(){
		
		empty_filterSelect();
        filterSelect = {};
		reset_kuandai_wojia();
		order_type = "kuandai";
		app = "kuandai";
		number_pool = "CBSS";
		wojiaIsronghe = false;  // 判断是不是共享套餐
		wojiaRootProductId = "90381554";
		KuandaiMainProductName = "冰融组合";
		service_type = "wojia-combination";
		kuandai_number_into = true;
		reelectNumber = 0;

		if($scope.preorderInfo.packageId == "33"){
			kuandai_tel_package['productId'] = "90356341";
		}else if($scope.preorderInfo.packageId == "34"){
			kuandai_tel_package['productId'] = "90356344";
		}else if($scope.preorderInfo.packageId == "35"){
			kuandai_tel_package['productId'] = "90356346";
		}
		
		kuandai_selected_package["tv_type"] = "data/tv-0";
		kuandai_selected_package.tv = true;

		wx_order["orderCode"] = $scope.preorderInfo.orderCode
		wx_order["verifyCode"] = $scope.preorderInfo.verifyCode
		wx_order["tv"] = $scope.preorderInfo.box == "000001" ? true : false
		wx_order["ftth"] = $scope.preorderInfo.cat == "000001" ? true : false
		wx_order["preCharge"] = "0";

		kuandai_combination_address = JSON.parse($scope.preorderInfo.projectAddress);
		kuandai_combination_address["detailed"] = JSON.parse($scope.preorderInfo.detailAddress);
		kuandai_combination_address["detailed"]["pointExchId"] = kuandai_combination_address["detailed"]["pointExchId"] == "" ? kuandai_combination_address["detailed"]["exchCode"] : kuandai_combination_address["detailed"]["pointExchId"];
		telInfo = {
			number:$scope.orderNumber.number
			,tel:$scope.orderNumber.number
			,costPrice:"0"
			,leaseLength:"0月"
			,lowCost:"0"
			,isCbss:true
			,poolId:"0"
			,preCharge:"0"
			,isOldNumber:false
			,tradeType:"0"
			,write:false
		}
		$scope.SetAuthentication();
		$state.go("kuandai-wojia-combination-package-tel-result");
	}

	$scope.kaikaGo = function(){
		reset_dianpu_cbss();
		order_type = "kaika";
		app = "dianpu";
		service_type = "cbssFuka";
		number_pool = "CBSS";
		source = "000004";
		sourceName = "CBSS副卡";
		dianpu_order_amount = null;
		$scope.SetAuthentication();

		wx_order["orderCode"] = $scope.preorderInfo.orderCode
		wx_order["zhukaNumber"] = $scope.telList[0].number;
		wx_order["number"] = $scope.orderNumber.number;

		if($scope.orderNumber.orderNo){
			$scope.kaika();
		}else{
			$scope.createOrder();
		}
	}

	$scope.createOrder = function(){
		var data = {
			"name": authentication["name"],
			"cardId": authentication["cardId"],
			"idHeadImg": authentication["idHeadImg"],
			"address": authentication["address"],
			"validStart": authentication["start_date"],
			"validEnd": authentication["end_date"],
			"birthday": authentication["birthday"],
			"sex": authentication["gender"],
			"police": authentication["police"],
			"nation": authentication["nation"],
			"customerImageUrl":authentication["customerImageUrl"],
			"isCbss":"000001",
			"source":source,
			"unicommServer":unicommServer
		}
		data["type"] = "000001";
		data["number"] = $scope.orderNumber.number;
		data["productId"] = "89128067";
		data["productName"] = "4G副卡";
		data["activityId"] = "";
		data["activityName"] = "";
		data["lnglats"]  = ",";
	
	
		$http({
			"method": 'POST',
			"url": ajaxurl + 'orderApp/createOrder',
			"params": {"token":$rootScope.token},
			"data": data
		}).success(function(data){
			if(data.status == "1"){
				authentication["orderNo"] = data["orderNo"];
				var choiceNumbers = [];
				for(var i in $scope.telList){
					var orderNoTemp = $scope.telList[i].number == $scope.orderNumber.number ? data["orderNo"] : $scope.telList[i].orderNo
					choiceNumbers.push([$scope.telList[i].number,orderNoTemp])
				}
				$http({
					"method": 'POST',
					"url": ajaxurl + 'lanPreorderApp/updateTmWechatLanPreorder',
					"params": {"token":$rootScope.token},
					"data": {
						"orderCode":$scope.preorderInfo.orderCode,
						"choiceNumbers":JSON.stringify(choiceNumbers)
					}
				});
				$scope.kaika();
			}else{
				my.alert(data.msg)
			}
		}).error(function(){
			my.alert('保存用户信息失败!');
		});
	}


	$scope.kaika = function(){

		authentication["orderNo"] = $scope.orderNumber.orderNo;

		telInfo["number"]=$scope.orderNumber.number
		telInfo["tel"]=$scope.orderNumber.number
		telInfo["costPrice"]="0"
		telInfo["leaseLength"]="0月"
		telInfo["lowCost"]="0"
		telInfo["isCbss"]=true
		telInfo["poolId"]="0"
		telInfo["preCharge"]="0"
		telInfo["isOldNumber"]=false
		telInfo["tradeType"]="0"
		telInfo["write"]=false
		$state.go("dianpu-cbss-fukaInfo");
	}


	
	//点击图片放大
    $scope.changePic=function(){
    	$scope.isShowBigPic=true;
    	$scope.isNoShowHeader=true;
    	var img = new Image(); 
        img.src =  $scope.customerInfo.customerImageUrl; 
        img.onload = function(){
            if(img.width > img.height){
                $scope.bigPic = {
                   'margin': 'auto',
                   'width':'85%',
                   'height':'56%'
                }
            }
        }
    }
    //关闭放大图片
    $scope.closeBigPic=function(){
    	$scope.isShowBigPic=false;
    	$scope.isNoShowHeader=false;
	}
	//获取补签名链接
    $scope.supplySignature = function() {
        $http({
            method: 'get',
            url: ajaxurl + 'orderApp/getQrCode4AuthOrder?token=' + $rootScope.token,
            params: {
                'orderNo': order["orderCode"]
            }
        }).success(function(data) {
            if (data.result == true) {
            	console.log('http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+data.orderNo);
            	cordova.ThemeableBrowser.open('http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+data.orderNo,
					' _self',{
						statusbar: {
							color: '#ffffffff'
					},
					toolbar: {
						height: 44,
						color: '#f0f0f0ff'
					},
					title: {
						color: '#003264ff',
						showPageTitle: true,
						staticText: '补录签名'
					},
					closeButton: {
						image: 'close_pressed',
						align: 'left',
						event: 'closePressed'
					}
				})
                // my.alert('<textarea id="text" readonly>http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo=' + order["orderCode"] + '</textarea>', '', '复制链接')
                //     .then(function() {
                //         // var target = document.getElementById("text"); //获取目标元素
                //         // target.focus();
                //         // const selection = window.getSelection();
                //         // if (selection.rangeCount > 0) selection.removeAllRanges();
                //         // target.setSelectionRange(0, target.value.length);
                //         // document.execCommand('copy', false, null)
                        
                //     });
            }
        }).error(function() {
            my.alert('服务器信息获取失败！');
        });
    }
	

	
	// $scope.manager=function(){
	// 	empty_filterSelect();
    //     filterSelect = {};
	// 	reset_kuandai_wojia();
	
	// 	if($scope.preorderInfo.packageId == "29"){
	// 		wojiaProduct ={"wojiaRootProductId":"90359575", "wojiaflowProductId":"51992446", "LanList":["90359650"], "ITVpackageID":"90359679"};
	// 		wx_order.preCharge = "100"
	// 	}else if($scope.preorderInfo.packageId == "30"){
	// 		wojiaProduct ={"wojiaRootProductId":"90359554", "wojiaflowProductId":"51992479", "LanList":["90359655"], "ITVpackageID":"90359679"};
	// 		wx_order.preCharge = "100"
	// 	}else if($scope.preorderInfo.packageId == "31"){
	// 		wojiaProduct ={"wojiaRootProductId":"90359573", "wojiaflowProductId":"51996219", "LanList":["90359659", "90359658"], "ITVpackageID":"90359679"};
	// 		wx_order.preCharge = "200"
	// 	}else if($scope.preorderInfo.packageId == "32"){
	// 		wojiaProduct ={"wojiaRootProductId":"90359572", "wojiaflowProductId":"51992450", "LanList":["90359660"], "ITVpackageID":"90359679"};
	// 		wx_order.preCharge = "200"
	// 	}
	// 	// else{
	// 	// 	wojiaProduct ={"wojiaRootProductId":"90359575", "wojiaflowProductId":"51992446", "LanList":["90359650"], "ITVpackageID":"90359679"};
	// 	// 	wx_order.preCharge = "100"
	// 	// }

	// 	// tv包是否可用
	// 	kuandai_selected_package["tv_type"] = "data/tv-0-90359679";
	// 	kuandai_selected_package.tv = $scope.preorderInfo.itv == "000001" ? true : false;

    //     wojiaIsronghe = true;  // 判断是不是共享套餐
	// 	wojiaRootProductId = wojiaProduct["wojiaRootProductId"];	// 主套餐
	// 	wojiaflowProductId = wojiaProduct["wojiaflowProductId"];	// 主资费包
    //     KuandaiMainProductName = "沃家共享";
    //     service_type = "wojia-ronghe";
    //     kuandai_number_into = true;
	// 	reelectNumber = 0;
		
	// 	$scope.orderGo();
	// }

});
