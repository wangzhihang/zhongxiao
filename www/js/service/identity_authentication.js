appService.factory('identity_authentication', function($q, $http, $rootScope,url2base64) {

	var startUpload = function(){

		var deferred = $q.defer(),
			promise = deferred.promise;

		url2base64.getBase64Watermark("data:image/jpeg;base64,"+authentication["customerImagebase64"]).then(
			function(base64){
				$http({
					"method": 'POST',
					"url" : ajaxurl + 'imgUpload/startUpload',
					"params": {"token":$rootScope.token},
					"data": {
						"type":"holdcardAndOri",
						"base64":base64.substring(23),
						"originalBase64":authentication["customerImagebase64"]
					}
				}).success(function(data){
					if(data.status == "1"){
						authentication["customerImageUrl"] = data.url;
						authentication["customerImageUrlOriginal"] = data.oriUrl;
						deferred.resolve();
					}else{
						deferred.reject('照片保存失败,请联系管理员!');
					}
				}).error(function(){
					deferred.reject('照片保存失败(系统),请联系管理员!');
				});
			},
			function(){
				deferred.reject("图片添加水印失败!")
			}
		)
		return promise;
	}



	var compare_Face = function(){

		var deferred = $q.defer(),
			promise = deferred.promise,
			data = {
				"name":		authentication["name"],
				"cardId":	authentication["cardId"],
				"idHeadImg":authentication["idHeadImg"],
				"address":	authentication["address"],
				"birthday":	authentication["birthday"],
				"sex":		authentication["gender"],
				"police":	authentication["police"],
				"nation":	authentication["nation"],
				"validEnd":	authentication["end_date"],
				"validStart":  authentication["start_date"],
				"customerImageUrl":authentication["customerImageUrl"],
				"customerImageUrlOriginal":authentication["customerImageUrlOriginal"],
				"orderNo":authentication["orderNo"],
				"telOrderCode":authentication["telOrderNo"],
				"source":source
			};

		if(order_type == "kaika"){
			data["type"] = "000001";
		}else if(order_type == "kuandai"){
			data["type"] = "000002";
		}else if(order_type == "pstn"){
			data["type"] = "000003";
		}

		var url = ""
		if(userBo.userName == "c18602912053" || userBo.userName == "c15664833449"){
			url = "identityApp/compareFaceAndJudgeCard";
		}else{
			url = "identityApp/compareFace";
		}

		$http({
			"method": 'POST',
			"url": ajaxurl + url,
			"params": {"token":$rootScope.token},
			"data": data
		}).success(function(data){
			deferred.resolve(data);
		}).error(function(){
			deferred.reject('身份对比(系统)返回失败');
		});
		return promise;
	};

	var manipulationData = function(data){
		
		var deferred = $q.defer(),
			promise = deferred.promise;

		if(data['result'] === "1"){
			deferred.resolve()
		}else if (data['result'] === "0") {
			deferred.reject("未产生比对结果，请重新拍摄!");
		}else if (data['result'] === "-1") {
			deferred.resolve()
			// deferred.reject("相似度("+data["value"]+")太低，对比失败，请重新拍摄!");
		}else if (data['result'] === "-2") {
			deferred.resolve()
			// deferred.reject("相似度太高，疑似拍摄身份证，请重新拍摄，或进入人工审核!");
		}else{
			var alertInfo = {
				"-3":"照片中无证件或证件不清晰",
				"-4":"照片中证件不清晰"
			}
			deferred.reject(alertInfo[data['result']] ? alertInfo[data['result']] : '比对失败!');
		}
		return promise;
	}


	return {
		compareFace:function(){
			var deferred = $q.defer(),
			promise = deferred.promise;
			// 上传持证照片
			startUpload().then(function(){
				// 人脸对比
				compare_Face().then(function(data){
					// 处理数据
					manipulationData(data).then(function(){
						deferred.resolve();
					},function(data){
						deferred.reject(data);
					})
				},function(data){
					deferred.reject(data);
				})
			},function(data){
				deferred.reject(data);
			})
			return promise;
		}
	}
});