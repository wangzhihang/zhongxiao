appControllers.controller('kk-order-detail', function($scope,$http,my,$rootScope,$state,$ionicLoading) {
	$scope.title = '开卡订单详情';
	$scope.eleOrder = '';
	$scope.hideLoadingPage = true;
	$scope.isNoShowActivityName =true;
	$scope.loading=false;
	$scope.showSalemanInfo=true;
	$scope.orderCode = '';
	//$scope.status = "000";
	// $ionicLoading.show({template: '数据加载中...'});
	function extend(target, source) {
        for (var obj in source) {
            target[obj] = source[obj];
        }
        return target;
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
		method:'get',
		url:ajaxurl + 'numberOrderApp/queryNumberOrderDetailByOrderCode?token=' + $rootScope.token,
		params:{orderCode:localStorage.getItem('orderCode')},
		timeout: 5000
	}).success(function(data){
		// $ionicLoading.hide();
		$scope.loading=true;
		$scope.hideLoadingPage = false;
		//console.log(JSON.stringify(data));
		$scope.orderCode = data.orderDetail.orderCode;
		$scope.status = data.orderDetail.status;
		$scope.isCbss=data.orderDetail.isCbss;
		$scope.deveUserList=data.deveUserList;
		
		// console.log('111=='+JSON.stringify($scope.deveUserList));
		if($scope.deveUserList.length==0){
			$scope.showSalemanInfo=false;
		}
		if($scope.isCbss=='000001'){
			$scope.isCbssVal="CBSS";
		}else if($scope.isCbss=='000002'){
			$scope.isCbssVal="BSS";
		}
		
		//用户信息
		$scope.orderDetail = data.orderDetail;
		$scope.imgAdapt($scope.orderDetail.idCardHeadUrl);
		$scope.imgAdapt($scope.orderDetail.customerImageUrl);
		if($scope.orderDetail.signUrl.substring(25, 29) == 'null'){
        	$scope.showBtn = true;
        }else{
        	$scope.showBtn = false;
        	$scope.imgAdapt($scope.orderDetail.signUrl);
        }
		$scope.activityName = data.orderDetail.activityName;
		if($scope.activityName==undefined || $scope.activityName==''){
			$scope.isNoShowActivityName =false;
			localStorage.setItem('isNoShowActivityName','1');
		}

		//店铺信息
		$scope.userInfos=data.userInfos;
		$scope.showUserInfos=true;
		$scope.showShopInfo=true;
		// $scope.showSalemanInfo=true;
		if($scope.userInfos){
			$scope.shopName=$scope.userInfos.shopName;
			$scope.cTel=$scope.userInfos.cTel;
			$scope.cRealName=$scope.userInfos.cRealName;
			$scope.cUserName=$scope.userInfos.cUserName;
			if($scope.shopName==null&&$scope.cTel==null&&$scope.cUserName==null){
				$scope.showShopInfo=false;
			}
			// $scope.bRealName=$scope.userInfos.bRealName;
			// $scope.bUserName=$scope.userInfos.bUserName;
			// if($scope.bRealName==null&&$scope.bUserName==null){
			// 	$scope.showSalemanInfo=false;
			// }
		}
		if($scope.showShopInfo == false && $scope.showSalemanInfo == false){
			$scope.showUserInfos = false;
		}

		//根据经纬度获取并显示地图
		$scope.isShowMapContainer=true;
		$scope.getMap=function(){
			 var map = new AMap.Map('mapContainer', {
                center: [$scope.longitude,$scope.latitude],
                zoom: 16
            });
            var marker=new AMap.Marker({
                position:[$scope.longitude,$scope.latitude],
                map:map
            });
		}
		$scope.lnglats=$scope.orderDetail.lnglats;
		// console.log("lnglats==="+$scope.lnglats);
		$scope.lnglarArr=[];
		if($scope.lnglats==null||$scope.lnglats==""){
			$scope.isShowMapContainer=false;
		}else{
			$scope.lnglarArr=$scope.lnglats.split(',');
			$scope.longitude =$scope.lnglarArr[0];
			$scope.latitude =$scope.lnglarArr[1];
			$scope.getMap();
		}
		
		//如果"source == 000008 显示身份证正面照片"
		if(data.orderDetail.source == '000008'){
			$scope.idCardHeadUrl = data.orderDetail.idCardImageBackUrl;
		}
		//获取电子工单编号
		$scope.eleOrder = data.orderDetail.eleOrder;
		//如果电子工单不为空，则显示查看按钮
		if($scope.eleOrder == '' || $scope.eleOrder == null){
			$scope.hasElectronicWorksheets = false;
		}else{
			$scope.hasElectronicWorksheets = true;
		}

		
	}).error(function () {
		my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
	});

	//备注
    if(localStorage.getItem('isNoShowActivityName')&&localStorage.getItem('isNoShowActivityName')== '1'){
    	$scope.isNoShowActivityName = false;
    }

		//获取电子工单
		$scope.viewElectronicWorksheets = function(){
			handleDocumentWithURL(
				function() {
					//console.log('success');
				},
				function(error) {
					if(error == 53) {
						my.alert("对不起，您的手机无法阅读PDF文件！");
					}
				},
				$scope.eleOrder
			);
		};
	//点击图片放大
	$scope.isNoShowHeader=false;
    $scope.changePic=function(){
    	$scope.isShowBigPic=true;
    	$scope.isNoShowHeader=true;
    	var img = new Image(); 
        img.src =  $scope.orderDetail.customerImageUrl; 
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
    $scope.supplySignature = function(){
    	$http({
			method:'get',
			url:ajaxurl + 'orderApp/getQrCode4AuthOrder?token=' + $rootScope.token,
			params:{
				'orderNo':localStorage.getItem('orderCode')
			}
		}).success(function(data){
			if(data.result == true){
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
				// my.alert('<textarea id="text" readonly>http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+$scope.orderCode+'</textarea>','','复制链接')
    //              .then(function(){
    //                  var target=document.getElementById("text");//获取目标元素
    //                    target.focus();
    //                    const selection = window.getSelection();
    //                    if(selection.rangeCount > 0) selection.removeAllRanges();
    //                    target.setSelectionRange(0, target.value.length);
    //                    document.execCommand('copy', false, null)
    //              });
                 //安卓可复制 ios不可
			  //    	var target=document.getElementById("text");//获取目标元素
					// target.select(); // 选择文本
    	// 			document.execCommand("Copy"); // 执行浏览器复制命令
			}
		}).error(function(){
			my.alert('服务器信息获取失败！');
		});
    }
    
});