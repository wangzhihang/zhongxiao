appService.factory('url2base64', function($q,  $timeout, $filter) {

	return {

		getBase64:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				image = document.createElement('img');

			image.crossOrigin="anonymous";
			image.src = arguments[0];
			image.onload = function(){
				var canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, image.width, image.height);
				deferred.resolve(canvas.toDataURL("image/jpeg", 0.7))
			}

			$timeout(function () {
				deferred.reject("图片转化失败!");
			}, 20 * 1000);

			return promise;
		},

		canvasCutHalf:function (){
			var deferred = $q.defer(),
				promise = deferred.promise,
				canvas = document.createElement('CANVAS'),
				ctx = canvas.getContext('2d'), 
				img = new Image; 
			img.crossOrigin = 'Anonymous';
			img.src = arguments[0];
		
			img.onload = function(){
				var width = img.width;
				var height = img.height;
				canvas.width = width/2;
				canvas.height = height/5*3;
				ctx.drawImage(img,0,0,width,height,(0-width/2),(0-height/5),width,height); 
				deferred.resolve(canvas.toDataURL('image/jpeg', 0.6));
			}
			$timeout(function () {
				deferred.reject("图片转化失败!");
			}, 20 * 1000);

			return promise;
		},

		getBase64Watermark:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				img = document.createElement('img'),
				imgLogo = document.createElement('img');

			var canvas = document.createElement('CANVAS');
			var ctx = canvas.getContext('2d');
			img.crossOrigin="anonymous";
			img.onload=function(){
				var width = img.width;
				var height = img.height;
				canvas.width = width;
				canvas.height = height;
				// 白背景
				ctx.fillStyle = "#fff";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				// 图片
				ctx.drawImage(img,0,0,width,height,0,0,width,height);
				// 水印
				// if(["8120000","0500000","8800000"].indexOf(shopInfo.shopBo.city) !== -1){
				// 	ctx.font="normal normal normal 18px";
				// 	ctx.fillStyle = "rgba(255,255,255,1)";
				// 	var txt = sprintf(
				// 		"China Unicom {date} {username} {channelCode}", 
				// 		{
				// 			"date":$filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss '),
				// 			"username":(cbssInfo.username ? cbssInfo.username : ""),
				// 			"channelCode":(cbssInfo.channelCode ? cbssInfo.channelCode : "")
				// 		}
				// 	);
				// 	ctx.shadowBlur=2;
				// 	ctx.shadowColor="rgba(0,0,0,1)";
				// 	ctx.fillText(txt,50,40);
				// 	ctx.fillText(txt,400,720);
				// }else{
					ctx.rotate(45*Math.PI/180);
					ctx.font="28px Arial";
					ctx.fillStyle = "rgba(255,0,0,0.6)";
					for (var i=-1; i<4; i++) {    
						for (var j=-1; j<3; j++) {
							ctx.fillText("仅限办理联通业务使用"+ $filter('date')(new Date(),'yyyyMMddHHmmss'),-100+i*600,-90+j*400); 
						}
					}
					ctx.rotate(-45*Math.PI/180);
				// }
				// 图标
				if(["8120000","0500000","8800000"].indexOf(shopInfo.shopBo.city) !== -1){
					deferred.resolve(canvas.toDataURL('image/jpeg', .8)); 
				}else{
					imgLogo.onload=function(){
						ctx.drawImage(imgLogo,0,0,128,128);
						deferred.resolve(canvas.toDataURL('image/jpeg', .8)); 
					}
					imgLogo.src = 'data:image/png;base64,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';
				}
			}
			img.src = arguments[0];

			return promise;
		},

		getCropperWhether:function(){

			var deferred = $q.defer(),
				promise = deferred.promise,
				image = document.createElement('img');

			image.onload = function(){
				if(image.width<image.height){
					deferred.reject()
				}
				if(image.width > 1040){
					deferred.resolve(true);
				}else{
					deferred.resolve(false)
				}
			}
			image.src = arguments[0];
			return promise;
		},

		getCroppedCanvas:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				$image = $('#'+cropperID),
				uploadedImageType = 'image/jpeg',
				data = arguments[0],
				cropper = $image.data('cropper'),
				result;

			if (cropper && data.method) {
				data = $.extend({}, data); // Clone a new one
				if (typeof data.target !== 'undefined') {
					$target = $(data.target);
					if (typeof data.option === 'undefined') {
						try {
							data.option = JSON.parse($target.val());
						} catch (e) {
							console.log(e.message);
						}
					}
				}
				cropped = cropper.cropped;
				switch (data.method) {
					case 'rotate':
						if (cropper.cropped) {
							$image.cropper('clear');
						}
						break;
					case 'getCroppedCanvas':
						if (uploadedImageType === 'image/jpeg') {
						if (!data.option) {
							data.option = {};
						}
						data.option.fillColor = '#fff';
						}
						break;
				}
				result = $image.cropper(data.method, data.option, data.secondOption);
				if(data.method == "rotate"){
					if (cropped) {
						$image.cropper('crop');
					}
				}else if(data.method == "scaleX" || data.method == "scaleX"){
					$(this).data('option', -data.option);
				}else if(data.method == "getCroppedCanvas"){
					if (result) {
						console.log("getCroppedCanvas - ok");
						deferred.resolve(result.toDataURL("image/jpeg",0.8));
					}else{
						deferred.reject();
					}
				}
				else{
				}
			}
			return promise;
	},

	// ss:function(){
	// 	var deferred = $q.defer(),
	// 		promise = deferred.promise,
	// 		img = document.createElement('img'),
	// 		imgLogo = document.createElement('img');

	// 	var canvas = document.createElement('CANVAS');
	// 	var ctx = canvas.getContext('2d');
	// 	img.crossOrigin="anonymous";
	// 	img.onload=function(){
	// 		var width = img.width;
	// 		var height = img.height;
	// 		canvas.width = width;
	// 		canvas.height = height;
	// 		// 白背景
	// 		ctx.fillStyle = "#fff";
	// 		ctx.fillRect(0, 0, canvas.width, canvas.height);
	// 		// 图片
	// 		ctx.drawImage(img,0,0,width,height,0,0,width,height);
	// 		// 水印
	// 		console.log(arguments)
	// 		console.log('data:image/jpeg;base64,'+arguments[0])
	// 			imgLogo.onload=function(){
	// 				ctx.drawImage(imgLogo,0,0,128,128);
	// 				deferred.resolve(canvas.toDataURL('image/jpeg', .8)); 
	// 			}
	// 			imgLogo.src = 'data:image/jpeg;base64,'+arguments[0];

	// 	}
	// 	img.src = "img/zzz.png";

	// 	return promise;
	// },
}
});