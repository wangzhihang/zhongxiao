appControllers.controller('group-getGroupListByCode', function($scope, $rootScope, $http, $state, unicomm_server, my) {

	$scope.title = "营业执照";
	$scope.input = {"psptId":"","psptTypeCode":{}};
	$scope.resState = false;
	$scope.editHistory = true;
	$scope.delList = false;

	$scope.psptTypeCodeList = [
		  {"id":"4", "name":"营业执照"}
		, {"id":"C", "name":"外交使馆照会"}
		, {"id":"D", "name":"统一社会信用代码证书"}
		, {"id":"L", "name":"社会团体法人登记证书"}
		, {"id":"M", "name":"民办非企业单位登记证书"}
		, {"id":"N", "name":"介绍信"}
		, {"id":"R", "name":"事业单位法人证书"}
		, {"id":"S", "name":"组织机构代码"}
	];
	$scope.input.psptTypeCode = $scope.psptTypeCodeList[0];
	

	$scope.editHistoryText = '编辑'
	$scope.historyList = JSON.parse(localStorage.getItem('historyList'));
	if($scope.historyList == null){
		$scope.historyList = [];
		$scope.isNull = false;
	}else{
		$scope.historyList.reverse();
		$scope.isNull = true;
	}
	//编辑按钮
	$scope.editHistory = function(){
		if($scope.editHistoryText == "编辑"){
			$scope.editHistoryText = "完成";
			$scope.delList = true;
		}else{
			$scope.editHistoryText = "编辑";
			$scope.delList = false;
		}
	}
	//清空每条
	$scope.queryHistory = function(row){
		if($scope.delList){
			$scope.historyList.splice($scope.historyList.indexOf(row),1);
			localStorage.setItem('historyList',JSON.stringify($scope.historyList));
		}else{
			$scope.input.psptId = row;
			$scope.order();
		}
	}
	//清空历史记录
	$scope.clearHistory = function(){
		localStorage.removeItem('historyList');
		$scope.isNull = false;
	}
	//点击查询
	$scope.order = function(){
		//记录查询历史
		if($scope.input.psptId == ""){
			my.alert("请输入营业执照编码").then(function(){
				$scope.resState = false;
			})
		}else{
			$scope.resState = true;
			unicomm_server.getUnicomm({
				  "cmd":"cbss_group_getGroupListByCode"
				, "psptId":$scope.input.psptId
				, "psptTypeCode":$scope.input.psptTypeCode.id
			})
			.then(
				function(result_json){
					if (result_json.status == "1") {
						if(result_json.data.length){
							jike_group_person = {
								  "psptId":$scope.input.psptId
								, "custId":trim(result_json.data[0]["groupCustId"])
								, "custName":trim(result_json.data[0]["groupName"])
							}
							$state.go("group-querygrouplist")
						}else{
							my.alert("该企业没有在联通备案!").then(function(){
								$scope.resState = false;
							})
						}
						if($scope.historyList.toString().indexOf($scope.input.psptId) == -1) {
							$scope.historyList = $scope.historyList.concat($scope.input.psptId);
							localStorage.setItem('historyList',JSON.stringify($scope.historyList));
						}
					} else {
						my.alert("在联通库中没有查到信息!").then(function(){
							$scope.resState = false;
						})
					}
				}
			);
		}

	}
})
