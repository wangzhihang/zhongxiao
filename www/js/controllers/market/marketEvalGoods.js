appControllers.controller('market-evalgoods', function($scope,$stateParams,$http,$stateParams,$rootScope,my,$cordovaCamera,$state) {
	$scope.title = '评价晒单';
	$scope.ww=true;
	$scope.productCode=$stateParams.productCode;
	$scope.orderCode=$stateParams.orderCode;
	$scope.goodsStatus=$stateParams.goodsStatus;
	$scope.goodsId=$stateParams.goodsId;
	// $scope.productInfo=$stateParams.productInfo;
	$scope.id='';
    $scope.userName='';
	$scope.score='';
	$scope.content='';
	$scope.img='';
	$scope.status='';

	$scope.evalContent='';

	console.log("shangpinbianma"+  $scope.productCode)
	console.log("商品状态"+  $scope.goodsStatus)
	// console.log("dingdanxiang"+  $scope.productInfo)

		
	//订单详情
	// $scope.getInfoData=function(orderCode){
	// 	$http({
	//             method:'GET',
	//             url:ajaxurl + 'ehOrder/findOneEhOrder?token=' + $rootScope.token,
	//             params:{ 
	//             	orderCode:orderCode
	//             }
	//             }).success(function(data){
	//          		console.log("订单详情data==== "+ JSON.stringify(data))
	//          			$scope.orderItemList=data.orderItemList;
	//          	}).error(function(){
	// 					my.alert("遇到问题，请重试12121212");
	// 			});
	// }
	
	
	// $scope.getInfoData($scope.orderCode);

	//根据商品编码获取详情，提取mainImg
	$scope.getInfoData=function(productCode){
		$http({
	            method:'GET',
	            url:ajaxurl + 'ehProduct/productDetail?',
	            params:{ 
	            	productCode:$scope.productCode
	            }
	            }).success(function(data){
						console.log("商品详情data==== "+ JSON.stringify(data))
	         			$scope.thisImg=data.product.imgMain;
	         	}).error(function(){
						
				});
	}
	
	$scope.getInfoData($scope.productCode);





	//商品单项评分
	$scope.starScore=[{id:1,status:false},{id:2,status:false},{id:3,status:false},{id:4,status:false},{id:5,status:false}];
	$scope.starLeval=function(e){
		console.log("???????????"+$scope.starScore[e].id)
		for(var k in  $scope.starScore){
			if(k<=e){
				$scope.starScore[k].status=true;
			}else{
				$scope.starScore[k].status=false;
			}
		}
		$scope.score=$scope.starScore[e].id;
		console.log("pingfen"+  $scope.score)
	}

	// 添加文字评价
	// $scope.addEvalContent=function(){
	// 	$scope.evalContent
	// }
	
	console.log("yonghupingjia"+$scope.evalContent);
	
	//添加评论图片
	// //设置头像
	// $scope.photograph = function(){
	// 	$cordovaCamera.getPicture({
	// 		quality: 70,
	// 		destinationType: Camera.DestinationType.DATA_URL,
	// 		sourceType: Camera.PictureSourceType.CAMERA,
	// 		allowEdit: true,
	// 		encodingType: Camera.EncodingType.JPEG,
	// 		targetWidth: 320,
	// 		targetHeight: 320,
	// 		popoverOptions: CameraPopoverOptions,
	// 		saveToPhotoAlbum: false,
	// 		correctOrientation:true
	// 	}).then(function(imageData) {
	// 		$scope.avatar = "data:image/jpeg;base64," + imageData;
	// 		$scope.uploadAvatar();
	// 	}, function(err) {
	// 		//...
	// 	});
	// };
	// //上传照片
	// $scope.uploadAvatar = function(){
	// 	$http({
	// 		  "method": 'post'
	// 		, "url" : 'http://sfz.tiaoka.com/appUserAvatar/fileupload.php'
	// 		, "data": {img:$scope.avatar.substring(23)}
	// 	}).success(function(data){
	// 		$scope.avatar = "http://sfz.tiaoka.com/appUserAvatar/"+data["url"];
	// 		$scope.saveAvatar();
	// 	}).error(function(data){
	// 		my.alert('照片上传失败,请联系管理员!').then(function(){
	// 			$scope.avatar = 'img/logo.png';
	// 		});
	// 	});
	// };
	// //保存头像
	// $scope.saveAvatar = function(){
	// 	$http({
	// 		method:'get',
	// 		url:ajaxurl + '/userApp/saveHeadImage?token=' + $rootScope.token,
	// 		params:{imageUrl:$scope.avatar}
	// 	}).success(function(data){
	// 		//...上传成功
	// 	}).error(function(){
	// 		my.alert('照片保存失败,请重新拍摄！').then(function(){
	// 			$scope.avatar = 'img/logo.png';
	// 		});
	// 	});
	// };

	// 是否匿名评价
	$scope.wxClick=function(){
		$scope.ww=!$scope.ww;
		
		console.log("勾选==="+$scope.ww);

		if($scope.ww==true){
			$scope.userName="匿名用户";
		}
		if($scope.ww==false){
			$scope.userName="000001";
		}
		// console.log("====~~~"+$scope.userName);
		// $scope.ww=!$scope.ww;
		// console.log("？？？~~~"+$scope.userName);
	}
 		$scope.input={"evalContent":""};
	
	// 添加一条订单内单项商品评价                 id,userName,score,content,img,status
	$scope.evalIsOk=function(){
		
		// console.log("yonghupingjia???"+$scope.input.evalContent);
		console.log("是否匿名==="+$scope.userName);
	$http({
	            method:'post',
	            url:ajaxurl + 'ehOrder/addOrderItemAssess?token='+$rootScope.token,
	            data:{ 
	            	  id:$scope.goodsId,//商品编码   订单号：457274433453
    				  userName:$scope.userName,//评论人是否匿名状态
    				  score:$scope.score,//评分
					  content:$scope.input.evalContent,//评价内容
					  img:$scope.img,//评价晒图
					  // status:$scope.goodsStatus//订单商品状态
					  status:"000002"//订单商品状态
	            }
	            }).success(function(data){
	         			console.log("单项评价"+  JSON.stringify(data))
						my.alert("评价成功，即将返回您的订单！");	
						$state.go("market-myord");
				}).error(function(){
						my.alert("遇到问题，请重试12121212");
				});
		}

	
});
