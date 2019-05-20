appControllers.controller('user-huabei-charge', function($scope,$http,$state,my,$ionicLoading,$rootScope) {
	$scope.title = '花呗分期收费';
	$scope.btnText = '生成二维码';
	$scope.loading = true;
	$scope.data = {
		produceName:'',
		producePrice:null
	};
	$scope.tag = {
		current:'1'
	};
	$scope.qishu = 12;
	$scope.userCode = '';
	//获取userCode
	// if(localStorage.getItem('huabeiUserCode')){
	// 	$scope.userCode = localStorage.getItem('huabeiUserCode');
	// }else{
	// 	$scope.userCode = userBo.userCode;
	// }
	$http({
        method: 'POST',
        url: ajaxurl + 'huabei/selectAgentCodeAndSign?token=' + $rootScope.token
    }).success(function(data) {
    	if(data.wxHuaBeiBo == null){
    		my.confirm('未注册花呗花呗商家，请先去"我的——支付宝授权"进行支付宝授权，然后在"我的——花呗商家注册"进行注册','','去授权','暂时不了').then(function(){
	            $state.go('userCenter');
	        },function(){
				$state.go("index");
			})
    	}else{
    		if(data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == 1){
	        	$scope.userCode = data.wxHuaBeiBo.userCode;
	        }else if(data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == 2){
	        	my.alert('支付宝商家审核未通过,请重新注册').then(function(){
	        		$state.go('user-huabei-register');
	        	});
	        }else if(data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == null){
	        	my.alert('支付宝正在审核').then(function(){
	        		$state.go('index');
	        	});
	        }else if(data.wxHuaBeiBo.userCode == null && data.wxHuaBeiBo.status == null){
	        	my.confirm('未注册花呗花呗商家，请先去"我的——支付宝授权"进行支付宝授权，然后在"我的——花呗商家注册"进行注册','','去授权','暂时不了').then(function(){
		            $state.go('userCenter');
		        },function(){
					$state.go("index");
				}) 
	        }
    	}
        
    }).error(function(err) {
        my.alert('数据信息获取失败！请稍后尝试。');
    });

	// if($scope.userCode == null){
	// 	my.confirm('未注册花呗花呗商家，请先去"我的——支付宝授权"进行支付宝授权，然后在"我的——花呗商家注册"进行注册','','去授权','暂时不了').then(function(){
 //            $state.go('userCenter');
 //        },function(){
	// 		$state.go("index");
	// 	}) 	
	// }
	
	//获取花呗分期金额
	$scope.stagingAmount = function(){
		$http({
			method: 'post',
			url: ajaxurl + "HuaBei/calculation",
			"data": {'price':$scope.data.producePrice}
		}).success(function(data){
			$scope.bob = data.bob;
			$scope.boa = data.boa;
			$scope.showCharge = true;
		}).error(function(data){
		});
	}
	//选择分期
	$scope.actions = function(parmas,qishu){
		$scope.tag.current = parmas;
		$scope.qishu = qishu;
	}
	
	//生成花呗收费二维码
	$scope.qrCodeCharge = function(){
		if($scope.data.produceName == ''){
			my.alert('请输入商品名称');
		}else if($scope.data.producePrice == null){
			my.alert('请输入商品价格');
		}else{
			$scope.btnText = '正在生成二维码';
			// $scope.loading = false;
			$ionicLoading.show({template: '正在生成二维码...'});
			$http({
				method: 'post',
				url: ajaxurl + "HuaBei/alipay",
				"data": {
					'subject':$scope.data.produceName,
					'price':$scope.data.producePrice,
					'per':$scope.qishu,
					'userCode':$scope.userCode
				}
			}).success(function(data){
				if(JSON.parse(data).code == '00'){
					$scope.showCode = true;
					$scope.loading = true;
					$ionicLoading.hide();
					angular.element("#qrbox").qrcode({ 
						 "render": "canvas"
						,"width": 240
						,"height":240
						,"text": JSON.parse(data).qrcode
					});
				}else{
					my.alert('生成二维码失败,请稍后尝试。');
				}
				
			}).error(function(data){
				my.alert('二维码生成失败，请稍后尝试。').then(function(){
					$scope.btnText = '生成二维码';
				});
			});
		}
	}
	//关闭二维码
	$scope.closeTip = function(){
		$scope.showCode = false;
		$scope.btnText = '生成二维码';
		angular.element("#qrbox").html('');
	}

})
