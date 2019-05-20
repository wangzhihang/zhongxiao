appControllers.controller('market-addnewadds', function($scope,$http,$rootScope,$state,my) {
	$scope.title = '添加新地址';
	$scope.loading=true;
	$scope.ww = true;
	$scope.xx = true;
	$scope.isNoShowHeader=false;
	$scope.isNoShowArea=false;
	$scope.provinceList = [];
	$scope.cityList  = [];
	$scope.orgList_1 = [];
	$scope.status='000001';

	$scope.oldAddress=localStorage.getItem('oldAddress');
	if($scope.oldAddress==null){
		$scope.formInfo = {
			disId:'',
			receiveName:'',
			receivePhone:'',
			receiveAddress:'',
			province:'',
			city:''
		};
	}else{
		$scope.formInfo = {
			disId:'',
			receiveName:JSON.parse($scope.oldAddress).receiveName,
			receivePhone:JSON.parse($scope.oldAddress).receivePhone,
			receiveAddress:JSON.parse($scope.oldAddress).receiveAddress,
			province:JSON.parse($scope.oldAddress).province,
			city:JSON.parse($scope.oldAddress).city
			
		};
		$scope.arearValue=JSON.parse($scope.oldAddress).province+ ' ' +JSON.parse($scope.oldAddress).city;
	}
	


	
	/***************获取基础信息***************/
	//获取表单初始值信息
	
	$scope.wxClick=function(){
		$scope.ww=!$scope.ww;
	}

	$scope.addressClick=function(){
		$scope.xx=!$scope.xx;
	}
	//选择省份
	$scope.selectProvince = function(e){
		console.log("e=="+JSON.stringify(e));
	if(e != null){
		getCityInfo(e.cateCode);
		}
	};
	//选择城市
	$scope.selectCity = function(e){
		if(e!= null){
			$scope.formInfo.disId = e.cateCode;
		}
	};
	
	//所有市
	function getCityInfo(e){
		$scope.cityList = [];
		$http({
			method:'get',
			url:ajaxurl + 'userApp/queryCityList',
			params:{province:e}
		}).success(function(data){
			console.log("shi"+JSON.stringify(data));
			//console.log("biangbiang"+JSON.stringify(data));
			$scope.cityList = data.cityList;
		}).error(function(){
			my.alert('服务器请求失败');
		});
	}
	
	//所有省
	 $scope.registerInfo =function(){
		$http({
			method:'get',
			url:ajaxurl + 'userApp/queryAllProvince?token=' + $rootScope.token,
			params:{}
		}).success(function(data){
			console.log("sheng"+JSON.stringify(data));
			//console.log("wahaha"+JSON.stringify(data));
			$scope.provinceList = data.provinceList;		//暂时显示陕西
			getCityInfo(8610000);
		}).error(function(){
			my.alert('服务器请求失败');
		});	
	};
	$scope.registerInfo();

	// 显示区域
	$scope.choseCity=function  () {
		$scope.isNoShowHeader=true;
		$scope.isNoShowArea=true;
	}
	//关闭区域
	$scope.closeCity=function (){
		$scope.isNoShowHeader=false;
		$scope.isNoShowArea=false;
	}
	
	$scope.tag = {
		current: "1",
		current1: "27"
	};
	$scope.province = "陕西";
	$scope.actions = {
		// 市
		setCurrent: function (param) {

			$scope.tag.current = JSON.parse(param).id;
			$scope.city=JSON.parse(param).cateName;
			if($scope.city=="无数据"){
				$scope.city="";
				$scope.formInfo.disId = $scope.disId;
			}else {
				$scope.formInfo.disId = JSON.parse(param).cateCode;
				$scope.arearValue=$scope.province+ ' ' + $scope.city;
				localStorage.setItem('city',$scope.city);
			}
			$scope.closeCity();
		},
		// 省
		setCurrent1: function (param) {
			//console.log(param);
			$scope.tag.current1 = JSON.parse(param).id;
			$scope.province=JSON.parse(param).cateName;
			$scope.selectProvince(JSON.parse(param));
			$scope.disId = JSON.parse(param).cateCode
		}
  };
  
  
//验证手机号码
// $scope.save=function(){
//   if($scope.formInfo.receivePhone == ''){
// 									my.alert('请输入手机号码');
// 								}else if($scope.formInfo.receivePhone.length < 11 
// 								   || $scope.formInfo.receivePhone.length > 11){
// 									my.alert('请正确输入手机号码');
// 								}
  
//  } 
  //保存信息返回并传值给地址管理页
	  $scope.finshSelect=function(){
	  	//console.log($scope.formInfo);
	  	$http({
			method:'post',
			url:ajaxurl + 'ehUser/addReceive?token=' + $rootScope.token,
			data:{
					status:$scope.status,
					province:$scope.province,
					city:$scope.city,
					receiveName:$scope.formInfo.receiveName,
					receivePhone:$scope.formInfo.receivePhone,
					receiveAddress:$scope.formInfo.receiveAddress,
			}
		}).success(function(data){
			$scope.loading=false;
			$state.go("market-adds");
		});	
	}
  
	//修改地址
	$scope.editAddress = function(){
		if($scope.city==''){
			$scope.province=JSON.parse($scope.oldAddress).province;
			$scope.city=JSON.parse($scope.oldAddress).city;
		}
		$http({
			method:'post',
			url:ajaxurl + 'ehUser/updateReceive?token=' + $rootScope.token,
			data:{	
					id:JSON.parse($scope.oldAddress).id,
					status:$scope.status,
					province:$scope.province,
					city:$scope.city,
					receiveName:$scope.formInfo.receiveName,
					receivePhone:$scope.formInfo.receivePhone,
					receiveAddress:$scope.formInfo.receiveAddress,
			}
		}).success(function(data){
			console.log("?11 "+JSON.stringify(data))
			localStorage.removeItem("oldAddress");	
			$state.go("market-adds");
		});	
	}

	//保存
	$scope.save = function(){
		if($scope.ifSetdeDefault==false){
			$scope.status='000002';
		}
		if($scope.oldAddress==null){
			$scope.finshSelect();
		}else{
			$scope.editAddress()
		}
	}

	$scope.ifSetdeDefault=true;
	//是否设置默认值
	$scope.setDefault= function(ifSetdeDefault){
		//console.log(ifSetdeDefault);
		$scope.ifSetdeDefault=ifSetdeDefault;
	}
});




