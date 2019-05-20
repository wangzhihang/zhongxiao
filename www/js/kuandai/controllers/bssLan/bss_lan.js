appControllers.controller('kuandai-bss-lan-address-area', function($scope, $state, $ionicPopup,unicomm_server, my)
{
	$scope.title = '地址预判';
	$scope.input = {"keyword":"", "page":"1"}
	$scope.addressList = [];

	$scope.loading = true;
	$scope.noMore = false;

	$scope.resState = false;	// 搜索按钮
	
	$scope.addrLi = true;	// 搜索记录
	$scope.addrList = true;	// 搜索记录列表
	$scope.nocity = true;	// 搜索记录为空

	$scope.historyLi = false;	// 搜索历史列表
	$scope.historyTips = true;	// 搜索历史为空


	$scope.queryaddress = function(){
		$scope.loading = false;
		$scope.resState = true;
		$scope.historyLi = true;
		if($scope.input.keyword == ""){
			my.alert('请输入关键词进行查询');
			$scope.resState = false;
			$scope.historyLi = false;
			$scope.loading = true;
		}else{
			$scope.addressList = [];
			$scope.input.page = "1";
			unicomm_server.bssLogin().then(function(){
				$scope.bss_lan_queryaddressList()
			});
		}
	}


	$scope.bss_lan_queryaddressList = function(){
		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_queryaddressList"
			, "pagesize":"20"
			, "keyword":$scope.input.keyword
			, "page":String($scope.input.page)
		}).then(function(return_json){
			if(return_json.status == '1'){
				var i = 0;
				$("<table>" + return_json.data + "</table>").find('tr').each(function(index, el) {
					$scope.addressList.push({"addresscode":$(this).find('td:eq(0)').text(), "addressname":$(this).find('td:eq(1)').text()});
					i++;
				});
				$scope.addrLi = false;
				$scope.addrList = false;
				$scope.nocity = true;
				if($scope.input.page == "1"){
					$scope.areaHistory();
				}
			//	console.log(i)
				if(i < 20){
					$scope.noMore = true;
				}else{
					$scope.domore = true;
				}
			}else{
				if(Number($scope.input.page) > 1){
					$scope.noMore = true;
				}else{
					my.alert(return_json.data);
					$scope.addrLi = false;
					$scope.nocity = false;
				}
			}
			$scope.loading = true;
			$scope.resState = false;
		})
	}


	$scope.loadOlderStories = function(){
		if($scope.domore){
			$scope.domore = false;
			$scope.loading = false;
			$scope.resState = true;
			$scope.input.page = Number($scope.input.page)+1;
			$scope.bss_lan_queryaddressList();
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
	}


	$scope.showHistory = function(){
		$scope.areaHistoryList = JSON.parse(localStorage.getItem("bss_lan_areaHistory"));
		if($scope.areaHistoryList == null || $scope.areaHistoryList.length < 1){
			$scope.historyTips = false;
		}else{
			$scope.historyTips = true;
		}
	}
	$scope.showHistory();	//显示搜索历史记录



	// 从历史记录里选择文件连接 或 删除
	$scope.queryHistory = function(row){
		if($scope.editHistoryBtn){
			$scope.input.keyword = row.key;
			$scope.queryaddress();
		}else{
			$scope.clearHistory(row.key);
		}
	}

	// 添加搜索历史
	$scope.areaHistory = function(){
		var areaHistory = localStorage.getItem("bss_lan_areaHistory");
		var areaJson = {"key":$scope.input.keyword};
		if(areaHistory == null){
			localStorage.setItem("bss_lan_areaHistory",JSON.stringify([areaJson]) );
		}else{
			$scope.clearHistory($scope.input.keyword);
			var areaHistoryJson = JSON.parse(localStorage.getItem("bss_lan_areaHistory"));
			localStorage.setItem("bss_lan_areaHistory",JSON.stringify([areaJson].concat(areaHistoryJson)))
		}
	}


	// 清除历史记录
	$scope.clearHistory = function(){
		var key  = arguments[0];
		if(key){
			var arrTemp = [];
			var areaHistory = JSON.parse(localStorage.getItem("bss_lan_areaHistory"));
			for(var i in areaHistory){
				if(areaHistory[i].key== key){
				}else{
					arrTemp.push(areaHistory[i]);
				}
			}
			localStorage.setItem("bss_lan_areaHistory",JSON.stringify(arrTemp) )
		}else{
			localStorage.removeItem('bss_lan_areaHistory');
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




	$scope.order = function(i){
		kuandai_bssLan["address"]["addresscode"] = $scope.addressList[i]["addresscode"];
		kuandai_bssLan["address"]["addressname"] = $scope.addressList[i]["addressname"];
		$scope.bsslan_queryaddressList();
	}

	// 预判
	$scope.bsslan_queryaddressList = function(){

		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_queryinfo"
			, "addressid":kuandai_bssLan["address"]["addresscode"]
		}).then(function(return_json){
			if(return_json.status == '1'){
				var json = $(return_json.data.resource);
				kuandai_bssLan["address"]["prompt"] = 		return_json.data.prompt;		// 预判 结果(bss_lan_occupy需要)
				kuandai_bssLan["address"]["localnetid"] = 	return_json.data.localnetid;	// 下一个请求是需要

				kuandai_bssLan["address"]["projectcode"] = 	return_json.data.projectcode;
				kuandai_bssLan["address"]["projectname"] = 	return_json.data.projectname;
				kuandai_bssLan["address"]["projectdesc"] = 	return_json.data.projectdesc;	// (bss_lan_occupy需要)

				kuandai_bssLan["address"]["accmode"] = 		json.find('td:eq(0)').text() 	// 接入方式
				kuandai_bssLan["address"]["accmodeName"] = 	json.find('td:eq(1)').text() 	// 接入方式名称
				kuandai_bssLan["address"]["resources"] = 	json.find('td:eq(2)').text()	// 资源
				kuandai_bssLan["address"]["portnum"] = 		json.find('td:eq(3)').text() 	// 端口总数
				kuandai_bssLan["address"]["idlecount"] = 	json.find('td:eq(4)').text() 	// 端口空闲数
				kuandai_bssLan["address"]["exchcode"] = 	json.find('td:eq(5)').text() 	// 局向编码
				kuandai_bssLan["address"]["exchname"] = 	json.find('td:eq(6)').text() 	// 局向名称
				kuandai_bssLan["address"]["speed"] = 		json.find('td:eq(7)').text() 	// 支持速率

				if(Number(kuandai_bssLan["address"]["idlecount"]) < 1){
					my.alert("空闲端口数为 0,请返回重新选择");
				}else{
					$state.go("kuandai-bss-lan-address-detailed");
				}
			}else{
				my.alert(return_json.data);
			}
		})
	}

})




.controller('kuandai-bss-lan-address-detailed', function($scope, $state, unicomm_server, my){
	$scope.title = '详细地址'
	$scope.input = {"list":"", "addressname":kuandai_bssLan["address"]["addressname"]};
	$scope.selected = "";
	$scope.resState = true;
	$scope.loading = false;
	unicomm_server.getUnicomm({
		  "cmd":"bss_lan_getyupan"
		, "accmode": 	kuandai_bssLan["address"]["accmode"]
		, "idlecount": 	kuandai_bssLan["address"]["idlecount"]
		, "exchcode": 	kuandai_bssLan["address"]["exchcode"]
		, "localnetid": kuandai_bssLan["address"]["localnetid"]
		, "addresscode":kuandai_bssLan["address"]["addresscode"]
	}).then(function(return_json){
		if(return_json.status == '1'){
			var json = [];
			$("<select>" + return_json.data + "</select>").each(function(index, el) {
				json.push({"serviceKind":$(this).val(), "serviceName":$(this).text()})
			});
			$scope.input.list = json;
			$scope.selected = $scope.input.list[0];
			$scope.loading = true;
			$scope.resState = false;
		}else{
			my.alert(return_json.data);
		}
	})

	$scope.order = function(){
		$scope.resState = true;
		if(kuandai_bssLan["address"]["addressname"] == $scope.input.addressname){
			my.alert('请修改"装机地址"，精确到门牌号。').then(function(){
				$scope.resState = false;
			})
		}else{
			kuandai_bssLan["address"]["setupaddress"] = $scope.input.addressname;
			kuandai_bssLan["serviceKind"] = $scope.selected["serviceKind"];
			$state.go('authentication-device');
		}
	}

})


// 号码接入方式
.controller('kuandai-bss-lan-lan_getinnetmethod', function($scope, $state, unicomm_server, my){
	$scope.title = '接入方式';
	$scope.innetMethodList = [];
	$scope.loading = false;

	$scope.bss_lan_getinnetmethod = function()
	{
		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_getinnetmethod"
			, "accmode":kuandai_bssLan["address"]["accmode"]
			, "servicekind":kuandai_bssLan["serviceKind"]
		}).then(function(return_json){
			if(return_json.status == '1'){
				var json = [];
				$("<select>" + return_json.data + "</select>").each(function(index, el) {
					var innetMethod = $(this).val();
					if(innetMethod != null && innetMethod != "-1"){
						json.push({"innetMethod":$(this).val(), "innetMethodName":$(this).text()})
					}
				});
				$scope.innetMethodList = json;
				$scope.loading = true;
			}else{
				my.alert(return_json.data);
				$scope.loading = true;
			}
		},function(){
			$scope.bss_lan_getinnetmethod();
		})
	}
	$scope.bss_lan_getinnetmethod();
		
	$scope.order = function(i){
		kuandai_bssLan["innetMethod"] = $scope.innetMethodList[i]["innetMethod"]
		$scope.bss_lan_occupy();
	}


	// 占据
	$scope.bss_lan_occupy = function(){
			
		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_occupy"
			, "accmode": 	kuandai_bssLan["address"]["accmode"]
			, "exchcode": 	kuandai_bssLan["address"]["exchcode"]
			, "exchname": 	kuandai_bssLan["address"]["exchname"]
			, "portnum": 	kuandai_bssLan["address"]["portnum"]
			, "idlenum": 	kuandai_bssLan["address"]["idlecount"]
			, "speed": 		kuandai_bssLan["address"]["speed"]
			, "serviceKind":kuandai_bssLan["serviceKind"]
			, "innetMethod":kuandai_bssLan["innetMethod"]
			, "local_netid":kuandai_bssLan["address"]["localnetid"]
			, "address_id": kuandai_bssLan["address"]["addresscode"]
			, "address_name":kuandai_bssLan["address"]["addressname"]
			, "projectcode":kuandai_bssLan["address"]["projectcode"]
			, "projectname":kuandai_bssLan["address"]["projectname"]
			, "projectdesc":kuandai_bssLan["address"]["projectdesc"]
			, "prompt": 	kuandai_bssLan["address"]["prompt"]
			, "flag": 		"0000"
			, "cardid": 	authentication["cardId"]
		}).then(function(return_json){
			if(return_json.status == '1'){
				kuandai_bssLan["serialNumber"] = return_json.data;
				$state.go("kuandai-bss-lan-number-area");
			}else{
				my.alert(return_json.data);
			}
		},function(){
			$scope.bss_lan_occupy();
		})
	}
})


// 校园宽带
// .controller('kuandai-bss-schoollan-getSchoolList', function($scope, $state, unicomm_server, my){

// 	unicomm_server.getUnicomm({
// 			  "cmd":"bss_schoollan_getSchoolList"
// 			, "innetMethod": kuandai_bssLan["innetMethod"]
// 		}).then(function(return_json){
// 			if(return_json.status == '1'){
// 				kuandai_bssLan["groupSubmitId"] = return_json.data;
// 				//kuandai_bssLan["serialNumber"] = return_json.data;
// 				$state.go("kuandai-bss-lan-number-area");
// 			}else{
// 				my.alert(return_json.data);
// 			}
// 		})
// })


// 号码放号地区
.controller('kuandai-bss-lan-number-area', function($scope, $state, unicomm_server, my){
	$scope.title = '放号地区';
	$scope.number_area = [];
	$scope.loading = false;

	$scope.bss_lan_numberArea = function()
	{
		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_numberArea"
			, "localNetId":kuandai_bssLan["address"]["localnetid"]
			, "exchCode":kuandai_bssLan["address"]["exchcode"]
			, "serviceKind":kuandai_bssLan["serviceKind"]
			, "serialNumber":kuandai_bssLan["serialNumber"]
			, "address_id":kuandai_bssLan["address"]["addresscode"]
			, "innerMethod":kuandai_bssLan["innetMethod"]
			, "accMode":kuandai_bssLan["address"]["accmode"]
		}).then(function(return_json){
			if(return_json.status == '1'){
				$scope.number_area = return_json.data.area;
				$scope.loading = true;
			}else{
				my.alert(return_json.data)
				$scope.loading = true;
			}
		},function(){
			$scope.bss_lan_numberArea();
		})
	}
	$scope.bss_lan_numberArea();

	$scope.order = function(i){
		kuandai_bssLan["accAreaId"] = $scope.number_area[i]["value"];
		kuandai_bssLan["accAreaCode"] = $scope.number_area[i]["name"];
		kuandai_bssLan["accAreaName"] = $scope.number_area[i]["name"];
		$state.go("kuandai-bss-lan-number-list");
	}
})



// 选择号码
.controller('kuandai-bss-lan-number-list', function($scope, $state, unicomm_server, my){
	$scope.title = '选择号码';
	$scope.numberList = [];
	$scope.loading = false;

	$scope.bss_lan_numberList = function()
	{
		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_numberList"
			, "localNetId":kuandai_bssLan["address"]["localnetid"]
			, "exchCode":kuandai_bssLan["address"]["exchcode"]
			, "serviceKind":kuandai_bssLan["serviceKind"]
			, "serialNumber":kuandai_bssLan["serialNumber"]
			, "address_id":kuandai_bssLan["address"]["addresscode"]
			, "innerMethod":kuandai_bssLan["innetMethod"]
			, "accAreaId":kuandai_bssLan["accAreaId"]
			, "accAreaCode":kuandai_bssLan["accAreaCode"]
			, "accMode":kuandai_bssLan["address"]["accmode"]
		}).then(function(return_json){
			if(return_json.status == '1'){
				kuandai_bssLan["areaCode"] = return_json.areaCode;
				kuandai_bssLan["serviceAreaId"] = return_json.serviceAreaId;
				$scope.numberList = return_json.data;
				$scope.loading = true;
			}else{
				my.alert(return_json.data);
				$scope.loading = true;
			}
		}, function(){
			$scope.bss_lan_numberList();
		})
	};
	$scope.bss_lan_numberList();

	$scope.order = function(i){
		kuandai_bssLan["lanaccount"] = $scope.numberList[i]["mobileNumber"];
		$state.go("kuandai-bss-lan-getLanType");
	}
})


// 宽带类型 10M、50M等
.controller('kuandai-bss-lan-getLanType', function($scope, $state, unicomm_server){

	$scope.title = '选择宽带类型';
	$scope.loading = true;
	$scope.ListContent = [false, false];
	$scope.typeList = [
		  {"value":"10","name":"10M带宽","show":false}
		, {"value":"20","name":"20M带宽","show":false}
		, {"value":"50","name":"50M带宽","show":false}
		, {"value":"100","name":"100M带宽","show":false}
		, {"value":"300","name":"300M带宽","show":false}
	];
	$scope.bss_lan_getLanType = function(){
		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_getLanType"
			, "innetMethod":kuandai_bssLan["innetMethod"]
			, "lanaccount":kuandai_bssLan["lanaccount"]
		}).then(function(return_json){
			$scope.loading = false;
			if(return_json.status == '1'){
				for (var i = return_json.data.length - 1; i >= 0; i--) {
					var key = ["10", "20","50","100","300"].indexOf(return_json.data[i].value);
					if(key != -1){
						$scope.typeList[key].show = true;
					}
				}
				$scope.ListContent[0] = true;
			}else{
				$scope.ListContent[1] = true;	
			}
		},function(){
			$scope.bss_lan_getLanType();
		})
	}
	$scope.bss_lan_getLanType();
	

	$scope.order = function(i){
		kuandai_bssLan["bandWidth"] = $scope.typeList[i]["value"];
		kuandai_bssLan["bandWidthName"] = $scope.typeList[i]["name"];
		$state.go("kuandai-bss-lan-getAreaTownInfo");
	}
})


// !!!!!!! 获取不需要页面
// 获取所属地区信息，返回为842606001-宽带事业部-市区 
.controller('kuandai-bss-lan-getAreaTownInfo', function($scope, $state, unicomm_server, my){


	$scope.title = '所属地区';
	$scope.areaList = [];
	$scope.loading = false;
	$scope.bss_lan_getAreaTownInfo = function()
	{
		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_getAreaTownInfo"
		}).then(function(return_json){
			if(return_json.status == '1'){
				return_json.data.shift();
				$scope.areaList = return_json.data;
				$scope.loading = true;
			}else{
				my.alert(return_json.data);
				$scope.loading = true;
			}
		},function(){
			$scope.bss_lan_getAreaTownInfo();
		})
	}
	$scope.bss_lan_getAreaTownInfo();

	$scope.order = function(i){
		kuandai_bssLan["areaTownId"] = $scope.areaList[i]["value"];
		$state.go("kuandai-bss-lan-product-list");
	}
})



// 宽带产品
.controller('kuandai-bss-lan-product-list', function($scope, $state, unicomm_server, my){

	$scope.title = '选择宽带产品';
	$scope.productList = [];
	$scope.loading = false;

	$scope.bss_lan_getSoureDealerId = function(){
		unicomm_server.getUnicomm({
			  "cmd":"bss_lan_getSoureDealerId"
			, "bandWidth":kuandai_bssLan["bandWidth"]
			, "accMode":kuandai_bssLan["address"]["accmode"]
			, "serviceId":kuandai_bssLan["lanaccount"]
			, "projectInfo":kuandai_bssLan["address"]["projectcode"]
		}).then(function(return_json){
			if(return_json.status == '1'){
				kuandai_bssLan["developChannel"] = return_json.data;
				$scope.bss_lan_getProductList();
			}else{
				my.alert(return_json.data);
				$scope.loading = true;
			}
		}, function(){
			$scope.bss_lan_getSoureDealerId();
		})
	}
	$scope.bss_lan_getSoureDealerId();

	$scope.bss_lan_getProductList = function(){
		var json = {
			  "cmd":"bss_lan_getProductList"
			, "lanaccount":kuandai_bssLan["lanaccount"]
			, "innetMethod":kuandai_bssLan["innetMethod"]
			, "bandWidth":kuandai_bssLan["bandWidth"]
			, "projectInfo":kuandai_bssLan["address"]["projectcode"]
			, "developChannel":kuandai_bssLan["developChannel"]
			, "accMode":kuandai_bssLan["address"]["accmode"]
		}
		if(service_type == "schoolLan"){
			// 校园宽带
			json["cmd"] = "bss_schoolLan_getProductList";
			json["payType"] = "2";
		}
		unicomm_server.getUnicomm(json).then(function(return_json){
			if(return_json.status == '1'){
				return_json.data.shift();
				$scope.productList = return_json.data;
				$scope.loading = true;
			}else{
				my.alert(return_json.data);
				$scope.loading = true;
			}
		}, function(){
			$scope.bss_lan_getProductList();
		})
	}
	$scope.order = function(i){
		kuandai_bssLan["productId"] = $scope.productList[i]["value"];
		kuandai_bssLan["productName"] = $scope.productList[i]["name"];
		//$state.go("kuandai-bss-lan-develop-dealer")
		// 先跳过实施人
		if(service_type == "schoolLan"){
			$state.go("kuandai-schoollan-getGropuList");
		}else{
			$state.go("kuandai-bss-lan-select-equipment");
		}
	}
})

// 校园宽带 获取集团信息 参考固带移
.controller('kuandai-schoollan-getGropuList', function($scope, $state, unicomm_server, my){


	$scope.title = '校园信息';
	$scope.input = {"groupkeyword":""};
	$scope.groupList = [];
	//输入关键词
	$scope.loading = true;
	$scope.resState = false;
	$scope.list = true;

	$scope.getList = function(){
		if($scope.input.groupkeyword == ""){
			my.alert("请输入关键字！")
			.then(function(){
				$scope.loading = true;
				$scope.list = true;
				$scope.resState = false;
			});
		}else{
			$scope.loading = false;
			$scope.resState = true;
			$scope.historyLi = true;
			$scope.list = true;
			unicomm_server.bssLogin().then(function(){
				unicomm_server.getUnicomm({
					  "cmd":"bss_grouplan_getGroupList"
					, "groupkeyword":$scope.input.groupkeyword
				}).then(function(return_json){
					if(return_json.status == "1"){
						return_json.data.shift();
						$scope.groupList = return_json.data;
						$scope.loading = true;
						$scope.list = false;
						$scope.resState = false;
						if($scope.groupList.length){
							$scope.areaHistory();
						}else{
							my.alert("未找到相关机构，请修改关键字，重新查找！")
						}
					}else{
						my.alert("未找到相关机构，请修改关键字，重新查找！")
						.then(function(){
							$scope.loading = true;
							$scope.resState = false;
							$scope.list = true;
						});
					}
				})

			})
		}
	}

	$scope.order = function(i){
		kuandai_bssLan["groupId"] = $scope.groupList[i].value;
		kuandai_bssLan["groupName"] = $scope.groupList[i].name;
		kuandai_bssLan["groupkeyword"] = $scope.input.groupkeyword;
		$state.go("kuandai-schoollan-groupCheck");
	}


	// 历史记录
	$scope.showHistory = function(){
		$scope.areaHistoryList = JSON.parse(localStorage.getItem("bss_lan_group_list"));
		if($scope.areaHistoryList == null || $scope.areaHistoryList.length < 1){
			$scope.historyTips = false;
		}else{
			$scope.historyTips = true;
		}
	}
	$scope.showHistory();	//显示搜索历史记录


	// 从历史记录里选择文件连接 或 删除
	$scope.queryHistory = function(row){
		if($scope.editHistoryBtn){
			$scope.input.groupkeyword = row.key;
			$scope.getList();
		}else{
			$scope.clearHistory(row.key);
		}
	}
	// 添加搜索历史
	$scope.areaHistory = function(){
		var areaHistory = localStorage.getItem("bss_lan_group_list");
		var areaJson = {"key":$scope.input.groupkeyword};
		if(areaHistory == null){
			localStorage.setItem("bss_lan_group_list",JSON.stringify([areaJson]) );
		}else{
			$scope.clearHistory($scope.input.groupkeyword);
			var areaHistoryJson = JSON.parse(localStorage.getItem("bss_lan_group_list"));
			localStorage.setItem("bss_lan_group_list",JSON.stringify([areaJson].concat(areaHistoryJson)))
		}
	}
	// 清除历史记录
	$scope.clearHistory = function(){
		var key  = arguments[0];
		if(key){
			var arrTemp = [];
			var areaHistory = JSON.parse(localStorage.getItem("bss_lan_group_list"));
			for(var i in areaHistory){
				if(areaHistory[i].key== key){
				}else{
					arrTemp.push(areaHistory[i]);
				}
			}
			localStorage.setItem("bss_lan_group_list",JSON.stringify(arrTemp) )
		}else{
			localStorage.removeItem('bss_lan_group_list');
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

})


.controller('kuandai-schoollan-groupCheck', function($scope, $state, unicomm_server, my){


	$scope.title = '归集信息';
	$scope.areaList = [];
	$scope.loading = false;
	unicomm_server.getUnicomm({
		   "cmd":"bss_schoolLan_groupCheck"
		  , "lanaccount":kuandai_bssLan["lanaccount"]
		  , "groupId":kuandai_bssLan["groupId"]
		  , "groupName":kuandai_bssLan["groupName"]
	}).then(function(return_json){
		if(return_json.status == '1'){
			// 返回参考固带移这个接口
			$scope.loading = true;
		}else{
			my.alert(return_json.data);
			$scope.loading = true;
		}
	})

	$scope.order = function(i){
		kuandai_bssLan["groupCheck"] = "";
		$state.go("kuandai-schoollan-groupSubmit");
	}
})


.controller('kuandai-schoollan-groupSubmit', function($scope, $state, unicomm_server, my){


	$scope.title = '归集信息';
	$scope.areaList = [];
	$scope.loading = false;
	unicomm_server.getUnicomm({
		   "cmd":"bss_schoolLan_groupSubmit"
		  , "submitParam":kuandai_bssLan["groupCheck"]
	}).then(function(return_json){
		if(return_json.status == '1'){
			// 返回参考固带移这个接口
			$scope.loading = true;
		}else{
			my.alert(return_json.data);
			$scope.loading = true;
		}
	})

	$scope.order = function(i){
		
		$state.go("kuandai-bss-lan-select-equipment");
	}
})

.controller('kuandai-bss-lan-develop-dealer', function($scope, $state, unicomm_server, my){

	$scope.title = '实施人';
	$scope.dealerList = [];
	$scope.loading = false;
	unicomm_server.getUnicomm({
		  "cmd":"bss_lan_getDevelopDealer"
		, "projectCode":kuandai_bssLan["address"]["projectcode"]
	}).then(function(return_json){
		if(return_json.status == '1'){
			$scope.dealerList = return_json.data;
			$scope.loading = true;
		}else{
			my.alert(return_json.data);
			$scope.loading = true;
		}
	})

	$scope.order = function(i){
		kuandai_bssLan["developerDealer"] = $scope.dealerList[i]["value"] ? $scope.dealerList[i]["value"] : "";
		$state.go("kuandai-bss-lan-select-equipment");
	}
})

//选择设备

appControllers.controller('kuandai-bss-lan-select-equipment', function($scope, $state,  $ionicPopup, $cordovaBarcodeScanner, my) {
	$scope.title = "选择设备";
	$scope.mac = {"tvMacAddress":""}

	$scope.select = {"tvLi":{}, "ftthLi":{}}

	// 机顶盒选项
	$scope.tvList = [
		{"id":"0","productName":"用户自备(￥:0.00)","price":"0"},
		{"id":"1","productName":"电视机顶盒款(￥:190.00)","price":"190"},
		{"id":"2","productName":"电视机顶盒代收款(￥:190.00)","price":"190"}
	];
	$scope.select.tvLi = $scope.tvList[2];

	$scope.switchTv = function(id){
		if(id === "0"){
			$scope.macAddressShow = false;
			$scope.mac.tvMacAddress = "";
		}else{
			$scope.macAddressShow = true;
		}
	}
	$scope.switchTv($scope.select.tvLi["id"]);

	$scope.ftthShow = true;
	$scope.ftthList = [
		{"id":"0","productName":"用户自备(￥:0.00)","price":"0"},
		{"id":"1","productName":"ONU终端设备代收款(￥:180.00)","price":"180"}
	];
	if(kuandai_bssLan["innetMethod"] == "21"){
		$scope.ftthShow = false;
		$scope.select.ftthLi = $scope.ftthList[1];
	}else{
		$scope.select.ftthLi = $scope.ftthList[0];
	}



	$scope.order = function(){

		if($scope.select.tvLi["id"] == "0" || $scope.mac.tvMacAddress.length > 1){
			kuandai_bssLan["tvMacAddress"] = $scope.mac.tvMacAddress;
			kuandai_bssLan["tvInfo"] = $scope.select.tvLi;
			kuandai_bssLan["ftthInfo"] = $scope.select.ftthLi;
			$state.go("kuandai-bss-lan-confirmOrder");
		}else{
			my.alert("请填写正确的机顶盒串码，可以直接扫描条形或二维码!")
		}
	}


	$scope.tvMac = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					var txt = barcodeData.text.replace(/[^A-Za-z0-9]/g,"");
					$scope.mac.tvMacAddress = txt.substring(0, 3) == "MAC" ? txt.substring(3) : txt;
				}
			});
	};
})

.controller('kuandai-bss-lan-confirmOrder', function($scope, $state, my){

	$scope.title = '单宽订单确认';
	$scope.input = {
		  "name":authentication["name"]
		, "cardId":authentication["cardId"]
		, "number":authentication["contractNumber"]
		, "type":kuandai_bssLan["bandWidthName"]
		, "preFee":""
		, "address":kuandai_bssLan["address"]["setupaddress"]
		, "tvShow": (kuandai_bssLan["tvInfo"]["id"] == "0" ? true : false)
		, "ftthShow": (kuandai_bssLan["ftthInfo"]["id"] == "0" ? true : false)
		, "description":"用户合约期不少于12个月，合约期内不得无资源移机、停机及离网。"
	}

	if(kuandai_bssLan["ftthInfo"]["id"] != "0"){
		$scope.input.description += "受理时未向用户提供光猫，需装维人员上门携带。铺货光猫，代收费180元。";
	}


	// 预存框 显示
	$scope.preFeeShow = true;
	$scope.payMolList = [
		  {"name":"预付费","id":1}
		, {"name":"后付费","id":2}];
	$scope.input.payMol = $scope.payMolList[0];
	$scope.changeA = function () {
		if($scope.input.payMol.id === 1){
			$scope.preFeeShow = true;
		}else{
			$scope.preFeeShow = false;
		}
	}
	$scope.changeA();

	$scope.order = function(){
		if($scope.input.payMol.id === 2 || Number($scope.input.preFee) > 0){
			bssLanConfirm = $scope.input;
			$state.go("signature");
		}else{
			my.alert("请输入预存金额，或修改付费方式为后付费!");
		}
	}

	$scope.checkText = function(){
		var s = "用户合约期不少于12个月，合约期内不得无资源移机、停机及离网。受理时未向用户提供光猫，需装维人员上门携带。铺货光猫，代收费180元。";
		if($scope.input.description.length > 64 && $scope.input.description != s.substring(0, $scope.input.description.length)){
			my.alert("备注信息字符个数不能超过64个。").then(function(){
				$scope.input.description = $scope.input.description.substring(0,64);
			})
		}
	}
	

})

// 提交订单
.controller('kuandai-bss-lan-submitOrder', function($scope, $state, $http, $rootScope, $timeout, unicomm_server, my){

	$scope.title = 'BSS单宽('+ authentication["name"] +")";
	$scope.input = bssLanConfirm;

	$scope.divShow = false;
	$scope.loading = true;
	$scope.ReSubmitDiv = true;

	$scope.domEaplan = "订单生成中!";
	$scope.domLine = "1";


	$scope.prompt = "";

	$scope.order = function(){
		$scope.divShow = true;
		$scope.loading = false;

		if($scope.input.payMol.id === 2){
			$scope.input.preFee = 0;
		}

		var inputData = {
			  "orderCode":authentication["orderNo"]
			, "customer":authentication["name"]							//(顾客姓名)
			, "contractNumber":authentication["contractNumber"]			//(联系方式)
			, "lanAddress":kuandai_bssLan["address"]["setupaddress"]	//(宽带地址)
			, "addressCode":kuandai_bssLan["address"]["addresscode"]	//(地址编码)
			, "comment":$scope.input.description						//(备注信息)
			// , "mainProductId":""
			, "mainProductName":"BSS单宽("+kuandai_bssLan["bandWidthName"]+")"
			, "detailedProductId":kuandai_bssLan["productId"]
			, "detailedProductName":kuandai_bssLan["productName"]
			, "lanAmount":$scope.input.preFee

			, "lanNumber":kuandai_bssLan["lanaccount"]	//(宽带号码)
			// , "ftthAddress":""	//(MAC地址)
			// , "ftthPassword":""	//(TV密码)
			, "ftthAmount":kuandai_bssLan["ftthInfo"]["price"]

			, "macAddress":kuandai_bssLan["tvMacAddress"]	//(MAC地址)
			// , "account":""		//(TV账户)
			// , "tvPassword":""	//(TV密码)
			, "tvAmount":kuandai_bssLan["tvInfo"]["price"]
			, "amount":""
		}

		$http({
			method: 'POST',
			url: ajaxurl + 'orderLanApp/submitLanOrder?token='+$rootScope.token,
			data: inputData
		}).success(function(){
			if(userBo.userName == "18866668888"){
				my.alert("您使用的是测试工号，下一步操作将产生消费，将跳过办理步骤").then(function(){
					$scope.upOrder();
				})
			}else{
				$scope.bss_lan_submitOrder();
			}
		}).error(function(){
			$scope.interrupt("订单信息保存失败!");
		});
	}
	



	$scope.bss_lan_submitOrder = function(){

		$scope.domEaplan = "订单信息保存成功!";
		$scope.domLine = "20";

		var json = {
			  "cmd":"bss_lan_submitOrder"
			, "imageBase64": 	authentication["customerImagebase64"]
			, "cardbase64": 	authentication["idHeadImg"].substring(23)
			, "psptid": 		authentication["cardId"]
			, "customerName": 	authentication["name"]
			, "startdate": 		authentication["start_date"]
			, "enddate": 		authentication["end_date"]
			, "addressinfo": 	authentication["address"]
			, "gender": 		authentication["gender"]
			, "nation": 		authentication["nation"]
			, "birthday": 		authentication["birthday"]
			, "police": 		authentication["police"]
			, "contactName": 	authentication["name"]
			, "contactNumber": 	authentication["contractNumber"]

			, "lanaccount":		kuandai_bssLan["lanaccount"] 	// 宽带号码

			, "accmode":		kuandai_bssLan["address"]["accmode"] 		//预判中的accmode
			, "addressid":		kuandai_bssLan["address"]["addresscode"] 	//预判预占中的 addressId
			, "bureauId":		kuandai_bssLan["address"]["exchcode"] 		//预判预占的exch_code
			, "bureauName":		kuandai_bssLan["address"]["exchname"] 		//预判预占的exch_name
			, "project_code": 	kuandai_bssLan["address"]["projectcode"] 	//项目类型，来自于预判预占中
			, "project_name": 	kuandai_bssLan["address"]["projectname"] 	//项目名称，来自于预判预占中
			, "addressname":	kuandai_bssLan["address"]["addressname"] 	//预判预占中的addressName
			, "addressdetailnam":kuandai_bssLan["address"]["setupaddress"]	// 安装地址
			, "setupaddress":	kuandai_bssLan["address"]["setupaddress"] 	// 安装地址

			, "serialNumber":	kuandai_bssLan["serialNumber"]//预占返回的data
			
			, "innetMethod":	kuandai_bssLan["innetMethod"] //预判 接入方式

			
			, "areainfo":		kuandai_bssLan["accAreaId"] 	// 号码中的放号
			, "areaCode":		kuandai_bssLan["areaCode"] 		// 号码中的areaCode字段
			, "serviceAreaId": 	kuandai_bssLan["serviceAreaId"] // 号码中的serviceAreaId字段
			, "areaname":		kuandai_bssLan["accAreaName"] 	// 号码中的放号地址

			, "bandWidth": 		kuandai_bssLan["bandWidth"]		// 宽带类型：50、30、100等
			, "bandWidthName": 	kuandai_bssLan["bandWidthName"]	// 来自于宽带类型的名称 50M贷款
			, "payfee": 		String(Number($scope.input.preFee))

			, "developer":bssInfo["developCode"]
			, "developChannel":kuandai_bssLan["developChannel"]
			, "developerDealer":kuandai_bssLan["developerDealer"]// 实施人信息的value

			, "areaTownId": 	kuandai_bssLan["areaTownId"]
			, "productId": 		kuandai_bssLan["productId"]

			, "iptvmac":kuandai_bssLan["tvMacAddress"]
			, "containsIptv":(kuandai_bssLan["tvInfo"]["id"] == "0" ? "0" : "1")
			, "containsModel": kuandai_bssLan["ftthInfo"]["id"]

			, "isIptvDaishou":(kuandai_bssLan["tvInfo"]["id"] == "2" ? "1" : "0")	// 是否代收
			, "description":$scope.input.description
			, "uploadResponse":bss_faceCheckAndUploadPhoto_uploadResponse
		}


		if(service_type == "schoolLan"){
			json["cmd"] = "bss_schoollan_submit";
			json["payType"] = "2";
			json["grouptId"] = kuandai_bssLan["groupId"];
			json["groupExtern"] = kuandai_bssLan["groupExtern"];
			json["groupSubmitId"] = kuandai_bssLan["groupSubmitId"];
		}


		unicomm_server.getUnicomm(json).then(function(return_json){
			if(return_json.status == '1'){
				$scope.prompt = return_json.data;
				order_amount = Number(kuandai_bssLan["tvInfo"]["price"]) + Number(kuandai_bssLan["ftthInfo"]["price"]) + Number($scope.input.preFee);
				$scope.upOrder();
			}else{
				$scope.interrupt("生成订单失败!原因："+return_json.data);
			}
		}, function(){
			$scope.interrupt();
		})
	}



	$scope.upOrder = function(){

		$scope.domEaplan = "订单提交成功!";
		$scope.domLine = "60";

		$http({
			method: 'POST',
			url: ajaxurl + 'orderLanApp/verifyFinance?token='+$rootScope.token,
			params: {
				  "orderCode":authentication["orderNo"]
				, "amount":Number(kuandai_bssLan["tvInfo"]["price"]) + Number(kuandai_bssLan["ftthInfo"]["price"]) + Number($scope.input.preFee)
				, "financeStr":$scope.prompt
			}
		}).success(function(){
			$scope.bss_payfee();
		}).error(function(){
			$scope.interrupt("更新订单状态失败!");
		});
	}



	$scope.bss_payfee = function(){

		$scope.domEaplan = "订单回写成功!";
		$scope.domLine = "80";

		if($scope.input.payMol.id === 1){
			unicomm_server.getUnicomm({
				  "cmd":"bss_payfee"
				, "lanaccount":$scope.prompt
			}).then(function(return_json){
				if(return_json.status == "1" || return_json.data.indexOf("受理已清费") >= 0){
					$state.go('ok');
				}else{
					my.alert("<div style='color:#F00'>订单已提交成功，但<缴费失败>请去补缴费!</div><br >错误具体原因：" + return_json.data).then(function(){
						$state.go('ok');
					})
				}
			}, function(){
				$scope.interrupt();
			})
		}else{
			$state.go('ok');
		}
	}


	$scope.reSubmit = function()
	{
		$scope.ReSubmitDiv = true;
		if($scope.domLine == "1"){
			$scope.order();
		}else if($scope.domLine == "20"){
			$scope.bss_lan_submitOrder();
		}else if ($scope.domLine == "60"){
			$scope.upOrder()
		}else if ($scope.domLine == "80"){
			$scope.bss_payfee();
		}
	}

	$scope.interrupt = function(){
		if(arguments[0]){
			my.alert(arguments[0]).then(function(){
				$scope.ReSubmitDiv = false;
			});
		}else{
			$scope.ReSubmitDiv = false;
		}
	}

	// 防止重复提交
	var implement = true;
	$timeout(function () {
		if(implement){
			implement = false;
			$scope.order();
		}
	}, 2 * 1000);

});