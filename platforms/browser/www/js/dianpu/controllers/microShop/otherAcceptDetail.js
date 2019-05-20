appControllers.controller('dianpu-wx-other-accept-detail', function($scope,$http,$rootScope,$state,$stateParams,my,url2base64) {
	$scope.title = '异业受理详情';
	$scope.loading=false;
	$scope.orderCode=$stateParams.orderCode;
	$scope.orderData = {};
	// if(shopBo.auserName.substr(1,shopBo.auserName.length)==shopBo.cuserName.substr(1,shopBo.cuserName.length)){
	 	
	// }else{
	// 	$scope.isNoShowCard=false;
	//  }
	 $scope.isNoShowCard=true;
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
		method:'GET',
		url:ajaxurl + 'remoteMarketOrderApp/getOpenCardInfoByOrderCode?token=' + $rootScope.token,
		params:{
			orderCode:$scope.orderCode
		}
	}).success(function(data){
		$scope.loading=true;
		$scope.orderData = data;
		$scope.imgAdapt($scope.orderData.idCardImageUrl);
		$scope.imgAdapt($scope.orderData.handCardUrl);
		if($scope.orderData.sign == null){
        	$scope.showBtn = true;
        }else{
        	$scope.showBtn = false;
        	$scope.imgAdapt($scope.orderData.sign);
        }
	}).error(function () {
		my.alert('数据信息获取失败！请稍后尝试。').then(function(){
			$state.go('index');
		});
	});

    $scope.openCard=function(){
		reset_dianpu_bss();
		reset_dianpu_cbss();
		authentication["name"] 		= $scope.orderData.cardInfo["name"];
		authentication["cardId"] 	= $scope.orderData.cardInfo["cardId"];
		authentication["address"] 	= $scope.orderData.cardInfo["address"];
		authentication["birthday"] 	= $scope.orderData.cardInfo["birthday"];
		authentication["police"] 	= $scope.orderData.cardInfo["police"];
		authentication["nation"] 	= $scope.orderData.cardInfo["nation"];
		authentication["gender"] 	= $scope.orderData.cardInfo["sex"];
		authentication["start_date"]= $scope.orderData.cardInfo["validStart"];
		authentication["end_date"] 	= $scope.orderData.cardInfo["validEnd"];
		authentication["contractNumber"] = $scope.orderData.numberOrder["contactNumber"];
		authentication["idHeadImgUrl"] = $scope.orderData.idCardImageUrl;
		authentication["customerImageUrl"] = $scope.orderData.handCardUrl;
		authentication["idHeadImg"] = $scope.orderData.headBase64;
		authentication["sign"] = $scope.orderData.sign;

		yy_order = {
			 "orderCode":$scope.orderData.numberOrder.orderCode
			,"simNumber":$scope.orderData.simNumber
			,"preFee":$scope.orderData.numberOrder.amount
		}

		telInfo["tel"] = $scope.orderData.numberOrder.number;
		telInfo['productId'] = $scope.orderData.numberOrder.contractId;
		telInfo["preCharge"] = "0";
		telInfo["lowCost"] = "0";

		if($scope.orderData.numberOrder.isCbss == "000002"){
			dianpu_bss_package_array["bssPackageSelect"] = {
				"productId":$scope.orderData.numberOrder.contractId,
				"productName":$scope.orderData.numberOrder.contractName
			}
			authentication["customerImagebase64"] = $scope.orderData.handCardBase64;
			$state.go("dianpu-bss-write-sim-submit");
		}else{
			my.confirm("需要选择，首月按量计费！", "", "知道了").then(function(){
				$state.go("dianpu-cbbs-package-result");
			})
		}
    }
   //点击图片放大
	$scope.isNoShowHeader=false;
    $scope.changePic=function(){
    	$scope.isShowBigPic=true;
    	$scope.isNoShowHeader=true;
    	var img = new Image(); 
        img.src =  $scope.orderData.handCardUrl; 
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
                'orderNo': $scope.orderCode
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
            }
        }).error(function() {
            my.alert('服务器信息获取失败！');
        });
    }
})
