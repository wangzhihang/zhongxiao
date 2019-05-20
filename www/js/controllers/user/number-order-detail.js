appControllers.controller('numberOrderDetail', function($scope, $rootScope, $http, $state, $ionicPopup, $ionicLoading, my) {
    $scope.title = '号码订单详情';
    $scope.orderDetail = {};
    $scope.loading = false;
    $scope.eleOrder = '';
    $scope.hasElectronicWorksheets = false;
    $scope.numberActive = true;
    $scope.failedOrderList = [];
    // $ionicLoading.show({template: '数据加载中...'});
    $scope.isShowBigPic = false;
    $scope.isNoShowHeader = false;
    $http({
        method: 'GET',
        url: ajaxurl + "numberOrderApp/queryNumberOrderDetailByOrderCode?token=" + $rootScope.token,
        params: { "orderCode": order["orderCode"] },
        timeout: 5000
    }).success(function(data) {
        // $ionicLoading.hide();
        //console.log(JSON.stringify(data));
        $scope.loading = true;
        $scope.orderDetail = data["orderDetail"];
        $scope.status = $scope.orderDetail.status;
        //根据经纬度获取并显示地图
        $scope.isShowMapContainer = true;
        $scope.lnglats = $scope.orderDetail.lnglats;
        // console.log("lnglats==="+$scope.lnglats);
        $scope.lnglarArr = [];
        $scope.getMap = function() {
            var map = new AMap.Map('numberMapContainer', {
                center: [$scope.longitude, $scope.latitude],
                zoom: 16
            });
            var marker = new AMap.Marker({
                position: [$scope.longitude, $scope.latitude],
                map: map
            });
        }
        if ($scope.lnglats == null || $scope.lnglats == "") {
            $scope.isShowMapContainer = false;
        } else {
            $scope.lnglarArr = $scope.lnglats.split(',');
            $scope.longitude = $scope.lnglarArr[0];
            $scope.latitude = $scope.lnglarArr[1];
            if($scope.longitude && $scope.latitude){
                $scope.getMap();
            }else{
                $scope.isShowMapContainer = false;
            }
        }

        //是否有活动
        /*if(scope.orderDetail.remark==null||scope.orderDetail.remark==""){
        	$scope.numberActive=false;
        }
        else{
        	$scope.numberActive=true;
        }*/
        //适配宽照片
        $scope.imgAdapt = function(imgSrc){
            var img = new Image(); 
            img.src =  imgSrc; 
            img.onload = function(){
                if(img.width > img.height){
                    $scope.imgProp = {
                        'max-height': '27vw',
                        'height': '110px'
                    }
                }
            }
        }

        $scope.viewElectronicWorksheets = true;
        //人脸比对图片展示
        $scope.idCardHeadUrl = $scope.orderDetail.idCardHeadUrl;
        $scope.imgAdapt($scope.idCardHeadUrl);
        $scope.customerImgUrl = $scope.orderDetail.customerImageUrl;
        $scope.imgAdapt($scope.customerImgUrl);
        $scope.signUrl = $scope.orderDetail.signUrl;
        // console.log($scope.idCardHeadUrl);
        if($scope.signUrl.substring(25, 29) == 'null'){
        	$scope.showBtn = true;
        }else{
        	$scope.showBtn = false;
            $scope.imgAdapt($scope.signUrl);
        }
       
        //如果"source == 000008 显示身份证正面照片"
        if (data.orderDetail.source == '000008') {
            $scope.idCardHeadUrl = data.orderDetail.idCardImageBackUrl;
            $scope.imgAdapt(scope.idCardHeadUrl);
        }

        
        $scope.eleOrder = data.orderDetail.eleOrder;
        //console.log($scope.eleOrder);
        //如果电子工啥啊单不为空，则显示查看按钮
        if ($scope.eleOrder == '' || $scope.eleOrder == null) {
            $scope.hasElectronicWorksheets = false;
        } else {
            $scope.hasElectronicWorksheets = true;
        }
        //获取电子工单
        $scope.viewElectronicWorksheets = function() {
            handleDocumentWithURL(
                function() {
                    //console.log('success');
                },
                function(error) {
                    if (error == 53) {
                        $ionicPopup.alert({
                            title: '系统提示',
                            template: '对不起，您的手机无法阅读PDF文件！',
                            okText: '我知道了',
                            okType: 'button-default'
                        });
                    }
                },
                $scope.eleOrder
            );
        }
    }).error(function() {
        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
            $state.go('index');
        });
    });

    //点击图片放大
    $scope.changePic = function() {
            $scope.isShowBigPic = true;
            $scope.isNoShowHeader = true;
            var img = new Image(); 
            img.src =  $scope.customerImgUrl; 
            img.onload = function(){
                if(img.width > img.height){
                    $scope.bigPic = {
                       'margin': 'auto',
                       'width':'85%',
                       'height':'56%'
                    }
                }
            }
        }
        //关闭放大图片
    $scope.closeBigPic = function() {
            $scope.isShowBigPic = false;
            $scope.isNoShowHeader = false;
        }
        //获取补签名链接
    $scope.supplySignature = function() {
        $http({
            method: 'get',
            url: ajaxurl + 'orderApp/getQrCode4AuthOrder?token=' + $rootScope.token,
            params: {
                'orderNo': order["orderCode"]
            }
        }).success(function(data) {
            if (data.result == true) {
            	// console.log('http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+data.orderNo);
            	cordova.ThemeableBrowser.open('http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+data.orderNo,
                  ' _self',{
                       statusbar: {
                         color: '#ffffffff'
                     },

                     toolbar: {
                         height: 44,
                         color: '#f0f0f0ff'
                     },
                     title: {
                         color: '#003264ff',
                         showPageTitle: true,
                         staticText: '补录签名'
                     },
                      closeButton: {
                           image: 'close_pressed',
                           align: 'left',
                           event: 'closePressed'
                       }
                  })
                // my.alert('<textarea id="text" readonly>http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo=' + order["orderCode"] + '</textarea>', '', '复制链接')
                //     .then(function() {
                //         // var target = document.getElementById("text"); //获取目标元素
                //         // target.focus();
                //         // const selection = window.getSelection();
                //         // if (selection.rangeCount > 0) selection.removeAllRanges();
                //         // target.setSelectionRange(0, target.value.length);
                //         // document.execCommand('copy', false, null)
                        
                //     });
            }
        }).error(function() {
            my.alert('服务器信息获取失败！');
        });
    }

})