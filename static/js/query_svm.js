//查询分析时ja文件
//作者：马瑞
//时间：2019-09-06
let query_analysis = document.getElementById('query_analysis');
let bar = echarts.init(document.getElementById('predict_bar'));
let radar = echarts.init(document.getElementById('predict_radar'));
//响应函数模板
function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                successFunction();
            } else {
                falseFunction();
            }
        }
    }
}
//分析按钮功能函数，显示
query_analysis.onclick = function () {
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
            re = JSON.parse(xhrRegister.responseText);
            console.log(re.default_times)
            document.getElementById("predict_class").innerHTML = re.class;
            let probability = re.proba;
            let anti_proba = [];
            for (let i = 0; i < re.proba.length; ++i) {
                probability[i] = probability[i].toFixed(4);
                anti_proba.push((1 - probability[i]).toFixed(4));
            }
            let option1 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['正常交易', '违约交易']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: re.trade_code
                },
                series: [
                    {
                        name: '正常交易',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: probability
                    },
                    {
                        name: '违约交易',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: anti_proba
                    },
                ]
            };
            bar.setOption(option1);
            let option2 = {
                title: {
                    text: '客户属性图'
                },
                tooltip: {},
                legend: {
                    data: ['综合评估: ' + re.id]
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#ff4268',
                            backgroundColor: '#04992d',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        {name: '信用', max: 100}, //100-违约次数
                        {name: '资产', max: 4}, //房屋所有权
                        {name: '收入', max: 1000000}, //年收入
                        {name: '稳定性', max: 10}, //工作时长
                    ]
                },
                series: [{
                    name: '预算 vs 开销（Budget vs spending）',
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    data: [
                        {
                            value: [100 - re.default_times, re.home, re.income, re.work],
                            name: '综合评估:' + re.id
                        }
                    ]
                }]
            };
            radar.setOption(option2);
        }, function () {
        });

    let search = 'test';

    xhrRegister.open('POST', '../query_svm/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(search));
}