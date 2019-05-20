appControllers.controller('fixPhoneDailiDetail', function($scope,$http,$state,$rootScope,$ionicLoading,my,$filter,$ionicPopup) {
	$scope.title = '固话订单详情';
	//console.log(order["numberOrderCode"]);
	$scope.loading = false;
	$scope.hasElectronicWorksheets = true;
	$scope.showSalemanInfo=true;
	$scope.showShopInfo=true;
	$scope.showUserInfos=true;
	$scope.orderCode = localStorage.getItem('orderCode');
	$scope.numberOrderCode = localStorage.getItem('numberOrderCode');
	// $ionicLoading.show({template: '数据加载中...'});
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
		method:"GET",
		url:ajaxurl + 'telOrderApp/queryTelOrderDetail?token=' + $rootScope.token,
		params:{'numberOrderCode':$scope.numberOrderCode},
		timeout: 5000
	}).success(function(data){
		// $ionicLoading.hide();
		//console.log("11==="+JSON.stringify(data));
		$scope.loading = true;
		//用户信息
		$scope.status = data.orderInfo.status;
		//console.log($scope.status);
		//订单信息
		$scope.orderInfo=data.orderInfo;
		//店铺信息
		$scope.userInfos=data.userInfos;
		if($scope.userInfos){
			$scope.shopName=$scope.userInfos.shopName;
			$scope.cTel=$scope.userInfos.cTel;
			$scope.cRealName=$scope.userInfos.cRealName;
			$scope.cUserName=$scope.userInfos.cUserName;
			if($scope.shopName==null&&$scope.cRealName==null&&$scope.cTel==null&&$scope.cUserName==null){
				$scope.showShopInfo=false;
			}
		}
		$scope.deveUserList=data.deveUserList;
		if($scope.deveUserList.length==0){
			$scope.showSalemanInfo=false;
		}
		if($scope.showShopInfo==false&&$scope.showSalemanInfo==false){
			$scope.showUserInfos=false;
		}
			
		$scope.bssInfo=data.bssInfo;
		//人脸比对图片展示
		$scope.shopOrderInfo = data.shopOrderInfo;
		$scope.imgAdapt($scope.shopOrderInfo.idCardHeadUrl);
		$scope.imgAdapt($scope.shopOrderInfo.customerImgUrl);
		if($scope.shopOrderInfo.signUrl.substring(25, 29) == 'null'){
        	$scope.showBtn = true;
        }else{
        	$scope.showBtn = false;
        	$scope.imgAdapt($scope.shopOrderInfo.signUrl);
        }
		//如果电子工单不为空，则显示查看按钮
		$scope.eleOrder = data.orderInfo.eleOrder;
		$scope.telphoneEleOrder = data.orderInfo.telphoneEleOrder;
		if($scope.eleOrder == '' || $scope.eleOrder == null){
			$scope.hasElectronicWorksheets = false;
		}else{
			$scope.hasElectronicWorksheets = true;
		}
		$scope.viewElectronicWorksheets = true;
		//获取电子工单
		$scope.viewElectronicWorksheets = function(eleOrder){
			handleDocumentWithURL(
				function() {
					//console.log('success');
				},
				function(error) {
					if(error == 53) {
						$ionicPopup.alert({
					       title: '系统提示',
					       template: '对不起，您的手机无法阅读PDF文件！',
					       okText:'我知道了',
					       okType:'button-default'
					    });
					}
				},	
			
				eleOrder
				
			);
		}
	}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	 //点击图片放大
	$scope.isNoShowHeader=false;
    $scope.changePic=function(){
    	$scope.isShowBigPic=true;
    	$scope.isNoShowHeader=true;
    	var img = new Image(); 
        img.src =  $scope.shopOrderInfo.customerImgUrl; 
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
                'orderNo': $scope.numberOrderCode
            }
        }).success(function(data) {
            if (data.result == true) {
            	// console.log('http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+data.orderNo);
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
})
