appControllers.controller('bss-account-list', function($scope,$http,my,$state,$ionicPopup,$rootScope) {
	$scope.title = 'BSS工号列表';
	$scope.bssInfoListLength = null;
	$scope.tag = null;
	//初始化信息列表
	getInfoList();
	//获取数据表
	function getInfoList(){
		$scope.loading = true;
		$scope.bssInfoList = [];
		$http({
			method:'get',
			url:ajaxurl + 'bssInfoApp/queryAgencyBssList?token=' + $rootScope.token
		}).success(function(data){
			$scope.loading = false;
			//console.log(JSON.stringify(data));
			$scope.bssInfoList = data['bssInfoList'];	
			$scope.bssInfoListLength = $scope.bssInfoList.length;
			if($scope.tag == 1 && $scope.bssInfoListLength == 1){
				var myPopup = $ionicPopup.show({
	               title: '提示信息',
	               template: '<div class="txtCenter">剩余工号：'+data.bssInfoList[0].userName+'<br/>设为默认吗？</div>',
	               buttons:[
	               	{text:'取消'},
	               	{
	               		text:'<b>确定</b>',
	               		type:'button-positive',
	               		onTap:function(){
	               			$scope.bssDefault(data.bssInfoList[0].id);
	               		}
	               	},
	               ]
	             });
			}
		});
	};
	
	//修改密码
	$scope.changePwd = function(index){
		localStorage.setItem('id',$scope.bssInfoList[index].id);
		localStorage.setItem('userName',$scope.bssInfoList[index].userName);
		localStorage.setItem('password',$scope.bssInfoList[index].password);
		localStorage.setItem('developName',$scope.bssInfoList[index].developName);
		$state.go('change-bss-pwd');
	}

	//权限分配
	$scope.powerDivsion=function(index){
		localStorage.setItem('id',$scope.bssInfoList[index].id);
		my.alert('请在电脑端分配权限');
	}
	//bss默认工号
	$scope.bssDefault = function(id){
		$http({
			method: 'post',
			url: ajaxurl + 'bssInfoApp/setAllDeptDefaultBss?token=' + $rootScope.token,
			data: {id:id}
		}).success(function (data) {
			if(data == true){
				my.alert('该工号已设置为默认BSS工号。');
			}
		}).error(function () {
			my.alert('数据信息获取失败，请稍后尝试！');
		});
	}
	//删除账号提示框
        $scope.showPopu = function(index) {
           	$scope.bssId=$scope.bssInfoList[index].id;
           	// $scope.bssUserName=$scope.bssInfoList[index].userName;
           		var myPopup = $ionicPopup.show({
	               title: '提示信息',
	               template: '你确定要删除该账号？',
	               buttons:[
	               	{text:'取消'},
	               	{
	               		text:'<b>确定</b>',
	               		type:'button-positive',
	               		onTap:function(){
	               			//console.log("确定删除");
	               			$http({
	               				method:'post',
	               				url:ajaxurl+'bssInfoApp/delBssAccount?token=' + $rootScope.token,
	               				data:{id:$scope.bssId}
	               			}).success(function(data){
	               				$scope.tag = 1;
	               				getInfoList();
	               			})
	               		}
	               	},
	               ]
	             });	
             
           };	
});