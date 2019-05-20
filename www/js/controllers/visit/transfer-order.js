appControllers.controller('visit-transfer-order', function($scope, $rootScope, $http, $state,my) {
	$scope.title = '转单';
	$scope.getNearbyOrderBtn = true;
	$scope.myPosition  = JSON.parse(localStorage.getItem('myPosition'));
	$scope.transferOrder  = JSON.parse(localStorage.getItem('reveiveOrderDetail'));
	$scope.clientManagerList = [];
	$scope.clientManagerListLength = null;
	$scope.tag = null;
	$scope.userId = null;
	//画地图
    var map = new AMap.Map('myMapContainer2', {
        center: [$scope.myPosition.longitude, $scope.myPosition.latitude],
        zoom: 12
    });
    //转单
    $scope.goTransferOrder = function(){
    	if($scope.tag == null){
    		my.alert('请选择客户经理');
    	}else{
    		$http({
		        method: 'POST',
		        url: ajaxurl + "wangka/giveOne?token=" + $rootScope.token,
		        data: {
		        	'id':$scope.transferOrder.id,
		        	'userId':$scope.userId
		        }
		    }).success(function(data) {
		       if(data == true){
		       		my.alert('您已转单成功！');
		       }
		    }).error(function() {
		        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
		            // $state.go('index');
		        });
		    });
    	}
    }
    //选择附近订单
    $scope.choseServiceClient = function(index){
    	$scope.userId = $scope.clientManagerList[index].userId;
    	$scope.tag = '1';
    }
    //获取附近客户经理
    $scope.getNearbyClientManager = function(keyword){
    	$http({
	        method: 'get',
	        url: ajaxurl + "wangka/getAreaUsers?token=" + $rootScope.token,
	        params: {
	        	'cateId':$scope.transferOrder.cateId,
	        	'keyword':keyword
	        }
	    }).success(function(data) {
	    	$scope.clientManagerList = data;
	    	$scope.getNearbyOrderBtn = false;
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
	       
	       for(var i=0 in $scope.clientManagerList){
	       		// 描述当前经纬度
	       		if($scope.clientManagerList[i].jingdu!=null && $scope.clientManagerList[i].weidu!=null){
			        // 描述当前经纬度
			        for(var j=0 in markers){
			        	if(i == j){
			        		$scope.clientManagerList[i].imgTag = markers[j].icon;
					        var marker = new AMap.Marker({
					        	icon: markers[j].icon,
					            position: [$scope.clientManagerList[i].jingdu, $scope.clientManagerList[i].weidu],
					            map: map
					        });
			        	}
			        }
			        // 将创建的点标记添加到已有的地图实例：
					map.add(marker);
			        
		       }
	       }
	    }).error(function() {
	        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
	            // $state.go('index');
	        });
	    });
    }

    //关键字搜索
    $scope.lookKeywords = function(keyword){
    	$scope.getNearbyClientManager(keyword);
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
		       	$scope.getNearbyClientManager('');
		       	
			  }
        })
        // 描述当前经纬度
        var marker = new AMap.Marker({
            position: [longitude, latitude],
            map: map
        });

    }
    $scope.getMap($scope.myPosition.longitude,$scope.myPosition.latitude);
	
 
})
