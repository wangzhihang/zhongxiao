appService.factory('unicomm_server', function($q, $http, $rootScope, $ionicLoading, $ionicPopup) {

	var getUnicomm = function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				timeout = arguments[1] ? arguments[1] : 200000,
				json = arguments[0];
				
			json["tms_valid_token"] = tms_valid_token;
			json["business_key"] = authentication["orderNo"] ? authentication["orderNo"] : "";
			json["version"] = version;

			var server = arguments[2] ? arguments[2] : unicommServer;
			if(number_pool == "CBSS" && cbssInfo.ifTest){
				json.agentName = "agencyId_cbss_"+ cbssInfo.username
			}

			if(number_pool == "QRGO2"){
				json.agentName = "agencyId_qrgo_"+ qrgoInfo.userName
			}
			

			$http({
				"method": 'POST',
				"url": "http://"+ server +"/io/getql.asp",
				"data": JSON.stringify(json),
				"timeout": timeout
			}).success(function(data){
				tms_valid_token = guid();
				deferred.resolve(data);
			}).error(function(textStatus, errorThrown){
				$ionicLoading.hide();
				$ionicPopup.alert({
						"title": textStatus,
						"template": alertInfo(errorThrown),
						"okText": '我知道了',
						"okType": 'button-calm'})
				.then(function(){
					deferred.reject(errorThrown);
				});
			});
			return promise;
		};


	var loginCbss = function(){

			var deferred = $q.defer(),
				promise = deferred.promise,
				info = arguments[0];

			if(isEmptyObject(cbssInfo) && isEmptyObject(info) && (!wx_order.rob)){
				$ionicLoading.hide();
				$ionicPopup.alert({
						"title": "提示",
						"template": "没有绑定CBSS账号和发展人,无法使用CBSS功能。请联系您的代理商绑定工号！",
						"okText": '我知道了',
						"okType": 'button-calm'})
				.then(function(){
					deferred.reject("没有绑定CBSS账号和发展人");
				});

			}else{
				var loginInfo = isEmptyObject(info) ? cbssInfo : info;

				var unicommJson = {
					"cmd":"login",
					"username":loginInfo.username,
					"password":loginInfo.password,
					"orgno":loginInfo.orgno
				}

				getUnicomm(unicommJson).then(function(return_json){
					if (return_json.status == '1') {
						deferred.resolve();
					}else if (return_json.status == '9') {
						$ionicPopup.alert({
							"title": "提示",
							"template": "您的代理商CBSS即将过期，请尽快联系您的代理商重新绑定工号或修改密码！<br /><span style='color:#F00'>请通过a工号直接修改CBSS密码。</span>",
							"okText": '我知道了!',
							"okType": 'button-calm'})
						.then(function(){
							deferred.resolve();
						});
					}else if (return_json.status == '10') {
						$ionicLoading.hide();
						$ionicPopup.alert({
							"title": "提示",
							"template": return_json.data,
							"okText": '我知道了!',
							"okType": 'button-calm'})
						.then(function(){
							deferred.reject(return_json.data);
						});
					}
					else {
						$ionicLoading.hide();
						if(return_json.data.indexOf("口令不正确") >= 0){
							data = "您的代理商CBSS密码不正确，请尽快联系您的代理商重新绑定工号或修改密码！<br /><div style='color:#F00'>在代理商没有修改密码前，请勿再提交CBSS相关的订单，以免造成锁号。</div>"
						}else{
							data = alertInfo(return_json.data)
						}
						$ionicPopup.alert({
								"title": "提示",
								"template": data,
								"okText": '我知道了!',
								"okType": 'button-calm'})
						.then(function(){
							deferred.reject(return_json.data);
						});
					}
				},function(data){
					deferred.reject(data);
				});	
			}
			return promise;
		};



	var loginBss = function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				info = arguments[0];

			if(isEmptyObject(bssInfo) && isEmptyObject(info)){
				$ionicLoading.hide();
				$ionicPopup.alert({
						"title": "提示",
						"template": "没有绑定BSS账号和发展人,无法使用BSS功能。请联系您的代理商绑定工号！",
						"okText": '我知道了',
						"okType": 'button-calm'})
				.then(function(){
					deferred.reject("没有绑定BSS账号和发展人");
				});

			}else{
				var loginInfo = isEmptyObject(info) ? bssInfo : info;

				getUnicomm({
						"cmd":"bss_login",
						"vpnusername":"",
						"vpnpassword":"",
						"bssusername":loginInfo.username,
						"bsspassword":loginInfo.password
					}).then(
						function(return_json){
							if(return_json.status == "1"){
								deferred.resolve();
							}else if (return_json.status == '9') {
								$ionicPopup.alert({
									"title": "提示",
									"template": "您的代理商BSS即将过期，请尽快联系您的代理商重新绑定工号或修改密码！<br /><span style='color:#F00'>请通过a工号直接修改BSS密码。</span>",
									"okText": '我知道了!',
									"okType": 'button-calm'})
								.then(function(){
									deferred.resolve();
								});
							}else{
								$ionicLoading.hide();
								if(return_json.data.indexOf("密码错误") >= 0){
									data = "您的代理商BSS密码不正确，请尽快联系您的代理商重新绑定工号或修改密码！<br /><div style='color:#F00'>在代理商没有修改密码前，请勿再提交BSS相关的订单，以免造成锁号。</div>"
								}else{
									data = alertInfo(return_json.data);
								}
								$ionicPopup.alert({
										"title": "提示",
										"template": data,
										"okText": '我知道了!',
										"okType": 'button-calm'})
								.then(function(){
									deferred.reject(return_json.data);
								});
							}
						},
						function(data){
							deferred.reject(data);
						}
					);
			}
			return promise;
		};


	return {

		getUnicomm: getUnicomm

		, cbssLogin:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				info = arguments[0] ? arguments[0] : {};
			if(isEmptyObject(info)){
				$http({
					method:'GET',
					url:ajaxurl + 'userApp/getDefaultUnicomAccount?token=' + $rootScope.token,
				}).success(function(data){
					cbssInfo = {};
					if(data["defaultCbss"].userName){
						cbssInfo = {
							"id":data.defaultCbss.id,
							"username":data.defaultCbss.userName,
							"password":data.defaultCbss.password,
							"orgno":data.defaultCbss.province,
							"developCode":data.defaultCbss.developCode,
							"developName":data.defaultCbss.developName,
							"channelCode":data.defaultCbss.channelCode,
							"channelName":data.defaultCbss.channelName,
							"ifTest":data.defaultCbss.ifTest == "000001",
							"bodyCertification":data.defaultCbss.bodyCertification,
							"identityCard":data.defaultCbss.identityCard
						}
					}
					number_pool = "CBSS";
					if(cbssInfo.username && cbssInfo.developCode && cbssInfo.channelCode){
						loginCbss(info).then(function(){
							deferred.resolve();
						},function(data){
							deferred.reject(data);
						})
					}else{
						$ionicPopup.alert({
							title: '系统提示',
							template: '请联系您的代理商，给您分配CBSS账号!', 
							okType:'button-calm',
							okText:'我知道了'
						}).then(function(){
							deferred.reject();
						});
					}
				}).error(function () {
					$ionicPopup.alert({
						title: '系统提示',
						template: '获取cbss登录信息失败!', 
						okType:'button-calm',
						okText:'我知道了'
					}).then(function(){
						deferred.reject();
					});
				});
			}else{
				// if(info.username && info.developCode && info.channelCode){
					loginCbss(info).then(function(){
						deferred.resolve();
					},function(data){
						deferred.reject(data);
					})
				// }
			}
			
			return promise;
		}

		, bssLogin:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				info = arguments[0] ? arguments[0] : {};
			loginBss(info).then(function(){
				deferred.resolve();
			},function(data){
				deferred.reject(data);
			})
			return promise;
		}

		, marktingLogin:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				info = {};
			if(arguments[0]){
				info = arguments[0]
			}

			getUnicomm({"cmd":"markting_login","username":"WN-13279670872","password":"123456"}).then(function(return_json){
				if(return_json.status == "1"){
					deferred.resolve();
				}else{
					deferred.reject(return_json.data);
				}
			}, function(data){
				deferred.reject(data);
			})
			return promise;
		}
	};



});
