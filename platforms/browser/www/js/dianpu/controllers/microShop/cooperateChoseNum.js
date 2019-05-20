appControllers.controller('cooperate-chose-num', function($scope,$http,$rootScope,$state,$filter,$ionicPopup,$ionicPopup,$timeout,$ionicLoading,my) {
	$scope.title = "协同选号";
	$scope.orderList=[];
	$scope.readMore = true;
	$scope.loading = false;
	$scope.showList = true;
	$scope.pageIndex = 1;
	$scope.pageSize = '';
	$scope.pageCount = '';
	$scope.noMoreTips = true;
	$scope.login=JSON.parse(localStorage.getItem("login"));
	$scope.shopName=shopInfo["shopBo"].shopName;
	$scope.shopTel=shopInfo["shopBo"].shopTel;
	$scope.textUrl="http://z.haoma.cn/tms-app-war/shopApp/preIndex?username=" + userBo.userName;
	//console.log($scope.textUrl);
	$scope.avatar = 'img/logo.png';
	//获取用户信息
	$http({
		method: 'GET',
		url: ajaxurl + "/userApp/toMyView?token=" + $rootScope.token,
	}).success(
		function(data){
			console.log("111="+JSON.stringify(data));
			$scope.avatar = data.user.headImgUrl;
			$scope.shopName = data.shopBo.shopName;
			if($scope.avatar == null){
				$scope.avatar = 'img/logo.png';
			}
		}
	)
	
	angular.element("#qrbox").qrcode({ 
		  "render": "canvas"
		, "width": 240
		, "height":240
		, "text": $scope.textUrl
	}); 
	$scope.cooperateCodeIsShow=false;
	$scope.cooperateCodeShow=function(){
		$scope.cooperateCodeIsShow=true;
	}
	$scope.close=function(){
		$scope.cooperateCodeIsShow=false;
	}
	//初始化数据
	$scope.getData=function(status){
		// $ionicLoading.show({template: '数据加载中...'});
		$scope.noMoreTips = true;
		$scope.orderList=[];
		//获取当前时间
		 $scope.day = new Date();
		 $scope.endTime=$filter("date")($scope.day,"yyyy-MM-dd HH:mm:ss");
		 //console.log($scope.endTime);
		 $scope.startTime=$filter("date")($scope.day.getTime() - 24*60*60*1000*2,"yyyy-MM-dd HH:mm:ss");
		 //console.log($scope.startTime);
		$http({
			method:'GET',
			url:ajaxurl + 'wechatShopApp/queryAppPreorderList?token=' + $rootScope.token,
			params:{status:status,startTime:$scope.startTime,endTime:$scope.endTime},
			timeout: 5000
			//params:{status:status}
		}).success(function(data){
			// $ionicLoading.hide();
			//console.log("2222::"+JSON.stringify(data));
			$scope.readMore = false;
			$scope.loading = true;
			$scope.showList = false;
			$scope.orderList =$scope.orderList.concat(data['orderList']);
			if($scope.orderList.length>0){
				//console.log("11111");
				$scope.myObj = {
			        "display" : "block"
			    }
			}else{
				//console.log("2222");
				$scope.myObj = {
			        "display" : "none"
			    }
			}
			$scope.pageSize = data.page['pageSize'];
			$scope.pageCount = data.page['pageCount'];
			loadingState($scope.pageCount,$scope.pageSize);
			$scope.loadMoreData = function(){
				loadMore('000001','','',$scope.pageCount,$scope.pageSize)
				loadMore('000005','','',$scope.pageCount,$scope.pageSize)
			};
		}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                  $state.go('index');
              }); 
        });

	};
	$scope.getData("000001");
	$scope.getData("000005");
	$scope.doRefresh = function() {
		$scope.getData("000001");
		$scope.getData("000005");
		$timeout(function() {
			$scope.$broadcast('scroll.refreshComplete');
		}, 3000);
	}
	//停止刷新
	  function endRefreshAction() {  
	        $scope.$broadcast('scroll.refreshComplete');
	  }
	//判断加载与否状态
	function loadingState(pageCount,pageSize){
		if(pageCount > pageSize){
			$scope.infoState = '加载更多';
		}else{
			$scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = true;
		}
	}
	//加载更多
	function loadMore(status,startTime,endTime,pageCount,pageSize){
		if($scope.pageIndex < Math.ceil(pageCount / pageSize)){
			$scope.loading = false;
			$scope.pageIndex++;
			//console.log($scope.pageIndex);
			$http({
				method:'GET',
				url:ajaxurl + 'wechatShopApp/queryAppPreorderList?token=' + $rootScope.token,
				params:{status:status,startTime:startTime,endTime:endTime,pageIndex:$scope.pageIndex}
			}).success(function(data){
				$scope.loading = true;
				$scope.mask = false;
				$scope.noscroll = false;
				$scope.orderList = $scope.orderList.concat(data['orderList']);
				$scope.newOrderList=$scope.orderList;
			}).error(function(){
			
			});
		}else{
			$scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = false;
		}
	}
	$scope.manage=function(index){
		$scope.orderCode=$scope.orderList[index].orderCode;
		$scope.orderStatus="000005";
		$scope.source=$scope.orderList[index].source;
		$scope.number=$scope.orderList[index].number;
		wx_number =$scope.number;		
		wx_orderCode= $scope.orderCode;
		wx_order = {
			  "number":$scope.number
			, "orderCode":$scope.orderCode
		}
		//订单处理中
		$http({
				method:'GET',
				url:ajaxurl + '/wechatShopApp/updatePreorderStatus?token=' + $rootScope.token,
				params:{orderCode:$scope.orderCode,orderStatus:$scope.orderStatus,number:$scope.number}
			}).success(function(data){
				//console.log("aa==="+JSON.stringify(data));
				$scope.orderList[index].wxOrderState='订单处理中';
				$scope.orderList[index].successColor=false;
				$scope.orderList[index].waitColor=false;
				$scope.orderList[index].failureColor=false;
				$scope.orderList[index].dealColor=true;
				$scope.orderList[index].btnIsHide=true;	
				//console.log("111=="+JSON.stringify($scope.orderList));
			});
		
		
		if($scope.source=='000001'||$scope.source==null){
			$state.go('dianpu-hm-business', {pageTitle:'号码业务'});
		}else if($scope.source=='000002'){
			// alertData("冰激凌套餐，号码"+$scope.number+"订单号"+$scope.orderCode);
			$state.go('number-list');
		}else if($scope.source=='000003'){
			alertData("请到号码之家集客版APP进行办理");
		}else if($scope.source=='000004'){
			alertData('号码之家暂不支持此套餐业务');
		}
	}
	//提示信息
	function alertData(info){
		var alertPopup = $ionicPopup.alert({
			    title: '提示信息',
			    template: info
			});
			alertPopup.then(function(res) {
			    //console.log('Thank you for not eating my delicious ice cream cone');
			});
	}
	$scope.share=function(){
		//console.log("分享");
		html2canvas(angular.element(".myCodeInfo"), {
           		 allowTaint: true,
           		 taintTest: false,
           		 onrendered: function(canvas) {
                            canvas.id = "mycanvas";
                            //document.body.appendChild(canvas);
                            //生成base64图片数据
                            var  dataUrl = canvas.toDataURL();
                            dataUrl=dataUrl.substring(22);
                            //console.log("dataUrl==="+dataUrl);

                            /*var newImg = document.createElement("img");
                            newImg.src =  dataUrl;
                            document.body.appendChild(newImg);*/
                            	cordova.plugins.sharePlugin.share({
						title:"",
						description:"",
						image:dataUrl,
						url:"",
						category:"2"
					});
                        },
                     });
		
		
	}
	//更新列表状态 删除列表
	$scope.deleteList=function(index){
		$scope.orderCode=$scope.orderList[index].orderCode;
		$scope.number=$scope.orderList[index].number;
		var myPopup = $ionicPopup.show({
		   title: '提示信息',
		   template: '确定删除该条消息？',
		   buttons:[
			{text:'取消'},
			{
				text:'<b>确定</b>',
				type:'button-positive',
				onTap:function(){
					//console.log("确定删除");
					$http({
						method:'GET',
						url:ajaxurl + '/wechatShopApp/updatePreorderStatus?token=' + $rootScope.token,
						params:{orderCode:$scope.orderCode,orderStatus:'000003',number:$scope.number}
					}).success(function(data){
						//console.log(data);
						$scope.orderList[index].status='000003';
						//console.log($scope.orderList[index].status);
					});
				}
			},
		   ]
		});
	}
})