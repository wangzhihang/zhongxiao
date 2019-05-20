appControllers.controller('scan-code-manage', function($scope,$http,$scope,$state) {
	$scope.title = "订单详情";
	$scope.orderItem=JSON.parse(localStorage.getItem('orderItem'));
	console.log($scope.orderItem);

    switch($scope.orderItem.orderType){
        case "1":
            $scope.btnVal='一键开卡';
            break;
        case "2":
            $scope.btnVal='融合办理';
            $scope.groupVal='组合办理'
            break;
        case "3":
            $scope.btnVal='一键受理';
            break;
    }
	
	$scope.openCard = function(){
        if($scope.orderItem.orderType==1){  //号码订单
            reset_dianpu_cbss(arguments[0]);
            order_type = "kaika";
            app = "dianpu";
            service_type = "telSelectCBSS";
            number_pool = "CBSS";
            source = "000004";
            sourceName = "CBSS选号";
            dianpu_order_amount = null;
            scanCode_order={
                  "id":$scope.orderItem.id
                , "orderCode":$scope.orderItem.orderCode
                , "name":$scope.orderItem.name
                , "cardId":$scope.orderItem.cardId
                , "orderType":$scope.orderItem.orderType
                , "productId":$scope.orderItem.productId
                , "productName":$scope.orderItem.productName
            }

            $state.go("number-list");
        }else if($scope.orderItem.orderType==2){ // 融合订单
            empty_filterSelect();
            filterSelect = {};
            reset_kuandai_wojia();
            order_type = "kuandai";
            app = "kuandai";
            number_pool = "CBSS";
            wojiaIsronghe = true;
            wojiaRootProductId = "89017299";
            wojiaflowProductId = "51018053";
            KuandaiMainProductName = "沃家共享";
            service_type = "wojia-ronghe";
            kuandai_number_into = true;
            reelectNumber = 0;
            scanCode_order={
                "id":$scope.orderItem.id
                , "orderCode":$scope.orderItem.orderCode
                , "name":$scope.orderItem.name
                , "cardId":$scope.orderItem.cardId
                , "orderType":$scope.orderItem.orderType
            }
            $state.go("kuandai-wojia-address-area");
        }else if($scope.orderItem.orderType==3){ //CBSS单宽订单
            reset_kuandai_wojia();
            order_type = "kuandai";
            app = "kuandai";
            number_pool = "CBSS";
            service_type = "cbssLan";
            KuandaiMainProductName = "CBSS单宽";
            scanCode_order={
                "id":$scope.orderItem.id
                , "orderCode":$scope.orderItem.orderCode
                , "name":$scope.orderItem.name
                , "cardId":$scope.orderItem.carId
                , "orderType":$scope.orderItem.orderType
            }
            $state.go("kuandai-wojia-address-area");
        } 
    }
    // 组合订单
    $scope.groupCard = function(){
        empty_filterSelect();
        filterSelect = {};
        reset_kuandai_wojia();
        order_type = "kuandai";
        app = "kuandai";
        number_pool = "CBSS";
        wojiaIsronghe = false;  // 判断是不是共享套餐
        wojiaRootProductId = "89706086";
        KuandaiMainProductName = "沃家组合";
        service_type = "wojia-combination";
        kuandai_number_into = true;
        reelectNumber = 0;
        scanCode_order={
            "id":$scope.orderItem.id
            , "orderCode": $scope.orderItem.orderCode 
            , "name":$scope.orderItem.name
            , "cardId":$scope.orderItem.carId
            , "orderType":$scope.orderItem.orderType
        }
        $state.go("kuandai-wojia-address-area");
    }





   
})