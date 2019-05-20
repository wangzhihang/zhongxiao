appService.factory('ble', function($q, $cordovaBLE, $timeout, $http, $rootScope) {

	var device2model = function(){
		var BLEname = BLEcurrDevice.name.substring(0,2);
		if(BLEname == "SR"){
			return "senruiPlugin";
		}else if (BLEname == "ST") {
			return "xintongPlugin"
		}else if (BLEname == "KT") {
			var KTname = BLEcurrDevice.name.substring(0,6);
			if(KTname == "KT8003"){
				return "kaerPlugins";
			}else if (KTname == "KT8000") {
				return "kaer8000Plugin"
			}
		}else if (BLEname == "HO") {
            return "hengondaPlugin"
        }
	};


	var sortingIdentity = function(data){
		var return_json = data.split(":");
		var json = {"show":{}, "list":{}};

		json["show"]["birthday"] = {
				"Y":return_json[7].substring(0,4),
				"M":return_json[7].substring(4,6),
				"D":return_json[7].substring(6,8)
			};
		json["show"]["limitedPeriod"] = return_json[15];


		json["list"]["name"]= trim(return_json[1]);		// 姓名
		json["list"]["gender"] = trim(return_json[3]);	// 性别
		json["list"]["nation"] = trim(return_json[5]);	// 民族
		json["list"]["birthday"] = json["show"]["birthday"]["Y"]+"-"+json["show"]["birthday"]["M"]+"-"+json["show"]["birthday"]["D"];
		json["list"]["address"]=trim(return_json[9]);
		json["list"]["cardId"]= trim(return_json[11]);
		json["list"]["police"] = trim(return_json[13]);	// 签证机关
		json["list"]["start_date"] = return_json[15].split("-")[0].replace(/[\r\n]/g, "").replace(/\./g,"-");
		json["list"]["end_date"] = return_json[15].split("-")[1].replace(/[\r\n]/g, "").replace(/\./g,"-");
		json["list"]["idHeadImg"]=trim(return_json[17]);
		json["list"]["dn"]=return_json[19] ? trim(return_json[19]) : "";

		if(json["list"]["end_date"].indexOf("长期") != "-1"){
			json["list"]["end_date"] = "2099-12-31"
		}
		return json;
	};


	// 判断<kaerPlugins>蓝牙解码服务器 是否可接
	var BLEconnectServer = function(){
		var deferred = $q.defer(),
			promise = deferred.promise;

		var BLEname = BLEcurrDevice && BLEcurrDevice.name && BLEcurrDevice.name.substring(0,2);
		if (BLEname == "KT") {
			cordova.plugins.kaerPlugins.connectServer(1,function(data){
				if(data == 0 ){
					deferred.resolve();
				}else{
					deferred.reject();
				}
			},function () {
				deferred.reject();
			});
		}else{
			deferred.resolve();
		}
		return promise;
	};


	var BLEconnectServer_SR = function(){
		var BLEname = BLEcurrDevice.name.substring(0,2);
		if(BLEname == "SR"){
			cordova.plugins[device2model()].connectServer(senruiAccount.account,senruiAccount.password,senruiAccount.key, senruiList[senruiActive].senruiSever, "6000");
		}
	};


	var BLEdis = function(){
		
		var deferred = $q.defer(),
		promise = deferred.promise;

		cordova.plugins[device2model()].disconnectBluetooth(BLEcurrDevice.adder,function(data){
			deferred.resolve();
		},function (data) {
			deferred.reject();
		});
		return promise;
	};


	var SenruiVisitRecord = function(){
		var status = arguments[0];
		var BLEname = BLEcurrDevice.name.substring(0,2);
		if(BLEname == "SR"){
			$http({
				method: 'GET',
				url: ajaxurl + 'senruiApp/insertSenruiVisitRecord',
				params: {
					"senruiSever":senruiList[senruiActive].senruiSever,
					"visitTime":(status == "000001" ? arguments[1] : "0000"),
					"system":device.platform,
					"status":status,
					"token":$rootScope.token
				}
			});
			if(status == "000004" || arguments[1] > 5000){
				senruiActive = senruiActive-0+1;
				if(senruiActive > senruiList.length -1){
					senruiActive = 0;
				}
			}
		}
	};


	return {

		BLEconnectServer:BLEconnectServer,

		BLEdis:BLEdis,  // 断开设备连接

		BLEfind:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,

				Device = [];

			$cordovaBLE.enable();//开启蓝牙
			$cordovaBLE.startScan([],
				//搜索成功回调方法【返回搜索到的设备信息】
				function (device) {
					var tempDevice = {
						name: device.name,
						adder: device.id
					}
					if(tempDevice.name.substring(0, 6) == 'KT8003'){
						Device.push(tempDevice);
					}else if(tempDevice.name.substring(0, 6) == 'KT8000'){
						Device.push(tempDevice);
					}else if(tempDevice.name.substring(0, 2) == 'SR'){
						Device.push(tempDevice);
					}else if(tempDevice.name.substring(0, 2) == 'ST'){
						Device.push(tempDevice);
					}else if(tempDevice.name.substring(0, 3) == 'HOD'){
                        Device.push(tempDevice);
                    }
				}, function () {//搜索失败回调方法
					deferred.reject();
				}
			);

			//5秒后停止搜索
			$timeout(function () {
				deferred.resolve(Device);
				$cordovaBLE.stopScan();
			}, 5 * 1000);

			return promise;
		},

		BLEscan:function(){
			var deferred = $q.defer(),
				promise = deferred.promise;

			cordova.plugins[device2model()].scanBluetooth(BLEcurrDevice.adder,function(data){
				deferred.resolve(data);
			},function (data) {
				BLEcurrDevice = [];
				deferred.reject("error", data.name+"连接失败,请重新确定蓝牙设备是否在身边!");
			});
			return promise;
		},

		BLEreadIdentity:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				date;
			BLEconnectServer_SR();
			var BLEname = BLEcurrDevice.name.substring(0,2);
			if(BLEname == "SR"){
				date = new Date().getTime();
			}
			cordova.plugins[device2model()].readIdentity(BLEcurrDevice.adder,function(data){
				SenruiVisitRecord("000001", (new Date().getTime() - date));
				BLEdis();
				deferred.resolve(sortingIdentity(data));
			},function () {
				SenruiVisitRecord("000004");
				deferred.reject();
			});
			return promise;
		},


		NFCreadIdentity:function(){
			var deferred = $q.defer(),
				promise = deferred.promise;
			cordova.plugins.senruiPlugin.readNFC(1,function(data){
				deferred.resolve(sortingIdentity(data));
			},function(){
				deferred.reject();
			});
			return promise;
		},

		BLEreadSim:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				judge = arguments[0];

			BLEconnectServer_SR();
			if(BLEcurrDevice.name.substring(0,2) == "SR" || BLEcurrDevice.name.substring(0,2) == "ST" || BLEcurrDevice.name.substring(0,2) == "HO"){
				cordova.plugins[device2model()].readIccid(BLEcurrDevice.adder,
					function(data){
						var dataArray = data.split(":");
						if(judge){
							deferred.resolve(dataArray[1]);
						}else{
							dataArray[0] == "白卡" ? deferred.resolve(dataArray[1]) : deferred.reject("(" + BLEcurrDevice.name.substring(0,2) + ")非白卡");
						}
					},function (data) {
						data = data ? data : "获取卡号失败!";
						deferred.reject("(" + device.platform + "-" + BLEcurrDevice.name.substring(0,2) + ")" + data + "<br><span style='color:#F00'>没有找到阅读器请重新启动手机蓝牙；并确认您的SIM卡插入方式正确；写卡器没有自动关机！<span>");
					}
				);
			}else if(BLEcurrDevice.name.substring(0,2) == "KT"){
				cordova.plugins[device2model()].readImsi(BLEcurrDevice.adder,
					function(data){
						if(data.indexOf("非白卡") === -1 || judge){
							cordova.plugins[device2model()].readIccid(BLEcurrDevice.adder,
								function(data){
									deferred.resolve(data);
								},function (data) {
									data = data ? data : "获取卡号失败!";
									deferred.reject("("+device.platform+"-KT)" + data + "<br><span style='color:#F00'>没有找到阅读器请重新启动手机蓝牙；并确认您的SIM卡插入方式正确；写卡器没有自动关机！<span>");
								});
						}else{
							deferred.reject("(KT)非白卡");
						}
					},function (data) {
						data = data ? data : "非白卡或SIM卡不可用!";
						deferred.reject("("+device.platform+"-KT)" + data);
					}
				);
			}

			return promise;
		},

		BLEwriteSim:function(imsi, xoption){
			var deferred = $q.defer(),
				promise = deferred.promise;

			BLEconnectServer_SR();
			if(BLEcurrDevice.name.substring(0,2) == "SR" || BLEcurrDevice.name.substring(0,2) == "ST" || BLEcurrDevice.name.substring(0,2) == "HO"){
				cordova.plugins[device2model()].writeSim(BLEcurrDevice.adder,imsi,xoption,function(data){
					BLEdis();
					deferred.resolve(data);
				},function (data) {
					data = data ? data : "写入失败!";
					deferred.reject("(" + device.platform + "-" + BLEcurrDevice.name.substring(0,2) + ")" + data + "<br>没有找到阅读器<br>请重新启动手机蓝牙，确认您的SIM卡插入方式正确，写卡器没有自动关机！<br><span style='color:#F00'>请不要换卡!!!<span>");
				});
			}else if(BLEcurrDevice.name.substring(0,2) == "KT"){
				cordova.plugins[device2model()].writeImsi(BLEcurrDevice.adder,imsi,
					function()
					{
						cordova.plugins[device2model()].writeSmsc(BLEcurrDevice.adder,xoption.substring(2),function(){
								deferred.resolve("写入SIM卡成功!");
							},function (data) {
								data = data ? data : "写入失败!"
								deferred.reject("("+device.platform+"-KT-xoption)" + data + "<br>没有找到阅读器<br>请重新启动手机蓝牙，确认您的SIM卡插入方式正确，写卡器没有自动关机！<br><span style='color:#F00'>请不要换卡!!!<span>");
							}
						)
					},function (data) {
						data = data ? data : "写入失败!"
						deferred.reject("("+device.platform+"-KT-imsi)" + data + "<br>没有找到阅读器<br>请重新启动手机蓝牙，确认您的SIM卡插入方式正确，写卡器没有自动关机！<br><span style='color:#F00'>请不要换卡!!!<span>");
					}
				)
			}
			return promise;
		},

		BLEreadImsi:function() {
			var deferred = $q.defer(),
				promise = deferred.promise;

			var BLEname = BLEcurrDevice.name.substring(0,2);
			var KTname = BLEcurrDevice.name.substring(0,6);
			if (BLEname == "SR" || KTname == "KT8003" || BLEname == "HO") {
				BLEconnectServer_SR();
				cordova.plugins[device2model()].readImsi(BLEcurrDevice.adder, function(data){
                	BLEdis();
					var dataArray = data.split(":");
					deferred.resolve(dataArray[1]);
				}, function (data) {
					deferred.reject(data);
				});
			} else {
				deferred.reject("暂时只有森锐、卡尔8003和恒鸿达U53设备支持废卡重置功能");
			}
			return promise;
		},
		
		BLEresetSim:function(apdu) {
			var deferred = $q.defer(),
				promise = deferred.promise;
			BLEconnectServer_SR();
			cordova.plugins[device2model()].resetSim(BLEcurrDevice.adder, apdu, function(data){
				BLEdis();
				deferred.resolve(data);
			}, function (data) {
				deferred.reject(data);
			});
			return promise;
		}
	};
});