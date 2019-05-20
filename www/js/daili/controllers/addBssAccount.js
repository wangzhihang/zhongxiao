appControllers.controller('add-bss-account', function($scope,$state,unicomm_server,my) {
	$scope.title = '添加BSS工号';
	$scope.btnTxt = '用户身份校验';
	$scope.resState = true;
	$scope.data = {bssAccount:'',bssPwd:''};
	//基础核验
	$scope.check = function(){
		if($scope.data.cbssAccount == '' || $scope.data.cbssPwd == ''){
			$scope.resState = true;
		}else{
			$scope.resState = false;
		}
	}
	//登录BSS
	$scope.signInBss = function(){
		$scope.btnTxt = '正在登录BSS';
		//$scope.resState = true;
		$scope.loading = true;
		//登录CBSS
		var b = new Base64();
		
		unicomm_server.bssLogin({"username": $scope.data.bssAccount, "password": b.encode($scope.data.bssPwd)})
		.then(function(){
			//console.log("1111");
			$scope.btnTxt = '用户身份校验';
			$scope.resState = false;
			$scope.loading = false;
			//保存账号密码（提交时使用）
			localStorage.setItem('bssUserName',$scope.data.bssAccount);
			localStorage.setItem('bssUserPwd',$scope.data.bssPwd);
			$state.go('search-bss-channel');
		},function(){
			//console.log("22222");
			$scope.btnTxt = '用户身份校验';
			$scope.resState = false;
			$scope.loading = false;
		});
	}
});
//BSS渠道查询
appControllers.controller('search-bss-channel', function($scope,$state,unicomm_server,my) {
	$scope.title = '渠道查询';
	$scope.resState = true;
	$scope.btnTxt = '渠道查询';
	$scope.data = {keyWords:''};
	//关键词不能为空
	$scope.changeBtn = function(){
		if($scope.data.keyWords == ''){
			$scope.resState = true;
		}else{
			$scope.resState = false;
		}
	}
	//查询渠道信息
	$scope.query = function(){
		$scope.btnTxt = '正在查询';
		$scope.loading = true;
		$scope.resState = true;
		unicomm_server.getUnicomm({
			cmd:"bss_grouplan_getDealerList"
			,delearkeyword:$scope.data.keyWords
		}).then(
			function(return_json){
				//console.log(return_json);
				$scope.btnTxt = '渠道查询';
				$scope.loading = false;
				$scope.resState = false;
				if (return_json.status == '1') {
					if(return_json.data.length == '1'){
						my.alert('未查询到该渠道，请输入正确渠道关键字！');
					}else{
						//console.log(return_json);
						localStorage.setItem('channelList',JSON.stringify(return_json.data));
						$state.go('bss-channel-list');
					}
				}else{
					my.alert('接口服务器无返回信息!');
				}
			},
			function () {
				$scope.btnTxt = '渠道查询';
				$scope.loading = false;
				$scope.resState = false;
				my.alert('接口服务器无返回信息!');
			}
		)
	}
});

//BSS渠道列表
appControllers.controller('bss-channel-list', function($scope,$state,unicomm_server,my,$ionicLoading) {
	$scope.title = '渠道列表';
	$scope.channelList = JSON.parse(localStorage.getItem('channelList'));
	//选择渠道
	$scope.selected = function(index){
		$ionicLoading.show({
	      template: '正在获取发展人...'
	    });
		unicomm_server.getUnicomm({
			cmd:"bss_querydevelopcode"
			,dealer:$scope.channelList[index].value
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					$ionicLoading.hide();
					//console.log(return_json);
					//保存渠道参数(提交保存时需要)
					localStorage.setItem('channelCode',$scope.channelList[index].value);
					localStorage.setItem('channelName',$scope.channelList[index].name);
//					console.log("渠道："+$scope.channelList[index].name);
//					console.log("编码："+$scope.channelList[index].value);
					var bssDevelopersList = [];
					$(return_json.data).find('option').each(function(){
						bssDevelopersList.push({
							developName:$(this).text(),
							developCode:$(this).attr('value')
						});
						if($(return_json.data).find('option').length < 2){
							my.alert("对不起，该渠道下没有发展人信息，请重新选择！");
						}else{
							localStorage.setItem('bssDevelopersList',JSON.stringify(bssDevelopersList));
							$state.go('bss-developers-list');
						}
					});
				}else{
					my.alert('接口服务器无返回信息!');
				}
			},
			function () {
				my.alert('接口服务器无返回信息!');
			}
		)
	}
});	