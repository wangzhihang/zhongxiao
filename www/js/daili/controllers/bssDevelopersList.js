appControllers.controller('bss-developers-list', function($scope,$ionicPopup,$rootScope,$ionicLoading,$http,$state,my) {
	$scope.title = 'BSS发展人列表';
	$scope.bssDevelopersList = JSON.parse(localStorage.getItem('bssDevelopersList'));	
	//选择发展人:::保存
	$scope.save = function(index){
		$ionicPopup.confirm({
	    	title: '系统提示',
	    	template: '确认创建BSS工号？',
	    	buttons:[
		    	{
	    			text: '取消',
	   				type: 'button-default',
	   				onTap: function(e) {
				     //console.log('取消提交');
				    }
	  			},
	  			{
	    			text: '确认',
	   				type: 'button-calm',
	   				onTap: function(e) {
	   					$ionicLoading.show({template: '工号添加中...'});
				    	$http({
							method:'post',
							url:ajaxurl + 'bssInfoApp/saveBssInfo?token=' + $rootScope.token,
							data:{
								userName:localStorage.getItem('bssUserName'),
								password:localStorage.getItem('bssUserPwd'),
								province:signInInfo.cbssCode,
								vpnName:'',
								vpnPwd:'',
								developCode:$scope.bssDevelopersList[index].developCode,
								channelName:localStorage.getItem('channelName'),
								channelCode:localStorage.getItem('channelCode'),
								developName:$scope.bssDevelopersList[index].developName,
								developPhone:''
							}
						}).success(function(data){
							$ionicLoading.hide();
							if(data.result == 'true'){
								my.alert('添加成功！');
								//console.log('成功');
							}else{
								my.alert(data.errorMsg);
							}
							$state.go('bss-account-list');
						});
				    }
	  			}
	    	]
	    });
	}
});