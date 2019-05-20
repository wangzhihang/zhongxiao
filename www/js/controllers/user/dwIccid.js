appControllers.controller('dianpu-dw-iccid', function($scope,$stateParams,$ionicPopup,$http,$rootScope) {
    $scope.title = '';
    $scope.choseCrad = $stateParams.choseCrad;
    $scope.productName="29元大王卡";
    //console.log("gdeshd "+$scope.choseCrad);
    $scope.formInfo={
        ICCID:'',
        telNum:''
    };
    // $scope.reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    $scope.getIccid=function(){
        $scope.formInfo["ICCID"] = iccidFormat( $scope.formInfo["ICCID"]);
    }
    $scope.getTel=function(){
        $scope.formInfo["telNum"] = telFormat( $scope.formInfo["telNum"]);
    }
    $scope.submitInfo=function(){
        $http({
            method:'post',
            url:ajaxurl + 'wechatShopApp/insertKingCardOrder?token='+$rootScope.token,
            data:{
                // orderInfo: $scope.formInfo
                "contactNumber":$scope.formInfo.telNum, "iccid": $scope.formInfo.ICCID, "productName": $scope.productName
            }
        }).success(function(data){
            //console.log(data);
             alertData("提交成功！")
        });
    }
    $scope.confirm=function(){
        if($scope.formInfo.ICCID == ''){
            alertData('请输入ICCID');
        }else if($scope.formInfo.telNum ==''){
            alertData('请输入正确的电话号码');
        }else if($scope.formInfo.telNum.replace(/[^\d]/g, "").length < 11){
             alertData('请输入正确的电话号码');
        }else{
             $scope.submitInfo();
        }
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


    function iccidFormat(input,maxlen,Arr){
       
        if(!maxlen){
            maxlen = input.length;
        }
        // console.log(maxlen);
        if(!Arr){
             Arr=[3,7,11,15,19,23,27,31,35,39,43,47];
        }
        
        var tel_numear = String(input).replace(/[^\d]/g, "");
        if (tel_numear.length < maxlen){maxlen = tel_numear.length;}
        var temp = "";
        for (var i = 0; i < maxlen; i++) {
            temp = temp + tel_numear.substring(i, i + 1);
            for(var ii in Arr){
                if(i=== Number(Arr[ii]) && maxlen > Number(Arr[ii])+1){
                    temp = temp + " ";
                }
            }
        };
        return temp;
    }

})
