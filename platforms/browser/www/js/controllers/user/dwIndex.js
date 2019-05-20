appControllers.controller('dianpu-dw-index', function($scope,$state,$ionicPopup) {
    $scope.title = '大王卡';
    // $scope.wCard="dw.png";
    // $scope.choseCradVal="腾讯大王卡";
    // $scope.dwLeft=function(){
    //     $scope.wCard="dw.png";
    //     $scope.choseCradVal="腾讯大王卡";
    // }
    //  $scope.twRight=function(){
    //     $scope.wCard="tw.png";
    //     $scope.choseCradVal="腾讯天王卡";
    // }

    $scope.applyBtn=function(){
        $state.go('dianpu-dw-iccid', {choseCrad: $scope.choseCradVal});
    }

    $scope.moreDetail=function(){
        $scope.info=`·首月大王卡赠送20元话费、天王卡赠送60元话费，可抵扣首月月费，免费体验套餐内包含的内容，超出套餐内容按实际业务收费。</br>
            ·非腾讯应用专属流量：1元包500M省内流量（10M以内按0.1元/MB收费，11-500M免费使用），2元包500M省外流量（20M以内按0.1元/MB收费，21-500M免费使用），当日有效，自动续订，不用不收费。</br>
            ·首充50元及以上，送50元话费，每个用户仅可享受一次首充优惠，首充话费立即到账，赠送话费次日到账。充值金额与赠送话费按实际话费1：1扣费。赠送话费不能抵扣国际长途、国际漫游和SP业务费用。</br>
            ·本产品为体验型产品，入网当月及次月内不能订购或点播SP业务。</br>
            ·每个用户仅限申请一张王卡，其中将王卡转为其他套餐或王卡销户后也无法再次申请。</br>
            ·腾讯王卡遵循国际通用的流量原则，当月套餐内外上网流量累计使用到达40GB时，系统将自动关闭上网功能，次月自动打开。更多详情，可关注“王卡助手”微信公众号。</br>
            ·本次活动由中国联通主办，活动名额有限，敬请谅解。</br>
            ·腾讯应用专属流量范围以“王卡助手”微信公众号公布为准。
        `;
        alertData($scope.info);

    }
    $scope.moneyDetail=function(){
        $scope.pic=`<img style="width:140%" src="img/spendDetail.jpg">`;
        alertData($scope.pic);
    }
    //提示信息
    function alertData(info){
        var alertPopup = $ionicPopup.alert({
                title: '提示信息',
                template: info
            });
            alertPopup.then(function(res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
    }
})
