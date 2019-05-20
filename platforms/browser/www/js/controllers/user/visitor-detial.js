appControllers.controller('visitor-detial', function($scope, $http, $state, my, $rootScope) {
    $scope.title = '访客管理';
    var chart = Highcharts.chart('vistorContainer', {
        chart: {
            type: 'area'
        },
        title: {
            text: '七日访问数据',
            align: 'left'
        },
        subtitle: {
            text: '数据截止今日00.00之前',
            align: 'right',
            verticalAlign: 'top'
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            x: 0,
            y: 100,
            borderColor: '#999999',
            borderWidth: 1,
            symbolRadius: 0
        },
        xAxis: {
            categories: ['11-21', '11-22', '11-23', '11-24', '11-25', '11-26', '11-27'],
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                enabled: false
            },
            labels: {
                formatter: function() {
                    return this.value / 1000;
                }
            }
        },
        tooltip: {
            split: true
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: [{
            name: '访客数2',
            data: [5, 65, 8, 9, 14, 36, 52]
        }, {
            name: '访问量8',
            data: [10, 10, 11, 13, 22, 76, 77]
        }]
    });

})