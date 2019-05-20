appControllers.controller('org-add-salesman', function($scope,$state,$http,my,$rootScope) {
	$scope.title = '新增业务员';
	$scope.stateTxt = '确认添加';
	$scope.resState = true;
	$scope.id=null;
	
	$scope.DevelopInfo=JSON.parse(localStorage.getItem('DevelopInfos'));
	// console.log($scope.DevelopInfo);
	$scope.data = {salesman:'',userName:'',password:'',password1:'',realName:''};
	$scope.dataState = {salesman:false,userName:false,password:false,realName:false};

	
	$scope.sites=[{'id':0,'typeName':'请选择店铺类型'}];
	//选择店铺类型
	// if(userBo.userType == "000003"){
	$scope.dianpuType = function(){
		$http({
		method:'get',
		url:ajaxurl+'shopType/selectShopTypeByAgentId?token=' + $rootScope.token,
		// url:'http://192.168.31.93:8080/tms-app-war/userApp/queryShopTypeByDeveDeptCodeForAPP?token=' + $rootScope.token,
			params:{
			'agentId':userBo.userId
			}
		}).success(function(data){
			if(data.result == false){
				// $scope.dataState.shopType = true;
			}else{
				$scope.choseDianpuType = true;
				$scope.sites =$scope.sites.concat(data.shopTypelist);
				$scope.input = {'id':$scope.sites[0]};
			}
			
		}).error(function(){
			my.alert('服务器请求失败');
		});
	}
	$scope.dianpuType();
	//是否显示选择店铺类型
	// if(userBo.disId == '6100000'||userBo.disId == '8120000'||userBo.disId == '0500000'){
	// 	$scope.choseDianpuType = true;
	// 	$scope.dianpuType();
	// }else{
	// 	$scope.dataState.shopType = true;
	// }
	//获取代理商
	$scope.getSaleman=function(){
		$http({
	         method:'get',
	         url:ajaxurl + 'appDept/queryDetpStatsNew?token=' + $rootScope.token,
	         params:{
	         	'deptCode':signInInfo.deptMap.deptCode
	         	,'levelCode':deptInfo.levelCode
	         	,'deptType':deptInfo.deptType
	         	,'orderName':null
	         	,'keyWords':null
	         	,'abnormal':null
	         	,'dateType':null
	         	,'minNum':null
	         	,'maxNum':null
	         }
	     }).success(function(data){
			$scope.deveList=data.statsList;
			$scope.select = function(e){
				$scope.dataState.salesman = false;
				if(e != null){
					$scope.deptCode = e.deptCode;
					// console.log($scope.deptCode)
					$scope.dataState.salesman = true;
				}
				$scope.submit();
			}
		}).error(function () {
	        my.alert('代理商获取失败！请稍后尝试。').then(function(){
	            $state.go('daili-org-saleman-shop-list');
	        }); 
	    });
	}

	$scope.input1=function(){
		// console.log('input'+JSON.stringify($scope.input.id));
		// console.log('id'+$scope.input.id.id);
		$scope.id=$scope.input.id.id;
		// $scope.isSwitch();
	}
	$scope.isSwitch = function(){
		// console.log('id=='+$scope.id);
		if($scope.id==0 || $scope.id==null){
			$scope.dataState.shopType=false;
			return;
		}else{
			$scope.dataState.shopType=true;
			$scope.submit();
		}
	}


	if(signInInfo.deptMap.deptType=='000001'&&localStorage.getItem('dianpuTag') == 'saleman'){
		$scope.showChoseSaleman = true;
		$scope.getSaleman();
	}else if(signInInfo.deptMap.deptType=='000002'&&localStorage.getItem('dianpuTag') == 'saleman'){
		$scope.showChoseSaleman = false;
		$scope.dataState.salesman = true;
	}else{
		$scope.dataState.salesman = true;
	}
	//按钮状态
	$scope.submit = function(){
		var t = false;
		for(var i in $scope.dataState){
			if($scope.dataState[i] == false){
				t = true;
			}
		}
		$scope.resState = t;
	}
	//用户名验证
	$scope.userName = function(){
		$scope.dataState.userName = false;
		var reg = /^1[0-9]{10}$/;
		if(!reg.test($scope.data.userName)){
			$scope.userNameErrorTips = '账号错误';
			$scope.submit();
		}else{
			$http({
				method:'post',
				url:ajaxurl + 'userApp/existUserName?token=' + $rootScope.token,
				data:{userName:$scope.data.userName}
			}).success(function(data){
				if(data == true){
					$scope.userNameErrorTips = '';
					$scope.dataState.userName = true;
				}else{
					$scope.userNameErrorTips = '已被占用';
				}
				$scope.submit();
			});
		}
	}
	//密码验证
	$scope.password = function(){
		$scope.dataState.password = false;
		if($scope.data.password.length < 6){
			$scope.passwordErrorTips = '最小长度为6位';
			return;
		}else if($scope.data.password != $scope.data.password1){
			$scope.passwordErrorTips = '';
			$scope.rePasswordErrorTips = '密码不一致';
			return;
		}else{
			$scope.passwordErrorTips = '';
			$scope.rePasswordErrorTips = '';
			$scope.dataState.password = true;
			
		}
		$scope.submit();
	}
	//真实姓名
	$scope.realName = function(){
		$scope.dataState.realName = false;
		var reg = /^[\u4E00-\u9FA5]{2,4}$/;
		if(!reg.test($scope.data.realName)){
			$scope.realNameErrorTips = '请输入真实姓名';
		}else{
			$scope.realNameErrorTips = '';
			$scope.dataState.realName = true;
		}
		$scope.submit();
	}
	//联系电话
	$scope.contractNumber = function(){
		$scope.dataState.contractNumber = false;
		var reg = /^1[0-9]{10}$/;
		if(!reg.test($scope.data.contractNumber)){
			$scope.contractNumberErrorTips = '手机号码有误';
		}else{
			$scope.contractNumberErrorTips = '';
			$scope.dataState.contractNumber = true;
		}
		$scope.submit();
	}
	// console.log('11==='+signInInfo.deptMap.deptType );
	$scope.submitForm=function(){
		$scope.loading = true;
		$scope.resState = true;
		$scope.stateTxt = '正在添加';
		if(localStorage.getItem('dianpuTag') == 'saleman'){
			if(signInInfo.deptMap.deptType == "000002"){
				$scope.deptCode = signInInfo.deptMap.deptCode;
			}
			$http({
				method:'post',
				url:ajaxurl + '/userApp/saveDeveloper?token=' + $rootScope.token,
				data:{
					userName:$scope.data.userName
					,password:$scope.data.password
					,password1:$scope.data.password1
					,realName:$scope.data.realName
					,contractNumber:$scope.data.userName
					,parentDeptCode:$scope.deptCode
					,shopTypeId:$scope.id
					}
			}).success(function(data){
				// console.log('11=='+JSON.stringify(data));
				if(data==true){
					my.alert('添加成功！').then(function(){
						$state.go('index_dl');
					});
				}else{
					my.alert('添加失败！');
				}
				
			}).error(function(){
				my.alert('添加业务员失败！请稍后尝试。').then(function(){
			        $state.go('index_dl').then(function(){
						$state.go('index_dl');
					});
			    });
			});
		}
		if(localStorage.getItem('dianpuTag') != 'saleman'&&signInInfo.deptMap.deptType == "000002"){
			console.log('2222');
	    	$http({
				method:'post',
				url:ajaxurl + '/userApp/saveDeveloper?token=' + $rootScope.token,
				data:{
					userName:$scope.data.userName
					,password:$scope.data.password
					,password1:$scope.data.password1
					,realName:$scope.data.realName
					,contractNumber:$scope.data.userName
					,parentDeptCode:localStorage.getItem('deptCode')
					,shopTypeId:$scope.id
					}
			}).success(function(data){
				// console.log('11=='+JSON.stringify(data));
				if(data==true){
					my.alert('添加成功！').then(function(){
						$state.go('index_dl');
					});
				}else{
					my.alert('添加失败！');
				}
				
			}).error(function(){
				my.alert('添加业务员失败！请稍后尝试。').then(function(){
			        $state.go('index_dl').then(function(){
						$state.go('index_dl');
					});
			    });
			});
	    }else if(localStorage.getItem('dianpuTag') != 'saleman'&&signInInfo.deptMap.deptType == "000001"){
	  		console.log('3333');
	    	$http({
				method:'post',
				url:ajaxurl + '/userApp/saveDeveloper?token=' + $rootScope.token,
				data:{
					userName:$scope.data.userName
					,password:$scope.data.password
					,password1:$scope.data.password1
					,realName:$scope.data.realName
					,contractNumber:$scope.data.userName
					// ,orgCode:$scope.DevelopInfo.orgCode
					// ,deptCode:$scope.DevelopInfo.deptCode
					,parentDeptCode:$scope.DevelopInfo.deptCode
					,shopTypeId:$scope.id
					}
			}).success(function(data){
				// console.log('11=='+JSON.stringify(data));
				if(data==true){
					my.alert('添加成功！').then(function(){
						$state.go('index_dl');
					});
				}else{
					my.alert('添加失败！');
				}
				
			}).error(function(){
				my.alert('添加业务员失败！请稍后尝试。').then(function(){
			        $state.go('index_dl');
			    });
			});
	    }
	    // console.log($rootScope.signInData.userName.substring(0,1));
	  //   if(userBo.userType == "000003"){ 
	  //   	$http({
			// 	method:'post',
			// 	url:ajaxurl + '/userApp/saveDeveloper?token=' + $rootScope.token,
			// 	data:{
			// 		userName:$scope.data.userName
			// 		,password:$scope.data.password
			// 		,password1:$scope.data.password1
			// 		,realName:$scope.data.realName
			// 		,contractNumber:$scope.data.contractNumber
			// 		,orgCode:signInInfo.userInfo.orgCode
			// 		,deptCode:localStorage.getItem('deptCode')
			// 		,parentDeptCode:''
			// 		}
			// }).success(function(data){
			// 	// console.log('11=='+JSON.stringify(data));
			// 	if(data==true){
			// 		my.alert('添加成功！').then(function(){
			// 			$state.go('index_dl');
			// 		});
			// 	}else{
			// 		my.alert('添加失败！');
			// 	}
				
			// }).error(function(){
			// 	my.alert('添加业务员失败！请稍后尝试。').then(function(){
			//         $state.go('index_dl');
			//     });
			// });
	  //   }
		
	}
});