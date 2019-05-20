appControllers.controller('dianpu-fill-info', function($scope,$http,$stateParams) {
    $scope.title = '填写信息';
    
    $scope.productName=$stateParams.productName;
    $scope.formInfo = {
        userName:'',
        telNum:'',
        area:'请选择区域',
        telDetail:''
    };
  
    /*********   选择区域开始    *********/
    $scope.provinceList = []; //一级列表
    $scope.cityList  = [];  //二级列表
    $scope.countyList =[];  //三级列表
    $scope.isNoShowArea=false; //区域块
    $scope.isNoShowHeader=false; //头部栏
    //关闭区域
    $scope.closeCity=function (){
        $scope.isNoShowHeader=false;
        $scope.isNoShowArea=false;
    }
   
    //打开选择区域
    $scope.choseArea=function(){
        $scope.isNoShowHeader=true;
        $scope.isNoShowArea=true;
    }

    //初始化地区
    $scope.initArea=function(){
        $scope.provinceList=wholeCity;
        for(var i in $scope.provinceList){
            $scope.provinceList[i].id=i;
        }
        $scope.cityList=$scope.provinceList[0].sub;
        for(var i in $scope.cityList){
            $scope.cityList[i].id=i;
        }
    }
    $scope.initArea();
    $scope.tag = {
        current: "-1",
        current1: "0",
        current2: "-1",
    };
    $scope.province = "北京";
    $scope.actions = {
        //县
         setCurrent2: function (param) {

            $scope.tag.current2 = param;
            $scope.county=$scope.countyList[param].name;
            if($scope.county=="无数据"){
                $scope.county="";
            }
            $scope.formInfo.area=$scope.province+ ' ' + $scope.city+' '+$scope.county;
            $scope.closeCity();
        },
        // 市
        setCurrent: function (param) {
            $scope.tag.current2 = -1;
            $scope.tag.current = param;
            $scope.city=$scope.cityList[param].name;
            if($scope.cityList[param].sub==undefined){
               $scope.formInfo.area=$scope.province+ ' ' + $scope.city;
               $scope.closeCity();
            }else{
                $scope.countyList=$scope.cityList[param].sub;
                for(var i in $scope.countyList){
                    $scope.countyList[i].id=i;
                }
            }
        },
        // 省
        setCurrent1: function (param) {
            console.log(param);
            $scope.tag.current = -1;
            $scope.tag.current1 = param;
            $scope.tag.current2 = -1;
            $scope.province=$scope.provinceList[param].name;
            $scope.cityList=$scope.provinceList[param].sub;
            for(var i in $scope.cityList){
                $scope.cityList[i].id=i;
            }
            $scope.countyList=[];
        }
    };
    /*********   选择区域结束    *********/

    // 提交信息
    $scope.submitInfo=function(){
         $http({
            method:'post',
            url:ajaxurl + 'wechatShopApp/insertWechatNumPreorder',
            data:{}
        }).success(function(data){
            //console.log(JSON.stringify(data));
            $scope.cityList = data.cityList;
            //console.log("1111==="+JSON.stringify($scope.cityList));
            if($scope.cityList.length > 0){
                $scope.cityVal = true;
                // $scope.formInfo.disId = '';//有子项
            }else{
                $scope.cityVal = false;
                // $scope.formInfo.disId = e;//无子项
                $scope.formInfo.area=$scope.province;
                $scope.cityList = [{"cateName":"无数据"}];
            }
        }).error(function(){
            my.alert('服务器请求失败');
        });
    }
    // 提交
    $scope.confirm=function(){
        console.log($scope.formInfo);
        if($scope.formInfo.userName==''){
            my.alert("请输入正确的姓名");
        }else if($scope.formInfo.telNum=='' || $scope.formInfo.telNum.length<11){
            my.alert("请输入正确的联系电话");
        }else if($scope.formInfo.area=='' || $scope.formInfo.telNum=='请选择区域'){
            my.alert("请选择区域");
        }else{
            $scope.submitInfo();
        }
    }
})
