appService.factory('order_create', function($q, $http, $rootScope) {


	var createOrder = function(){

		var deferred = $q.defer(),
			promise = deferred.promise,

			coordinateCity = "",
			startlat = "",
			startlng = "";

		cordova.plugins.locationPlugin.getLocation(function(location) {
			startlat = location.split(",")[0] - 0;
			startlng = location.split(",")[1] - 0;
			coordinateCity = location.split(",")[2] ? location.split(",")[2] : "";
		});
		

		if(order_type == "kaika" && number_pool == "CBSS"){
			if(service_type == "cbssSemiManufactures"){
			}else{
				order_info = {};
			}
			order_info["number"] = service_type == "cbssDealerreturn" ? dianpu_dealerreturn['number'] : telInfo['tel'];
			order_info["productId"] = dianpu_cbss_package_array.sub_productObj.productId;
			order_info["productName"] = dianpu_cbss_package_array.sub_productObj.productName;
			order_info["activityId"] = (dianpu_cbss_package_array.activity.sub_productList[0] ?  dianpu_cbss_package_array.activity.sub_productList[0].productId : "");
			order_info["activityName"] = (dianpu_cbss_package_array.activity.sub_productList[0] ? dianpu_cbss_package_array.activity.sub_productList[0].productName : "");
		}

		if(service_type == "cbssFuka"){
			order_info = {
				"number":telInfo['tel'],
				"productId":"89128067",
				"productName":"4G副卡"
			}
		}

		var data = {
			"name":		authentication["name"],
			"cardId":	authentication["cardId"],
			"idHeadImg":authentication["idHeadImg"],
			"address":	authentication["address"],
			"birthday":	authentication["birthday"],
			"sex":		authentication["gender"],
			"police":	authentication["police"],
			"nation":	authentication["nation"],
			"validEnd":	authentication["end_date"],
			"validStart":	authentication["start_date"],
			"customerImageUrl":"",
			"isCbss":(number_pool == "CBSS" ? "000001" : "000002"),
			"source":source,
			"unicommServer":unicommServer,
			"coordinateCity":coordinateCity
		}
		if(order_type == "kaika"){
			data["type"] 		= "000001";
			data["number"] 		= order_info["number"];
			data["productId"] 	= order_info["productId"];
			data["productName"] = order_info["productName"];
			data["activityId"] 	= order_info["activityId"];
			data["activityName"]= order_info["activityName"];
			data["lnglats"]     = startlat + "," + startlng;
		}else if(order_type == "kuandai"){
			data["type"] 		= "000002";
			data["mainProductName"] = KuandaiMainProductName;
		}else if(order_type == "pstn"){
			data["type"] 		= "000003";
			data["number"] 		= dianpu_pstn["followNumber"];
			data["productId"] 	= order_info["productId"];
			data["productName"] = order_info["productName"];
			data["telNumber"] 	= dianpu_pstn["lanaccount"];
			data["isLong"] 		= "000001";
		}
		if(authentication["orderNo"]){
			data["oldOrderNo"] 	= authentication["orderNo"];
		}
		$http({
			"method": 'POST',
			"url": ajaxurl + 'orderApp/createOrder',
			"params": {"token":$rootScope.token},
			"data": data
		}).success(function(data){
			if(data.status == "1"){
				authentication["orderNo"] = data["orderNo"];
				authentication["telOrderNo"] = data["telOrderNo"];
				deferred.resolve()
			}else{
				deferred.reject(data.msg)
			}
		}).error(function(){
			deferred.reject('保存用户信息失败!');
		});
		return promise;
	};


	return {
		createOrder:createOrder,
	};

});