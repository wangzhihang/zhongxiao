appControllers.controller('visit-plan-travel-route', function($scope, $rootScope, $http, $state,my) {
	$scope.title = '订单分配平台';
	$scope.ReveiveOrders  = JSON.parse(localStorage.getItem('planReveiveOrders'));
	$scope.myPosition  = JSON.parse(localStorage.getItem('myPosition'));
	$scope.ReveiveOrdersLength = $scope.ReveiveOrders.length-1;
	$scope.getNearbyOrderBtn = false;
	$scope.showBottomPop = true;
	$scope.tag = {
		current:1
	};
	$scope.result = {};
	//途径点经纬度
	$scope.driveWaypointsArr = [];
	$scope.rideWaypointsArr = [];
	//终点经纬度
	$scope.endPointLon = null;
	$scope.endPointLat = null;
	$scope.obj = null;
	console.log('111==='+$scope.myPosition.longitude);
	//画地图
    var map = new AMap.Map('myMapContainer1', {
        center: [$scope.myPosition.longitude,$scope.myPosition.latitude],
        zoom: 12
    });
    //添加订单位置
   $scope.addMap = function(){
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

	   	for(var i=0 in $scope.ReveiveOrders){
	   		// 描述当前经纬度
	   		if($scope.ReveiveOrders[i].jingdu!=null && $scope.ReveiveOrders[i].weidu!=null){
		        // 描述当前经纬度
		        for(var j=0 in markers){
		        	if(i == j){
		        		$scope.ReveiveOrders[i].imgTag = markers[j].icon;
		        		$scope.ReveiveOrders[i].sort = j;
		        		var marker = new AMap.Marker({
				        	icon: markers[j].icon,
				            position: [$scope.ReveiveOrders[i].jingdu, $scope.ReveiveOrders[i].weidu],
				            map: map
				        });
		        	}
		        }
		        // 将创建的点标记添加到已有的地图实例：
				map.add(marker);
		        
	       }
	       if(i < $scope.ReveiveOrders.length-1){
	    		$scope.driveWaypointsArr.push(new AMap.LngLat($scope.ReveiveOrders[i].jingdu, $scope.ReveiveOrders[i].weidu));
	    		$scope.rideWaypointsArr.push($scope.ReveiveOrders[i].jingdu, $scope.ReveiveOrders[i].weidu);

	    	}else{
	    		$scope.endPointLon = $scope.ReveiveOrders[i].jingdu;
	    		$scope.endPointLat = $scope.ReveiveOrders[i].weidu;
	    	}
	   }
	   console.log($scope.ReveiveOrders);
	   //构建驾车路线
	   $scope.drive();
	    
   }
    //驾车规划路线
   	$scope.drive = function(){
	   	AMap.plugin('AMap.Driving', function() {
	   		 //构造路线导航类
		    var driving = new AMap.Driving({
		        map: map,
		        panel: "panel"
		    }); 
		   	$scope.obj = driving;
		    // 根据起终点经纬度规划驾车导航路线
		    driving.search(new AMap.LngLat($scope.myPosition.longitude,$scope.myPosition.latitude), 
		    	new AMap.LngLat($scope.endPointLon, $scope.endPointLat),{
		        waypoints:$scope.driveWaypointsArr
		    });
	  	 })
   }
   //骑行规划路线
   $scope.ride = function(){
   		AMap.plugin('AMap.Riding', function() {
	   		 //构造路线导航类
		    var riding = new AMap.Riding({
		        map: map,
		        panel: "panel"
		    }); 
		   	$scope.obj = riding;
		    // 根据起终点经纬度规划驾车导航路线
		    riding.search([$scope.myPosition.longitude,$scope.myPosition.latitude], 
		    	[$scope.endPointLon, $scope.endPointLat],{
		        waypoints:$scope.rideWaypointsArr
		    });
	  	 })
   }
   	//公交规划路线
   	$scope.bus = function(){
	   	AMap.plugin('AMap.Transfer', function() {
	   		 //构造路线导航类
		    var transfer = new AMap.Transfer({
		        map: map,
		        panel: "panel"
		    }); 
		   $scope.obj = transfer;
		    // 根据起终点经纬度规划驾车导航路线
		    transfer.search(new AMap.LngLat($scope.myPosition.longitude,$scope.myPosition.latitude), 
		    	new AMap.LngLat($scope.endPointLon, $scope.endPointLat),{
		        waypoints:$scope.driveWaypointsArr
		    });
	  	 })
   }
   //步行规划路线
   $scope.walk = function(){
   		AMap.plugin('AMap.Walking', function() {
	   		 //构造路线导航类
		    var walking = new AMap.Walking({
		        map: map,
		        panel: "panel"
		    }); 
		   $scope.obj = walking;
		    // 根据起终点经纬度规划驾车导航路线
		    walking.search([$scope.myPosition.longitude,$scope.myPosition.latitude], 
		    	[$scope.endPointLon, $scope.endPointLat],{
		        WalkingOptions:$scope.rideWaypointsArr
		    });
		     
	  	 })
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
			  }

			  function onError (data) {
			    // 定位出错
			    console.log('error=='+JSON.stringify(data));
			   	// my.alert('获取当前定位失败！请稍后尝试。').then(function() {
		      	//      $state.go('index');
		     	// );
		       	$scope.addMap();
		       	
			  }
        })
        // 描述当前经纬度
        var marker = new AMap.Marker({
            position: [longitude, latitude],
            map: map
        });

    }
    $scope.getMap($scope.myPosition.longitude,$scope.myPosition.latitude);

	//订单详情
	$scope.gohomeOrderDetial = function(index){
		// console.log('111==='+index+'   '+JSON.stringify($scope.ReveiveOrders[index]));
		localStorage.setItem('reveiveOrderDetail',JSON.stringify($scope.ReveiveOrders[index]));
		$state.go('visit-gohome-order-detial');
	}

	//关闭底部遮罩层
	$scope.closeBottomPop = function(){
		$scope.getNearbyOrderBtn = true;
		$scope.showBottomPop = false;
	}
	//选择交通方式
	$scope.switchTrafficType = function(pramas){
		$scope.tag.current = pramas;
		$scope.obj.clear();
		if(pramas == 1){
			$scope.drive();
		}else if(pramas == 2){
			$scope.ride();
		}else if(pramas == 3){
			$scope.bus();
		}else if(pramas == 4){
			$scope.walk();
		}
	}

 
})
