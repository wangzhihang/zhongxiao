appControllers.controller('visit-reserve-gohome-dealCard', function($scope, $rootScope, $http, $state,my,$ionicPopup) {
	$scope.title = '预约卡上门办理';

	$scope.longitude = '108.889953';
	$scope.latitude = '34.236364';
	$scope.province = '陕西省',
	$scope.city = '西安市',
	$scope.area = '雁塔区';
	$scope.getNearbyOrderBtn = true;
	$scope.tag = null;
	$scope.receivedWkBespeak =[];
	$scope.planReveiveOrders = [];
	$scope.rejectOrders = [];
	$scope.txtState = '取消';
	$scope.allChose = true;
	$scope.showTip = false;

	//画地图
    var map = new AMap.Map('myMapContainer0', {
        center: [$scope.longitude, $scope.latitude],
        zoom: 12
    });

    $scope.getNearbyOrder = function(){
    	$http({
	        method: 'POST',
	        url: ajaxurl + "wangka/updateGdCoordinate?token=" + $rootScope.token,
	        data: {
	        	'jingdu':$scope.longitude,
	        	'weidu':$scope.latitude,
	        	'province':$scope.province,
	        	'city':$scope.city,
	        	'area':$scope.area
	        }
	    }).success(function(data) {
	       if(data == true){
	       	$scope.tag = 1;
	       	$scope.getNearbyAllOrder();
	       }
	    }).error(function() {
	        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
	            // $state.go('index');
	        });
	    });
    }
    //查询用户附近所有订单
    $scope.getNearbyAllOrder = function(){
    	$http({
	        method: 'GET',
	        url: ajaxurl + "wangka/getAll?token=" + $rootScope.token
	    }).success(function(data) {
	    	$scope.getNearbyOrderBtn = false;
	    	//未接受订单
	       $scope.receivedWkBespeak = data.receivedWkBespeak;
	       //已接收订单
	       $scope.completedWkBespeak = data.completedWkBespeak;
	       if($scope.receivedWkBespeak.length == 0){
	       		$scope.showTip = true;
	       }

	        var markers = [{
		        icon: 'img/tag1.png'
		    }, {
		        icon: 'img/tag2.png'
		    }, {
		        icon: 'img/tag3.png'
		    }, {
		        icon: 'img/tag4.png'
		    }, {
		        icon: 'img/tag5.png'
		    }, {
		        icon: 'img/tag6.png'
		    }, {
		        icon: 'img/tag7.png'
		    }, {
		        icon: 'img/tag8.png'
		    }, {
		        icon: 'img/tag9.png'
		    }, {
		        icon: 'img/tag10.png'
		    }, {
		        icon: 'img/tag11.png'
		    }, {
		        icon: 'img/tag12.png'
		    }, {
		        icon: 'img/tag13.png'
		    }, {
		        icon: 'img/tag14.png'
		    }, {
		        icon: 'img/tag15.png'
		    }, {
		        icon: 'img/tag16.png'
		    }, {
		        icon: 'img/tag17.png'
		    }, {
		        icon: 'img/tag18.png'
		    }];
	       
	       for(var i=0 in $scope.receivedWkBespeak){
	       		$scope.receivedWkBespeak[i].tag = true;
	       		// 描述当前经纬度
	       		if($scope.receivedWkBespeak[i].jingdu!=null && $scope.receivedWkBespeak[i].weidu!=null){
			        // $scope.getMap($scope.receivedWkBespeak[i].jingdu,$scope.receivedWkBespeak[i].weidu);
			        // 描述当前经纬度
			        for(var j=0 in markers){
			        	if(i == j){
			        		$scope.receivedWkBespeak[i].imgTag = markers[j].icon;
			        		$scope.receivedWkBespeak[i].sort = j;
					        var marker = new AMap.Marker({
					        	icon: markers[j].icon,
					            position: [$scope.receivedWkBespeak[i].jingdu, $scope.receivedWkBespeak[i].weidu],
					            map: map
					        });
			        	}
			        }
			        // var marker = new AMap.Marker({
			        //     position: [$scope.receivedWkBespeak[i].jingdu, $scope.receivedWkBespeak[i].weidu],
			        //     map: map
			        // });
			        // 将创建的点标记添加到已有的地图实例：
					map.add(marker);
					// marker.setMap(map);
			        
		       }
	       }
	    }).error(function() {
	        my.alert('订单获取失败！请稍后尝试。').then(function() {
	            // $state.go('index');
	        });
	    });
    }


    //高德地图
	$scope.getMap = function(longitude,latitude) {
		
        //精准定位
        map.plugin('AMap.Geolocation', function() {
	        var geolocation = new AMap.Geolocation({
			    // 设置定位超时时间，默认：无穷大
			    timeout: 10000,
			    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			    zoomToAccuracy: true,     
			    //  定位按钮的排放位置,  RB表示右下
			    buttonPosition: 'RB'
			})
	        geolocation.getCurrentPosition()
			AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
	    	AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
	    	function onComplete (data) {
			    // data是具体的定位信息
			    console.log('data=='+JSON.stringify(data));
			    // $scope.longitude = data.position.lng;
			    // $scope.latitude = data.position.lat;
			    // $scope.province = data.addressComponent.province,
			    // $scope.city = data.addressComponent.city,
			    // $scope.area = data.addressComponent.district;
			    // 获取当前位置的附近订单
			     $scope.getNearbyOrder()
			  }

			  function onError (data) {
			    // 定位出错
			    // console.log('error=='+JSON.stringify(data));
			   	// my.alert('获取当前定位失败！请稍后尝试。').then(function() {
		      	//      $state.go('index');
		     	// );
		       	// 获取当前位置的附近订单
			       	if($scope.tag == null){
			       		$scope.getNearbyOrder()
			       	}
			  }
        })
        // 描述当前经纬度
        var marker = new AMap.Marker({
            position: [longitude, latitude],
            map: map
        });

    }

    $scope.getMap($scope.longitude,$scope.latitude);

    //选择附近订单
    $scope.choseServiceClient = function(index){
    	if($scope.receivedWkBespeak[index].tag == false){
    		$scope.receivedWkBespeak[index].tag = true;
    	}else{
    		$scope.receivedWkBespeak[index].tag = false;
    	}
    }
    //选择全部订单
    $scope.choseAllClient = function(){
    	if($scope.txtState == '全选'){
    		$scope.txtState = '取消';
    		$scope.allChose = true;
    		for(var i = 0 in $scope.receivedWkBespeak){
    			$scope.receivedWkBespeak[i].tag = true;
    		}
    	}else if($scope.txtState == '取消'){
    		$scope.txtState = '全选';
    		$scope.allChose = false;
    		for(var i = 0 in $scope.receivedWkBespeak){
    			$scope.receivedWkBespeak[i].tag = false;
    		}
    	}
    }
    //再次确认所选订单
    $scope.reSureMyOrders = function(){
    	localStorage.setItem('myPosition',JSON.stringify({
			'longitude':$scope.longitude,
			'latitude':$scope.latitude ,
			'province':$scope.province,
			'city':$scope.city,
			'area':$scope.area
		}));
    	if($scope.receivedWkBespeak.length == 0){
    		localStorage.setItem('planReveiveOrders',JSON.stringify($scope.completedWkBespeak));
    		$state.go('visit-plan-travel-route');
    	}else{
    		$scope.planReveiveOrders = [];
	    	for(var i = 0 in $scope.receivedWkBespeak){
	    		if($scope.receivedWkBespeak[i].tag == true){
	    			$scope.planReveiveOrders.push($scope.receivedWkBespeak[i]);
	    		}else{
	    			$scope.rejectOrders.push($scope.receivedWkBespeak[i]);
	    		}
	    	}
	    	// console.log($scope.planReveiveOrders);
	    	if($scope.planReveiveOrders.length == 0){
				my.alert('请选择订单');
			}else{
				localStorage.setItem('planReveiveOrders',JSON.stringify($scope.planReveiveOrders));
				localStorage.setItem('rejectOrders',JSON.stringify($scope.rejectOrders));
	    		$state.go('visit-resure-My-Orders');
			}
    	}
    	
    }

    //停止接单
    $scope.refuseOrder = function(){
    	var myPopup = $ionicPopup.show({
		   title: '提示信息',
		   template: '您确定停止接单?未办理订单将被退回!',
		   buttons:[
			{text:'取消'},
			{
				text:'<b>确定</b>',
				type:'button-positive',
				onTap:function(){
					$http({
				        method: 'get',
				        url: ajaxurl + "wangka/stopDistribute?token=" + $rootScope.token
				    }).success(function(data) {
				       if(data == true){
				       		my.alert('您已停止接单！未办理订单已被退回。').then(function(){
								$state.go('index');
							})
				       }
				    }).error(function() {
				        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
				            // $state.go('index');
				        });
				    });
				}
			},
		   ]
		});
    	
    }
 
})
