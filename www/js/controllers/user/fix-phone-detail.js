appControllers.controller('fixPhoneDetail', function($scope,$http,$state,$rootScope,$ionicLoading,$filter,$ionicPopup,my) {
	$scope.title = '固话订单详情';
	//console.log(order["numberOrderCode"]);
	$scope.loading = false;
	$scope.hasElectronicWorksheets = true;
	// $ionicLoading.show({template: '数据加载中...'});
	$http({
		method:"GET",
		url:ajaxurl + 'telOrderApp/queryTelOrderDetail?token=' + $rootScope.token,
		params:{'numberOrderCode':order["numberOrderCode"]},
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
		$scope.shop=data.shop;
		$scope.bssInfo=data.bssInfo;
		$scope.shopOrderInfo=data.shopOrderInfo;
        //适配宽照片
         $scope.imgAdapt = function(imgSrc){
            var img = new Image(); 
            img.src =  imgSrc; 
            img.onload = function(){
                console.log(imgSrc+'   '+img.width+'   '+img.height);
                if(img.width > img.height){
                    $scope.imgProp = {
                        'max-height': '27vw',
                        'height': '110px'
                    }
                }
            }
        }
        $scope.imgAdapt($scope.shopOrderInfo.idCardHeadUrl);
        $scope.imgAdapt($scope.shopOrderInfo.customerImageUrl);
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
                $state.go('index');
            }); 
        });
	//点击图片放大
	$scope.isNoShowHeader=false;
    $scope.changePic=function(){
    	$scope.isShowBigPic=true;
    	$scope.isNoShowHeader=true;
        var img = new Image(); 
        img.src =  $scope.shopOrderInfo.customerImageUrl; 
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
                'orderNo': order["numberOrderCode"]
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
