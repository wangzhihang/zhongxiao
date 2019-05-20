appControllers.controller('assert-user', function($scope,$http,$state, unicomm_server, my) {
	$scope.title = "老客户维系";
	$scope.resState = true;
	$scope.loading = false;
	$scope.queryBtn = true;
	$scope.btnText = "号码诊断";
	$scope.data = {tel:''};
	$scope.provinceActivityList = [];
	$scope.cityActivityList = [];
	//输入验证
	$scope.telChange = function(){
		$scope.data.tel = telFormat($scope.data.tel);
		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
			$scope.queryBtn = true;
			$scope.dataInfo = false;
			$scope.netType2 = false;
		}
	};
	//号码诊断
	$scope.query = function(){
		$scope.loading = true;
		$scope.resState = true;
		//
		unicomm_server.marktingLogin().then(function(){
			unicomm_server.getUnicomm({"cmd":"markting_getData",serialNumber:$scope.data.tel.replace(/[^\d]/g, "")})
			  .then(function(return_json){
				console.log(JSON.stringify(return_json));
				$scope.resState = false;  
				if(return_json.status == '1'){
					$scope.loading = false;
					$scope.dataInfo = true;
					$scope.queryBtn = false;
					//province::activity
					$scope.provinceActivityList = return_json.provinceActivityList;
					//city::activity
					$scope.cityActivityList = return_json.cityActivityList;
					//2g => 4g ::if
					if(return_json.baseAccountInfo.netType == '2G' || return_json.baseAccountInfo.netType == '3G'){
						$scope.netType2 = true;
					}
					// 入口类型
					if (assertUserType === '000001' && $scope.netType2) {
						$scope.dataInfo = false;
					}else{
						$scope.netType2 = false;
					}
					if (assertUserType === '' || assertUserType === undefined) {
						$scope.netType2 = true;
					}
				}else{
					my.alert('尚未查询到相关信息，请重新输入手机号码！').then(function(){
						$scope.loading = false;
					});
				}
			  }, function(data) {

			  });
		 });
	};
	//查看省份活动
	$scope.showProvinceData = function(index){
		$scope.provinceActivityList[index].showChildCont = !$scope.provinceActivityList[index].showChildCont;
	};
	//查看城市活动列表
	$scope.showCityData = function(){
		$scope.showCityChildCont = !$scope.showCityChildCont;
	};
	//2g升级为4G
	$scope.upgrade4g = function(){
//		my.alert("测试：升级为4G...");
	};
	//办理
	$scope.order = function(index){
//		my.alert('办理...');
	};

})

// 156 1936 9426
// 186 9186 9308