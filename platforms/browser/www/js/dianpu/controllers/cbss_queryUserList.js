appControllers.controller('dianpu-cbss_queryUserList', function($scope, my, unicomm_server, ble_identity,$ionicPopup) {
	$scope.title = "用户查询";
	$scope.agree = false;
	$scope.identifyInfo = false;
	$scope.myDevice = '请选择设备';
	authentication = {}
	$scope.openRecord=[];
	$scope.ifShowRecord=false;
	$scope.showAuthentication = function(){
		$scope.authentication = authentication;
	}
	$scope.showAuthentication();

	$scope.modeDiv = localStorage.getItem('queryUserList-mode') == "write";

	//////// 设备读取

	// ************获取设备***************
	// 初始值
	var bleHistory = str2json(localStorage.getItem("bleHistory"));
	if(bleHistory.name){
		$scope.myDevice=bleHistory.name;
		BLEcurrDevice = bleHistory;
	}else{
		$scope.myDevice = "";
	}

	//搜索设备
	$scope.readEquip =function(){
		ble_identity.BLEfind().then(function(data){
			$scope.bleadderDatas=data;
			$scope.loading = false;
		},function(){
			my.alert("搜索设备失败！");
		})
	}
	//切换设备
	$scope.contentBlueTooth = function(){
		$scope.showContentBlueTooth = true;
		// if($scope.bleadderDatas.length==0){
			$scope.loading = true;
			$scope.readEquip();
		// }else{

		// }
	}
	//选择设备
	$scope.switchDevice = function(i){
		$scope.showContentBlueTooth = false;
		$scope.myDevice = $scope.bleadderDatas[i].name;
		BLEcurrDevice = $scope.bleadderDatas[i];
		localStorage.setItem("bleHistory", JSON.stringify(BLEcurrDevice))
	}
	//重新搜索设备
	$scope.reSearch = function(){
		$scope.bleadderDatas = [];
		$scope.loading = true;
		$scope.readEquip();
	}
	$scope.closeContentBlueTooth = function(){
		$scope.showContentBlueTooth = false;
	}

	//**************读取身份证*******************
	//判断是读取过
	if(authentication["cardId"]){
		$scope.identifyInfo = true;
	}
	//读取身份证
	$scope.readIdentity = function(){
		if($scope.myDevice==""){
			my.alert("请先选择设备,再读取身份证信息！");
		}else{
			my.loaddingShow("身份证信息读取中");
			ble_identity.BLEreadIdentity().then(function(){
				$scope.identifyInfo = true;
				$scope.showAuthentication();
				$scope.cbssLogin();
			},function(){
				my.alert("读取身份证信息失败！");
			})
		}
	}
	//重新读证
	$scope.againRead=function(){
		$scope.openNum = "";
		$scope.openRecord = []
		$scope.identifyInfo = false;
		$scope.authentication=null;
		$scope.showAuthentication();
	}

	$scope.cbssLogin = function(){
		my.loaddingShow("身份证信息认证中");
		unicomm_server.cbssLogin().then(function(){
			$scope.queryList();
		})
	}

	////////
	$scope.data = {}
	$scope.writeQuer = function(){
		if($scope.data.name && $scope.data.cardId){
			authentication['cardId'] = $scope.data['cardId'];
			authentication['name'] = $scope.data.name;
			$scope.cbssLogin();
		}else{
			my.alert("请填写名称和身份证号码!")
		}
	}

	
	$scope.queryList = function(){
		unicomm_server.getUnicomm({
			"cmd":"iscustomexists",
			"pspt_id":authentication['cardId'],
			"cust_name":authentication['name'],
			"isWithCustOrderInfo":true
		}).then(function(result_json){
			if(result_json.status == "1"){
				for(var i in result_json.custOrderInfo){
					for(var j in result_json.custOrderInfo[i]){
						$scope.openRecord.push(result_json.custOrderInfo[i][j]);
					}
				}
				$scope.ifShowRecord=true;
				$scope.customer_isblack();
			}else{
				if(result_json.data.message == "无此客户信息，请创建客户！"){
					$scope.simInput = {"contractNumber":""};
					my.loaddingHide();
					$ionicPopup.show({
						"template": '<input type="tel" ng-model="simInput.contractNumber" placeholder="联系电话">',
						"title": '请输入客户联系电话',
						"subTitle": '用户在本省没有用户,需建立才可跨省核验!',
						"scope": $scope,
						"buttons":[
							{"text":'取消'},
							{
								"text": '<b>确认</b>',
								"type": 'button-calm',
								"onTap": function() {
									if($scope.simInput.contractNumber.length >= 11){
										authentication["contractNumber"] = $scope.simInput.contractNumber;
										my.loaddingShow("身份证信息认证中");
										$scope.createcustomer();
									}else{
										my.alert("联系电话不正确").then(function(){
											$scope.queryList();
										})
									}
								}
							},
						]
					});
				}else{
					my.alert(result_json.data.message)
					// $scope.queryList();
				}
			}
		},function(){
			my.loaddingHide();
		})
	}

	$scope.createcustomer = function(){
		unicomm_server.getUnicomm({
			"cmd":"createcustomer",
			"cust_name":authentication["name"],
			"pspt_id":authentication["cardId"],
			"end_date":authentication["end_date"],
			"contact_name":authentication["name"],
			"contact_phone":authentication["contractNumber"],
			"addressinfo":authentication["address"],
			"birthday":authentication["birthday"],
			"nation":authentication["nation"],
			"sex":(authentication["gender"].indexOf("男") !== -1 ? "M" : "F")
		})
		.then(
			function(){
				$scope.queryList();
			}
			, function(){
				$scope.createcustomer();
			})

	}

	$scope.customer_isblack = function(){
		unicomm_server.getUnicomm({
			"cmd":"cbss_customer_isblack",
			"psptId":authentication["cardId"],
			"custName":authentication['name']
		}).then(function(data){
			if(data.status == "1"){
				if(data.data === "0"){
					$scope.cbss_user_checklimit();
				}else{
					my.alert("该用户为黑户").then(function(){
						$scope.openNum="该用户为黑户";
						$scope.className="txtRed";
					})
				}
			}else{
				my.alert(data.data).then(function(){
					$scope.openNum="该用户为黑户";
					$scope.className="txtBlue";
				})
			}
		}, function(){
			my.loaddingHide();
		})
	}

	$scope.cbss_user_checklimit = function(){
		unicomm_server.getUnicomm({
			"cmd":"cbss_user_checklimit",
			"name": authentication['name'],
			"psptid": authentication["cardId"]
		}).then(function(data){
			my.loaddingHide();
			if(data.status == "1"){
				$scope.openNum="该用户共有"+data.data+"条开卡记录";
			}else{
				$scope.openNum=data.data;
			}
		},function(){
			my.loaddingHide();
		})
	}
})


.controller('dianpu-cbss_queryUserList-mode', function($scope, $state) {
	$scope.title = "用户查询";
	$scope.agree = false;
	$scope.identifyInfo = false;
	$scope.myDevice = '请选择设备';
	authentication = {}
	$scope.openRecord=[];
	$scope.ifShowRecord=false;

	$scope.setCurrent = function(){
		if(arguments[0] === 1){
			localStorage.setItem('queryUserList-mode',"device");
		}else{
			localStorage.setItem('queryUserList-mode',"write");
		}
		$state.go("dianpu-cbss_queryUserList");
	}


});