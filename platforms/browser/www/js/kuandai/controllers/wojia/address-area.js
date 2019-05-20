appControllers.controller('kuandai-wojia-address-area', function($scope, $state, my, unicomm_server) {
	$scope.title = "地区预判";
	$scope.dataAreas = []
	$scope.area = {"CITY_CODE":{},"INSTALL_ADDRESS":""};
	
	
	// 获取地区 分区
	my.loaddingShow("区域获取中")
	unicomm_server.cbssLogin().then(function(){
		unicomm_server.getUnicomm({
			"cmd":"cbss_lan_getCityList",
			"serviceClassCode":(service_type == "cbss_fixed" ? "30" : "40")
		}).then(function(return_json){
			my.loaddingHide();
			if(return_json.status == "1"){
				for(var i in return_json.data){
					$scope.dataAreas.push({"productName":return_json.data[i].areaName,"id":return_json.data[i].areaCode})
				}
				$scope.area["CITY_CODE"] = $scope.dataAreas[0];
				$scope.maskLayer=true;
			}else{
				my.alert(return_json.data).then(function(){
					$state.go("index");
				});
			}
		})
	},function(){
		$state.go("index");
	})
	

	// 小区
	$scope.addrLi = true;
	$scope.butType = false;		// 查找按钮控制
	$scope.nocity = true;		// 没找到
	$scope.loading = true;

	// 历史
	$scope.historyLi = false;
	$scope.historyTips = true;	// 没有查找历史


	$scope.showHistory = function(){
		$scope.areaHistoryList = JSON.parse(localStorage.getItem("areaHistory"));
		if($scope.areaHistoryList == null){
			$scope.historyTips = false;
		}	
	}
	$scope.showHistory();	//显示搜索历史记录




	$scope.queryaddress=function(){
		if($scope.butType){
			my.alert("数据加载中，请稍后!");
			return false;
		}
		if($scope.area.CITY_CODE['id'] == "84110"){
			my.alert("请选择区域!");
			return false;
		}
		if($scope.area.INSTALL_ADDRESS == ""){
			my.alert("请输入小区关键字!");
			return false;
		}
		
		$scope.butType = true;
		$scope.loading = false;
		$scope.nocity = true;

		$scope.addrLi = false;
		$scope.historyLi = true;

		$scope.addressList = [];

		unicomm_server.cbssLogin().then(
		
			function(){
				unicomm_server.getUnicomm(
					{
						"cmd":"cbss_lan_queryaddresslist"
						,"keyword":$scope.area.INSTALL_ADDRESS
						,"citycode":$scope.area.CITY_CODE['id']
						,"serviceClassCode":(service_type == "cbss_fixed" ? "30" : "40")
					}
				).then(
					function(data){
						$scope.loading = true;
						$scope.butType = false;
						if (data.status == "1"){
							$scope.nocity = true;
							$scope.addressList = data.data;
							$scope.areaHistory();
						} else {
							$scope.addressList = [];
							$scope.nocity = false;
						}
					}
				);
			}
		);
	};


	// 从历史记录里选择文件连接 或 删除
	$scope.queryHistory = function(row){
		if($scope.editHistoryBtn){
			$scope.area["INSTALL_ADDRESS"] = row.key;
			for(var i in $scope.dataAreas){
				if($scope.dataAreas[i]["id"] == row.area["id"]){
					$scope.area["CITY_CODE"] = $scope.dataAreas[i];
				}
			}
			$scope.queryaddress();
		}else{
			$scope.clearHistory(row.area, row.key);
		}
	}

	// 添加搜索历史
	$scope.areaHistory = function(){
		var areaHistory = localStorage.getItem("areaHistory");
		var areaJson = {"area":$scope.area["CITY_CODE"], "key":$scope.area.INSTALL_ADDRESS};
		if(areaHistory == null){
			localStorage.setItem("areaHistory",JSON.stringify([areaJson]) );
		}else{
			$scope.clearHistory($scope.area["CITY_CODE"], $scope.area.INSTALL_ADDRESS);
			var areaHistoryJson = JSON.parse(localStorage.getItem("areaHistory"));
			localStorage.setItem("areaHistory",JSON.stringify([areaJson].concat(areaHistoryJson) ) )
		}
	}


	// 清除历史记录
	$scope.clearHistory = function(){
		var area = arguments[0];
		var key  = arguments[1];

		if(area && key){
			var arrTemp = [];
			var areaHistory = JSON.parse(localStorage.getItem("areaHistory"));
			for(var i in areaHistory){
				if(areaHistory[i].area.id == area.id && areaHistory[i].key== key){
				}else{
					arrTemp.push(areaHistory[i]);
				}
			}
			localStorage.setItem("areaHistory",JSON.stringify(arrTemp) )
		}else{
			localStorage.removeItem('areaHistory');
		}
		$scope.showHistory();
	}



	$scope.editHistoryText = "编辑";
	$scope.editHistoryBtn = true;
	$scope.editHistory = function(){
		if($scope.editHistoryText == "编辑"){
			$scope.editHistoryText = "完成";
			$scope.editHistoryBtn = false;
		}else{
			$scope.editHistoryText = "编辑";
			$scope.editHistoryBtn = true;
		}
	}


	$scope.order = function(id){

		kuandai_combination_address["addressCode"] = $scope.addressList[id].addressCode;
		kuandai_combination_address["addressName"] = $scope.addressList[id].addressName;
		kuandai_combination_address["citycode"] = $scope.area.CITY_CODE['id'];

		my.loaddingShow('地址资源预判中')
		unicomm_server.cbssLogin().then(
			function(){
				unicomm_server.getUnicomm(
					{
						"cmd":"cbss_lan_queryaddresslanlist",
						"addresscode":String(kuandai_combination_address["addressCode"]),
						"citycode":String(kuandai_combination_address["citycode"]),
						"exchcode":($scope.addressList[id].execCode ? $scope.addressList[id].execCode : ""),
						"serviceClassCode":(service_type == "cbss_fixed" ? "30" : "40")
					}
				).then(
					function(data){
						if(data.status == 1){
							my.loaddingHide();
							kuandai_combination_address["detaileds"] = data.data;
							$state.go("kuandai-wojia-address-detailed");
						}else{
							$scope.msgAlert(data.data.message ? data.data.message : data.data);
						}
					}, function(data){
						$scope.msgAlert(data.data.message ? data.data.message : data.data);
					}
				);
			}
		);
	}

	$scope.msgAlert = function(template){
		my.loaddingHide();
		my.alert(template)
	}
});