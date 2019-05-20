appControllers.controller('daili-org-index-list', function($scope,$state,$http,my,$rootScope) {
	// $scope.title = '机构列表';
	$scope.deptName="渠道";	
	$scope.loading=true;
	$scope.isNoShowHeader=false;
	$scope.statsList = [];
	$scope.usermap=[];
	$scope.depts=[];
	$scope.salemanDeptCode='';
	$scope.isShowAddSale=true;
	$scope.btnText='添加业务员';
	$scope.sortNum = 0;
	$scope.sortOrder= null;
	if(userBo.userType == "000002"){
    		$scope.btnText='添加业务员';
    	}else{
    		$scope.btnText='添加店铺';
    	}
	// console.log(signInInfo.deptMap.deptName+'==='+signInInfo.deptMap.deptType);
	if(signInInfo.deptMap.deptType=='000001'){
		$scope.isShowAddSale=false;
	}else{
		// console.log('aaa');
		$scope.isShowAddSale=true;
	}

	$scope.usermap = [{"deptName":"全部","userId":""}];
	$scope.usermap=$scope.usermap.concat(signInInfo.deptMap.depts);
	// console.log('$scope.usermap=='+JSON.stringify($scope.usermap));
	for( var i in $scope.usermap){
		$scope.usermap[i].num=i;
	};
	//筛选列表
	$scope.filterList = {
		'sortClasses':[
			{"name":"号码","active":false,"num":0,"orderName":"number"},
			{"name":"宽带","active":false,"num":1,"orderName":"lan"}
		],
		'carsAmount':[
			{"name":"当日","active":false,"num":2,"dateType":"01"},
			{"name":"当月","active":false,"num":3,"dateType":"02"},
			{"name":"上月","active":false,"num":4,"dateType":"03"}
		],
		'monthCarsAmount':[
			{"name":"不限","active":false,"num":5,"minNum":null,"maxNum":null},
			{"name":"0-3","active":false,"num":6,"minNum":0,"maxNum":3},
			{"name":"3-10","active":false,"num":7,"minNum":3,"maxNum":10},
			{"name":"10-20","active":false,"num":8,"minNum":10,"maxNum":20},
			{"name":"20-30","active":false,"num":9,"minNum":20,"maxNum":30},
			{"name":"30以上","active":false,"num":10,"minNum":30,"maxNum":null}
		]
	},
	$scope.sortClasses = $scope.filterList.sortClasses;
	$scope.carsAmount = $scope.filterList.carsAmount;
	$scope.monthCarsAmount = $scope.filterList.monthCarsAmount;

	// console.log('11=='+JSON.stringify($scope.filterList.sortClasses));
	// //排序标准
	// $scope.sortClasses=[
	// 	{"name":"号码","num":"0"},
	// 	{"name":"宽带","num":"1"}
	// ];
	// //出卡量
	// $scope.carsAmount=[
	// 	{"name":"当日","num":"2"},
	// 	{"name":"当月","num":"3"},
	// 	{"name":"上月","num":"4"}
	// ]
	// //本月出卡量区间
	// $scope.monthCarsAmount=[
	// 	{"name":"不限","num":"5"},
	// 	{"name":"0-3","num":"6"},
	// 	{"name":"3-10","num":"7"},
	// 	{"name":"10-20","num":"8"},
	// 	{"name":"20-30","num":"9"},
	// 	{"name":"30以上","num":"10"}
	// ]
	

	// 全部:查看所有代理商
	$scope.tag1 = {
		current: "0"
	};
	$scope.actions1 = {
		setCurrent: function (param,deptCode,deptName) {
			$scope.deptName=$scope.usermap[0].deptName;
			$scope.tag1.current = param;
			$scope.salemanDeptCode = deptCode;
			$scope.tag2.current = -1;
			if(param=="0"){
				$scope.isNoShowReviewSalesman=false;
				$scope.depts=[];
				$scope.getData(
					localStorage.getItem('deptCode')
					,deptInfo.levelCode
					,signInInfo.deptInfo.deptType
					,null
					,null
					,null
					,null
					,null
					,null
					);
			}else{
				$scope.depts=[{"deptName":"全部","userId":""}];
				$scope.depts=$scope.depts.concat($scope.usermap[param].depts);
			}
			
			$scope.saleDeptName=deptName;
			// console.log('depts=='+JSON.stringify($scope.depts));
			// if($scope.depts.length == 1){
			// 	$scope.isNoShowReviewSalesman=false;
			// 	$scope.getData(
			// 		localStorage.getItem('deptCode')
			// 		,$scope.levelCode
			// 		,null
			// 		,null
			// 		,null
			// 		,null
			// 		,null
			// 		,null
			// 		);
			// }
			for(var i in $scope.depts){
				$scope.depts[i].num=i;
			}
		}
	}

	//排序
	$scope.tag3 ={
		current : "-1"
	};
	$scope.actions3 = {
		setCurrent : function(param){
			$scope.tag3.current = param;
		}
	}

	//关闭l来源窗口
	$scope.closereviewSource=function(){
		$scope.isNoShowReviewSource=false;
	}
	//关闭筛选窗口
	$scope.closeChosePop=function(){
		$scope.isNoShowChosePop=false;
		$scope.isNoShowQuestion=false;
	}
	// 关闭业务员
	$scope.closereviewSalesman=function(){
		$scope.isNoShowReviewSalesman=false;
		// $scope.usermap=[];
	}
	// 重置
	$scope.resetting=function(){
		$scope.tag4.current = -1;
		$scope.tag5.current = -1;
		$scope.tag6.current = -1;
		$scope.isNoShowQuestion=false;
	}
	//跳到业务员列表
	$scope.orgSalemanShopList=function(levelCode,deptCode,headImg,orgCode,deptName,deptType,userId,index){
		localStorage.setItem('DevelopInfos',JSON.stringify({
			'levelCode':levelCode,
			'deptCode':deptCode,
			'headImg':headImg,
			'orgCode':orgCode,
			'deptName':deptName,
			'deptType':deptType,
			'statsList':$scope.statsList,
			'index':index,
			'userId':userId
		}));
		if(deptType=='000004'){
			$state.go('daili-org-saleman-shop-info');
		}else{
			$state.go('daili-org-saleman-shop-list');
		}
	}

	//初始化数据
	$scope.getData=function(deptCode,levelCode,deptType,orderName,keyWords,abnormal,dateType,minNum,maxNum){
		$scope.loading=true;
		$http({
	         method:'get',
	         url:ajaxurl + 'appDept/queryDetpStatsNew?token=' + $rootScope.token,
	         params:{
	         	'deptCode':deptCode
	         	,'levelCode':levelCode
	         	,'deptType':deptType
	         	,'orderName':orderName
	         	,'keyWords':keyWords
	         	,'abnormal':abnormal
	         	,'dateType':dateType
	         	,'minNum':minNum
	         	,'maxNum':maxNum
	         }
	     }).success(function(data){
			// console.log(JSON.stringify(data));
			$scope.loading=false;
			$scope.statsList=data.statsList;
			 for(var i in $scope.statsList){
            	// if($scope.statsList[i].headImg==null||$scope.statsList[i].headImg==""){
            	// 	$scope.statsList[i].isNoShowPic=false;
            	// }else{
            	// 	$scope.statsList[i].isNoShowPic=true;
            	// }
            	if($scope.statsList[i].deptType == '000002'){
            		$scope.statsList[i].headImg = 'img/daili.png';
            	}else if($scope.statsList[i].deptType == '000003'){
            		$scope.statsList[i].headImg = 'img/yewu.png';
            	}else if($scope.statsList[i].deptType == '000004'){
            		$scope.statsList[i].headImg = 'img/dianpu.png';
            	}
             }
		}).error(function () {
	        my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index');
	        }); 
	    });
	}

	$scope.getData(
		localStorage.getItem('deptCode')
		,signInInfo.deptInfo.levelCode
		,signInInfo.deptInfo.deptType
		,null
		,null
		,null
		,null
		,null
		,null
		);

	//关键字查询
	$scope.lookKeywords=function(keyword){
		$scope.getData(
			localStorage.getItem('deptCode')
			,$scope.levelCode
			,signInInfo.deptInfo.deptType
			,null
			,keyword
			,null
			,null
			,null
			,null
			);
	}

	//筛选中确定按钮
	$scope.ensure=function(){
		$scope.isNoShowChosePop=false;
		if($scope.showDetailValue==false){
			$scope.isNoShowDetail=false;
		}else{
			$scope.isNoShowDetail=true;
		}
		for(var i=0 in $scope.sortClasses){
			if($scope.sortClasses[i].active==true){
				$scope.orderName=$scope.sortClasses[i].orderName;
			}
		}
		for(var i=0 in $scope.carsAmount){
			if($scope.carsAmount[i].active==true){
				$scope.dateType=$scope.carsAmount[i].dateType;
			}
		}
		for(var i=0 in $scope.monthCarsAmount){
			if($scope.monthCarsAmount[i].active==true){
				$scope.minNum=$scope.monthCarsAmount[i].minNum;
				$scope.maxNum=$scope.monthCarsAmount[i].maxNum;
			}
		}
		$scope.getData(
			localStorage.getItem('deptCode')
			,$scope.levelCode
			,signInInfo.deptInfo.deptType
			,$scope.orderName
			,null
			,null
			,$scope.dateType
			,$scope.minNum
			,$scope.maxNum
			);

		
	}

	//导航切换
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			$scope.depts=[];
			if($scope.tag.current == '1'){
				$scope.tag1.current = 0;
				$scope.tag2.current = -1;

				// $scope.depts=[{"deptName":"全部","userId":""}];
				// $scope.depts=$scope.depts.concat($scope.usermap[1].depts);
				// console.log('$scope.depts=='+JSON.stringify($scope.depts));
				// for(var i in $scope.depts){
				// 	$scope.depts[i].num=i;
				// }
				$scope.isNoShowReviewSource=false;
				$scope.isNoShowReviewSalesman =!$scope.isNoShowReviewSalesman;
				if($scope.isNoShowReviewSalesman==false){
					$scope.usermap=[];
				}
			}else if($scope.tag.current == '2'){
				$scope.isNoShowReviewSource=false;
				$scope.isNoShowReviewSalesman=false;
				if($scope.tag.current == '2'){
					$scope.getData(
						localStorage.getItem('deptCode')
						,deptInfo.levelCode
						,signInInfo.deptInfo.deptType
						,null
						,null
						,1
						,null
						,null
						,null
						);
				}
			}else if($scope.tag.current == '3'){
				$scope.isNoShowReviewSalesman=false;
				$scope.sortNum = ++$scope.sortNum;
				$scope.loading = true;
				if($scope.sortNum % 2 == 1){
					$scope.sortOrder = 1;
					$scope.statsList=JsonSortDown($scope.statsList,'allOrderCntThisMonth');
					$scope.loading = false;
					console.log($scope.sortNum+'奇数'+JSON.stringify($scope.statsList));
				}else if($scope.sortNum % 2 == 0){
					$scope.sortOrder = 0;
					$scope.statsList=JsonSortUp($scope.statsList,'allOrderCntLastMonth');
					$scope.loading = false;
					console.log($scope.sortNum+'偶数'+JSON.stringify($scope.statsList));
				}
			}else if($scope.tag.current == '4'){
				$scope.isNoShowChosePop=true;
				// $scope.isNoShowHeader=true;
				$scope.isNoShowReviewSource=false;
				$scope.isNoShowReviewSalesman=false;
			}
		}
	};

	//查看所有业务员
	$scope.tag2={
		current :"-1"
	};
	$scope.actions2 ={
		setCurrent:function(param,levelCode,deptCode,deptName,deptType){
			// console.log('levelCode=='+levelCode);
			// console.log('deptCode=='+deptCode);
			$scope.tag2.current = param;
			$scope.isNoShowReviewSalesman=false;
			$scope.levelCode=levelCode;
			if(param==0){
				$scope.deptCode=$scope.salemanDeptCode;
				$scope.deptName=$scope.saleDeptName;
				if($scope.tag1.current==0){
					for(var i=0 in $scope.usermap){
						$scope.deptName = $scope.usermap[0].deptName;
						$scope.deptCode = $scope.usermap[0].deptCode;
						$scope.levelCode = $scope.usermap[0].levelCode;
					}
				}
			}else{
				$scope.deptCode=deptCode;
				if(deptName.length>=8){
					$scope.deptName=deptName.split('-')[0];
				}else{
					$scope.deptName=deptName;
				}
			}
			// $scope.usermap=[];
			$scope.getData(
				$scope.deptCode
				,$scope.levelCode
				,deptType
				,null
				,null
				,null
				,null
				,null
				,null
				);
		}
	}
	//筛选  排序标准
	$scope.tag4 ={
		current : "-1"
	};
	$scope.actions4 = {
		setCurrent : function(param,index){
			// $scope.tag5.current = -1;
			// $scope.tag6.current = -1;
			// $scope.tag4.current = 1;
			$scope.tag4.current = param;
			for(var i=0 in $scope.sortClasses){
				if(param == $scope.sortClasses[i].num){
					$scope.sortClasses[i].active = true;
				}else{
					$scope.sortClasses[i].active = false;
				}
			}
			// console.log('00=='+param+'11=='+index);
			// console.log('11=='+JSON.stringify($scope.sortClasses));
		}
	}
	//筛选  出卡量
	$scope.tag5 ={
		current : "-1"
	};
	$scope.actions5 = {
		setCurrent : function(param){
			// $scope.tag4.current = -1;
			// $scope.tag6.current = -1;
			$scope.tag5.current = param;
			for(var i=0 in $scope.carsAmount){
				if(param == $scope.carsAmount[i].num){
					$scope.carsAmount[i].active = true;
				}else{
					$scope.carsAmount[i].active = false;
				}
			}
			// console.log('11=='+JSON.stringify($scope.carsAmount));
			
		}
	}
	//筛选  本月出卡量区间
	$scope.tag6 ={
		current : "-1"
	};
	$scope.actions6 = {
		setCurrent : function(param){
			// $scope.tag4.current = -1;
			// $scope.tag5.current = -1;
			$scope.tag6.current = param;
			for(var i=0 in $scope.monthCarsAmount){
				if(param == $scope.monthCarsAmount[i].num){
					$scope.monthCarsAmount[i].active = true;
				}else{
					$scope.monthCarsAmount[i].active = false;
				}
			}
			// console.log('11=='+JSON.stringify($scope.monthCarsAmount));
			
		}
	}

	 //a添加业务员  b添加店铺
    $scope.orgAddSalesman=function(){
    	if(userBo.userType == "000002"){
    		$state.go('org-add-salesman');
    	}else{
    		$state.go('org-add-shop');
    	}
    }
	
	
});