appControllers.controller('dianpu-combo-info', function($scope, $sce, $stateParams, $rootScope, my, $http) {
    $scope.title = "套餐详情";
    $scope.isShowQrbox = false;
    $scope.ylPage = true;
    $scope.wxPage = false;
    $scope.imgListId = localStorage.getItem('imgListId');
    $scope.imgListShortExplain = localStorage.getItem('imgListShortExplain');
    $scope.imgListPhoto = localStorage.getItem('imgListPhoto');
    $scope.imgListPageType = localStorage.getItem('imgListPageType');
    $scope.imgListProductName = localStorage.getItem('imgListProductName');
    $scope.comboUrl = "http://z.haoma.cn/yinliu/go?c=" + userBo.userId + "p" + $scope.imgListId;
    //点击显示二维码
    console.log("comboUrl___" + $scope.comboUrl);
    angular.element("#qrbox").qrcode({
        "render": "canvas",
        "width": 240,
        "height": 240,
        "text": $scope.comboUrl,
        "background": "#ffffff", //二维码的后景色
        "foreground": "#000000", //二维码的前景色
        "imgWidth": 50,
        "imgHeight": 50,
        "src": 'img/yinliu.png'
    });
    $scope.showQrbox = function() {
        if ($scope.isShowQrbox == false) {
            $scope.isShowQrbox = true;
        } else {
            $scope.isShowQrbox = false;
        }
    }
    $scope.closeQrbox = function() {
        $scope.isShowQrbox = false;
    }

    //分享
    $scope.share = function() {
            cordova.plugins.sharePlugin.share({
                title: $scope.imgListProductName,
                description: $scope.imgListShortExplain,
                image: $scope.imgListPhoto,
                url: $scope.comboUrl,
                category: "2"
            });
        }
        //调用保存二维码图片的函数   
    $scope.saveImageQrcode = function() {
        var canvas = document.getElementsByTagName("canvas")[0];
        // console.log(window.canvas2ImagePlugin);  
        window.canvas2ImagePlugin.saveImageDataToLibrary(function(msg) {
                console.log(msg);
                my.alert('图片已保存到本地');
            },
            function(err) {
                console.log(err);
            },
            canvas
        )
    };
    // 根据宣传页Id查询宣传页
    $scope.getImgData = function(imgListId) {
        $http({
            method: 'get',
            url: ajaxurl + 'ylShop/queryBrochureInfoByBrochureId?token=' + $rootScope.token,
            params: { productId: $scope.imgListId }
        }).success(function(data) {
            // console.log("data==="+)
            if ($scope.imgListPageType == "000001") {
                $scope.imgPath = data.data.smallProgramImgBo.imgPath;
                $scope.ylPage = true;
                $scope.wxPage = false;
            } else {
                $scope.imgPath = data.data.smallProgramImgBo.imgSrc;
                $scope.inputsList = data.data.smallProgramImgBo.inputsList;
                $scope.btnBgColor = data.data.smallProgramImgBo.btnInfo.btnBgColor;
                $scope.btnDisBottom = data.data.smallProgramImgBo.btnInfo.btnDisBottom;
                $scope.btnText = data.data.smallProgramImgBo.btnInfo.btnText;
                $scope.btnTextColor = data.data.smallProgramImgBo.btnInfo.btnTextColor;
                $scope.ylPage = false;
                $scope.wxPage = true;
            }
            console.log("data--" + JSON.stringify(data));
        })
    }
    $scope.getImgData($scope.imgListId);
})