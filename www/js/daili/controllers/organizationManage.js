appControllers.controller('organization-manage', function($scope,my,$rootScope,$state,$http,$stateParams, $ionicPopup) {
	$scope.title = '机构管理';
	$scope.deptCode=localStorage.getItem('deptCode');
	$scope.statsList=[];
	$scope.statsInfo=[];
	$scope.deptNameList=[];
	$scope.showPopPanel=false;
	$scope.addChose=false;
	$scope.numberA=true;
	$scope.numberB=true;
	$scope.showAddBtn=true;
	$scope.name='';
	localStorage.setItem('deptCode',signInInfo.userInfo.deptCode);

	// console.log($scope.deptCode);

	//获取信息
	$scope.getStatsList=function(deptCode){
		$http({
			method:'get',
			url:ajaxurl + '/appDept/queryDetpStats?token=' + $rootScope.token,
			params:{deptCode:deptCode}
		}).success(function(data){
			// console.log('22=='+JSON.stringify(data));
			$scope.statsList=data.statsList;
			$scope.statsLength=$scope.statsList.length;
			$scope.statsInfo=data.statsInfo;
			$scope.deptInfo=data.deptInfo;
			// localStorage.setItem('numberInfo',JSON.stringify({
			// 'levelCode':$scope.deptInfo.levelCode,
			// 'status':$scope.deptInfo.status
			// }));
			localStorage.setItem('levelCode',$scope.deptInfo.levelCode);
			//...上传成功
		}).error(function(){
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index_dl');
	        });
		});
	}
	$scope.getStatsList($scope.deptCode);

	//筛选
	$scope.filterNode=function(deptCode){
		$http({
			method:'get',
			url:ajaxurl + '/appDept/queryChildNode?token=' + $rootScope.token,
			params:{id:deptCode}
		}).success(function(data){
			// console.log('11=='+JSON.stringify(data));
			// console.log('aa=='+data.length);
			if(data.length==0){
				$scope.showPopPanel=false;
			}else{
				// $scope.deptNameList=[];
				$scope.secBdRight=true;
				$scope.deptNameList=data;
			}
		}).error(function(){
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index_dl');
	        });
		});
	}

	$scope.filterNode($scope.deptCode);
	$scope.gradeFilter=$scope.deptCode;

	// pop panel
	$scope.popPanel = function () {
		$scope.showPopPanel=true;
		$scope.rootDeptName = localStorage.getItem('deptName');
		$scope.addChose=false;
		$scope.showAddBtn=false;
		$scope.getSecondDeptName();
	};
	//关闭遮罩层
	$scope.closePop=function(){
		$scope.showPopPanel=false;
		$scope.showAddBtn=true;
	}
	//获取筛选二级
	$scope.getSecondDeptName=function(){
		$scope.filterNode($scope.deptCode);
		$scope.gradeFilter=$scope.deptCode;
	}
	//获取筛选三级
	$scope.getThirdDeptName=function(secDeptName,index,name,id){
		// console.log('name='+name.substring(3));
		$scope.statsList=[];
		$scope.name=name.substr(name.length-3);
		$scope.secByChosed=index;
		$scope.gradeFilter=secDeptName;
		localStorage.setItem('deptCode',id);
		$http({
			method:'get',
			url: ajaxurl + '/appDept/queryChildNode?token=' + $rootScope.token,
			params:{id:secDeptName}
		}).success(function(data){
			// console.log('11=='+JSON.stringify(data));
			
			if(data.length==0){
				$scope.thirdDeptNameList=[];
				$scope.showPopPanel=false;
			}else{
				// $scope.deptNameList=[];
				$scope.thirdDeptNameList=data;
			}
		}).error(function(){
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index_dl');
	        });
		});
	}

	$scope.startQuery=function(deptCode,name,orgCode,index){
		$scope.name=name.substr(name.length-3);
		$scope.thirdByChosed=index;
		$scope.showPopPanel=false;
		$scope.statsList=[];
		if($scope.name=='业务部'){
			$scope.showAddBtn=true;
			$scope.numberA=false;
			$scope.numberB=true;
		}
		localStorage.setItem('developeId',deptCode);
		localStorage.setItem('developeOrgCode',orgCode);
		$scope.getStatsList(deptCode);

	}
	//点击确认
	$scope.confirm=function(){
		console.log($scope.name);
		if($scope.name=='代理点'){
			$scope.showAddBtn=true;
			$scope.numberA=true;
			$scope.numberB=false;
		}
		if($scope.name=='业务部'){
			$scope.showAddBtn=true;
			$scope.numberA=true;
			$scope.numberB=true;
		}
		$scope.showPopPanel=false;
		$scope.getStatsList($scope.gradeFilter);
	}
	//查看号码订单
	$scope.getTotalNumData=function(){
		localStorage.setItem('orgOrder',JSON.stringify({
			'levelCode':$scope.deptInfo.levelCode,
			'getFun':'getNumData'
		}));
		$state.go('org-number-order-list');
	}
	//查看宽带订单
	$scope.getTotalLanData=function(){
		localStorage.setItem('orgOrder',JSON.stringify({
			'levelCode':$scope.deptInfo.levelCode,
			'getFun':'getLanData'
		}));
		$state.go('org-number-order-list');
	}
	//查看单个号码订单
	$scope.checkSigleOrgNumOrder=function(deptCode){
		console.log($scope.deptInfo.levelCode+'|'+deptCode);
		localStorage.setItem('orgOrder',JSON.stringify({
			'levelCode':$scope.deptInfo.levelCode+'|'+deptCode,
			'getFun':'getNumData'
		}));
		$state.go('org-number-order-list');
	}
	//查看单个宽带订单
	$scope.checkSigleOrgLanOrder=function(deptCode){
		localStorage.setItem('orgOrder',JSON.stringify({
			'levelCode':$scope.deptInfo.levelCode+'|'+deptCode,
			'getFun':'getLanData'
		}));
		$state.go('org-number-order-list');
	}
	//查看所有订单
	$scope.getTotalData=function(deptCode){
		localStorage.setItem('orgOrder',JSON.stringify({
			'levelCode':$scope.deptInfo.levelCode+'|'+deptCode,
			'getFun':'getTotalData'
		}));
		$state.go('org-number-order-list');
	}
	//b工号弹出添加选择层
		if(userBo.userType == "000003"){
	    	$scope.addChose=true;
	    	$scope.showPop=true;
	    	$scope.showPopPanel=false;
	    	$scope.numberA=false;
	    	$scope.numberB=true;
	    	
	    }else{
	    	$scope.numberA=true;
	    	$scope.numberB=false;
	    }
	

	//b工号添加业务员
	$scope.orgAddSaleman=function(){
		$state.go('org-add-salesman');
	}
	//b工号添加店铺
	$scope.orgAddShop=function(){
		$state.go('org-add-shop');
	}

});