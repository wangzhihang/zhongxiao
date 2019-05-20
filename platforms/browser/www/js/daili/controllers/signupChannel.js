appControllers.controller('signup-channel', function($scope,$http,my,$state,$rootScope) {
	$scope.title = '渠道信息';
	$scope.btnText = '立即注册';
	$scope.channelValue='请选择归属渠道';
	$scope.provinceList = [];
	$scope.cityList  = [];
	$scope.orgList_1 = [];
	$scope.orgList_2 = [];
	$scope.orgList_3 = [];
	$scope.orgListVal_2 = false;
	$scope.orgListVal_3 = false;
	$scope.isNoShowHeader=false;
	$scope.isNoShowChannelArea=false;
	$scope.formInfo = JSON.parse(localStorage.getItem('formInfo'));
	$scope.city = localStorage.getItem('city');
	$scope.tag1 = {
			current1: "11",
			current2: "",
			current3: "2708"
		};
	$scope.provinceChannelOrgName="陕西联通";
	$scope.cityChannelOrgName="西安联通";
	//console.log("arearValue===="+$rootScope.arearValue);
	/*$scope.formInfo = {
		userName:$scope.formInfo.userName,
		realName:$scope.formInfo.realName,
		password:$scope.formInfo.password,
		repassword:$scope.formInfo.userName,
		wangGe:$scope.formInfo.userName,
		channelManager:$scope.formInfo.userName,
		channelName:$scope.formInfo.userName,
		orgCode:$scope.formInfo.userName,
		disId:$scope.formInfo.userName
	};*/
	//注册初始化信息查询
	 $scope.registerInfo =function(){
		$http({
			method:'get',
			url:ajaxurl + 'userApp/toRegister'
		}).success(function(data){
			//console.log(JSON.stringify(data));
			$scope.provinceList = data.provinceList;		//暂时显示陕西
			for(var i in data.orgList){
				// if(data.orgList[i].orgCode == '000008'||data.orgList[i].orgCode == '014449'||data.orgList[i].orgCode == '000009'){
				// 	$scope.orgList_1.push(data.orgList[i]);

				// 	//console.log("orgList_1"+JSON.stringify($scope.orgList_1));
				// }
				$scope.orgList_1.push(data.orgList[i]);
			}
			//console.log("orgList_1"+JSON.stringify($scope.orgList_1));
			getCityInfo(8610000);
		}).error(function(){
			my.alert('服务器请求失败');
		});	
	};
	
	$scope.registerInfo();

	//城市选项获取
	function getCityInfo(e){
		$scope.cityList = [];
		$http({
			method:'get',
			url:ajaxurl + 'userApp/queryCityList',
			params:{province:e}
		}).success(function(data){
			//console.log(JSON.stringify(data));
			$scope.cityList = data.cityList;
			if($scope.cityList.length > 0){
				$scope.cityVal = true;
			}else{
				$scope.cityVal = false;
				$scope.arearValue=$scope.province;
				$scope.cityList = [{"cateName":"无数据"}];
			}
		}).error(function(){
			my.alert('服务器请求失败');
		});
	}
	//通过ORGNAME获取下一选项
	$scope.selectOrgName_1 = function(e){
		//console.log("e.orgCode="+e.orgCode);
		if(e != null){
			$scope.provinceChannelOrgName=e.orgName;
			$http({
				method:'get',
				url:ajaxurl + 'userApp/queryOrgListByParentCode',
				params:{orgCode:e.orgCode}
			}).success(function(data){
				//console.log(data);
				$scope.orgList_2 = [];
				$scope.orgList_3 = [];
				$scope.orgList_2 = data.orgList;
				//console.log("$scope.orgList_2=="+JSON.stringify($scope.orgList_2));
				for( var i in $scope.orgList_2){
					if($scope.orgList_2[i].orgName.indexOf($scope.city)>-1){
						//console.log("222=="+$scope.orgList_2[i].orgName+$scope.orgList_2[i].id);
						//console.log("e.id="+e.id);
						$scope.id= $scope.orgList_2[i].id;
						$scope.tag1 = {
							current1: e.id,
							current2: $scope.orgList_2[i].id,
							current3: ""
						};
						$scope.cityChannelOrgName=$scope.orgList_2[i].orgName;
						$scope.selectOrgName_2($scope.orgList_2[i]);
					}
				}
				if($scope.orgList_2.length > 0){
					$scope.formInfo.orgCode = '';
					$scope.orgListVal_2 = true;
				}else{
					$scope.orgListVal_2 = false;
					$scope.orgListVal_3 = false;
					$scope.formInfo.orgCode = e.orgCode;//·1无子项
				}
			}).error(function(){
				my.alert('服务器请求失败');
			});
		}
	};
	//通过ORGNAME获取下一选项
	$scope.selectOrgName_2 = function(e){
		if(e != null){
			$http({
				method:'get',
				url:ajaxurl + 'userApp/queryOrgListByParentCode',
				params:{orgCode:e.orgCode}
			}).success(function(data){
				$scope.formInfo.orgCode = '';
				$scope.orgList_3 = [];
				$scope.orgList_3 = data.orgList;
				//console.log("orgList_3"+JSON.stringify($scope.orgList_3));
				if($scope.orgList_3.length > 0){
					$scope.formInfo.orgCode = '';
					$scope.orgListVal_3 = true;
				}else{
					//console.log(e);
					$scope.orgListVal_3 = false;
					$scope.formInfo.orgCode = e.orgCode;//·2无子项
				}
			}).error(function(){
				my.alert('服务器请求失败');
			});
		}
	};
	//通过ORGNAME获取下一选项
	$scope.selectOrgName_3 = function(e){
		if(e != null){
			$scope.formInfo.orgCode = e.orgCode;
		}
	};

	//提交表单
	function submitInfo(){
		$scope.btnText = '正在提交信息';
		$scope.loading = true;
		$scope.resState = true;
		$http({
			method:'post',
			url:ajaxurl + 'userApp/register',
			data:{
				userName:$scope.formInfo.userName,
				password:$scope.formInfo.password,
				orgCode:$scope.formInfo.orgCode,
				disId:$scope.formInfo.disId,
				realName:$scope.formInfo.realName,
				wangGe:$scope.formInfo.wangGe,
				channelManager:$scope.formInfo.channelManager,
				channelName:$scope.formInfo.channelName,
				roleId:$scope.formInfo.roleId
			}
		}).success(function(data){
			//console.log(JSON.stringify(data));
			$scope.btnText = '立即注册';
			$scope.loading = false;
			$scope.resState = false;
			my.alert('注册信息提交成功，等待管理员审核！').then(function(){
				$state.go('login');
			});
		}).error(function(){
			//console.log("formInfo=="+JSON.stringify($scope.formInfo));
			my.alert('服务器请求失败').then(function(){
				$scope.btnText = '立即注册';
				$scope.loading = false;
				$scope.resState = false;
			});
			
		});	
	}
	/**********提交表单************/
	$scope.confirm = function(){
		//console.log('ORGCODE:'+ $scope.formInfo.orgCode);
			if($scope.formInfo.wangGe == ''){
					my.alert('请输入网格名称');
					return ;
				}else
				if($scope.formInfo.channelManager == ''){
					my.alert('请输入渠道经理');
					return ;
				}else
				 if($scope.formInfo.channelName == ''){
					my.alert('请输入渠道名称');
					return ;
				}else
				if($scope.formInfo.orgCode == ''){
					my.alert('请选择归属渠道');
					return ;
				}
				submitInfo();
		};

	// 显示归属渠道
	$scope.choseChannelCity=function  () {
		$scope.isNoShowHeader=true;
		$scope.isNoShowChannelArea=true;
		$scope.proArr=$rootScope.arearValue.split(" ");
		//console.log("$scope.proArr=="+$scope.proArr[0]);
		for(var i in $scope.orgList_1){
			if($scope.orgList_1[i].orgName.indexOf($scope.proArr[0])>-1){
				//console.log($scope.orgList_1[i].orgName);
				//console.log("orgList_1[i]=="+JSON.stringify($scope.orgList_1[i]));
				$scope.selectOrgName_1 ($scope.orgList_1[i]);
			}
		}
		//$scope.selectOrgName_2($scope.orgList_2[0]);
		//console.log("??2=="+JSON.stringify($scope.orgList_2));
	}
	//关闭归属渠道
	$scope.closeChannelCity=function (){
		$scope.isNoShowHeader=false;
		$scope.isNoShowChannelArea=false;
	}

	//归属渠道
	$scope.actions1 = {
		// 归属省份
		setCurrent1: function (param) {
			$scope.tag1.current1 = JSON.parse(param).id;
			$scope.provinceChannel=JSON.parse(param).orgCode;
			$scope.provinceChannelOrgName=JSON.parse(param).orgName;
			$scope.selectOrgName_1 (JSON.parse(param));
		
		},
		// 归属市份
		setCurrent2: function (param) {
			$scope.tag1.current2 = JSON.parse(param).id;
			$scope.cityChannel=JSON.parse(param).orgCode;
			$scope.cityChannelOrgName=JSON.parse(param).orgName;
			$scope.selectOrgName_2 (JSON.parse(param));
		},
		// 一级部门
		setCurrent3: function (param) {
			//$scope.selectOrgName_3 (JSON.parse(param));
			$scope.formInfo.orgCode=JSON.parse(param).orgCode;
			$scope.stairChannelOrgName=JSON.parse(param).orgName;
			$scope.channelValue=$scope.provinceChannelOrgName+ ' ' + $scope.cityChannelOrgName+' '+$scope.stairChannelOrgName;
			$scope.closeChannelCity();
		}
  };
});