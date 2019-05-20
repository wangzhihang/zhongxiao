appControllers.controller('dianpu-my-code', function($scope,$rootScope,my) {
	$scope.title = "我的二维码";
	$scope.login=JSON.parse(localStorage.getItem("login"));
	//console.log($scope.login);

//	console.log($scope.login.password);
	if(shopInfo["shopBo"]){
		$scope.shopName=shopInfo["shopBo"].shopName;
		$scope.shopTel=shopInfo["shopBo"].shopTel;
	}
//	console.log($scope.shopName);
	//console.log(shopInfo);
	$scope.textUrl="http://z.haoma.cn/yinliu/go?c=" + userBo.userId+"s";
	console.log($scope.textUrl);
	angular.element("#qrbox").qrcode({ 
		  "render": "canvas"
		, "width": 240
		, "height":240
		, "text": $scope.textUrl
	}); 
//	console.log(shopInfo["shopUrl"]);

	$scope.share=function(){
		//console.log("分享");
		html2canvas(angular.element(".myCode"), {
           		 allowTaint: true,
           		 taintTest: false,
           		 onrendered: function(canvas) {
                            canvas.id = "mycanvas";
                            //document.body.appendChild(canvas);
                            //生成base64图片数据
                            var  dataUrl = canvas.toDataURL();
                            dataUrl=dataUrl.substring(22);
                            //console.log("dataUrl==="+dataUrl);

                            // var newImg = document.createElement("img");
                            // newImg.src =  dataUrl;
                            // document.body.appendChild(newImg);
                            //0：纯文字（description）1：image；2：all
                            	cordova.plugins.sharePlugin.share({
									title:"",
									description:"",
									image:dataUrl,
									url:"",
									category:"1"
								});
                        },
                     });
		
		
	}



	//调用保存二维码图片的函数  
	$scope.saveImageQrcode = function () {  
		var canvas = document.getElementsByTagName("canvas")[0];
	    // console.log(window.canvas2ImagePlugin);  
	    window.canvas2ImagePlugin.saveImageDataToLibrary(function (msg) {  
	            console.log(msg);  
	            my.alert('图片已保存');  
	        },  
	        function (err) { 
	            console.log(err);  
	        },   
	       canvas
	    )  
	};




})