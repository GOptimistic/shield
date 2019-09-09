let lendResConBtn = document.getElementById('lending-result-confirm');
let lendResCelBtn = document.getElementById('lending-result-cancel');

window.onload = function () {
    let blockHisInfo = document.getElementById('lend-history-block-info');
    let localHisInfo = document.getElementById('lend-history-local-info');
    let xhrRegister = new XMLHttpRequest();
    if (typeof Storage == 'undefined') {
        alert('do not support storage');
    } else {
        let acceptStr = localStorage.getItem('loanInfo');
        let loanInfo = JSON.parse(acceptStr);
        let lendingResult = {
            borrowerName: loanInfo.borrowerName,
            borrowerID: loanInfo.borrowerID
        };
        xhrRegister.open('POST', '../lendingResult/');
        xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhrRegister.send(JSON.stringify(lendingResult));
    }

    ajaxResponse(xhrRegister, function () {
        //console.log(xhrRegister.responseText);
        let jsonString = ajaxToJSONStr(xhrRegister.responseText);
        console.log(jsonString);
        let lendingInfo = JSON.parse(jsonString);
        let blockInfo = lendingInfo['block'];
        var blockInfoLength = lendingInfo['blockLength'];
        let localInfo = lendingInfo['local'];
        var localInfoLength = lendingInfo['localLength'];
        blockHisInfo.innerHTML = '';
        localHisInfo.innerHTML = '';
        if (blockInfoLength === 0) {
            blockHisInfo.innerHTML = '<tr><th class="table-id"></th> ' +
                '<th class="table-author am-hide-sm-only"> ' + ' </th> <th class="table-title table-title-id">' +
                '<h3 class="results_title lending_results_title">无记录</h3>' + '</th> <th class="table-type">' +
                '</th> <th class="table-date am-hide-sm-only">' + '</th> </tr>';
        }
        if (localInfoLength === 0) {
            localHisInfo.innerHTML = '<tr> <th class="table-id">' + '</th> <th class="table-author am-hide-sm-only">' +
                '</th><th class="table-title table-title-id">' + '</th><th class="table-title">' +
                '</th><th class="table-type">' + '</th><th class="table-type">' +
                '<h3 class="results_title lending_results_title">无记录</h3>' + '</th><th class="table-type">' +
                '</th><th class="table-date am-hide-sm-only">' + '</th><th class="table-date am-hide-sm-only">' +
                '</th><th class="table-date am-hide-sm-only">' + '</th></tr>';
        }
        for (let i = 0; i < blockInfoLength; i++) {
            blockHisInfo.innerHTML = blockHisInfo.innerHTML + '<tr><th class="table-id">' +
                (i + 1) + '</th> <th class="table-author am-hide-sm-only">' +
                blockInfo[i].name + '</th> <th class="table-title table-title-id">' +
                blockInfo[i].ID_card + '</th> <th class="table-type">' +
                blockInfo[i].money + '</th> <th class="table-date am-hide-sm-only">' +
                blockInfo[i].default_date + '</th> </tr>';
        }
        for (let i = 0; i < localInfoLength; i++) {
            localHisInfo.innerHTML = localHisInfo.innerHTML + '<tr> <th class="table-id">' +
                (i + 1) + '</th> <th class="table-author am-hide-sm-only">' +
                localInfo[i].borrower_name + '</th><th class="table-title table-title-id">' +
                localInfo[i].borrower_id + '</th><th class="table-title">' +
                localInfo[i].trade_order + '</th><th class="table-type">' +
                localInfo[i].borrow_type + '</th><th class="table-type">' +
                localInfo[i].funded_amount + '</th><th class="table-type">' +
                localInfo[i].trade_place + '</th><th class="table-date am-hide-sm-only">' +
                localInfo[i].borrower_time + '</th><th class="table-date am-hide-sm-only">' +
                localInfo[i].should_payback_time + '</th><th class="table-date am-hide-sm-only">' +
                localInfo[i].last_pymnt_d + '</th></tr>';
        }
    }, function () {
    });

    let xhrRegister2 = new XMLHttpRequest();
    if (typeof Storage == 'undefined') {
        alert('do not support storage');
    } else {
        let acceptStr = localStorage.getItem('loanInfo');
        let loanInfo = JSON.parse(acceptStr);
        let lendingResult = {
            borrowerName: loanInfo.borrowerName,
            borrowerID: loanInfo.borrowerID
        };
        xhrRegister2.open('POST', '../lending_svm/');
        xhrRegister2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhrRegister2.send(JSON.stringify(lendingResult));
    }

    ajaxResponse(xhrRegister2, function () {
        let re = JSON.parse(xhrRegister2.responseText);
        console.log(re.default_times);
        console.log(re.isNull);
        if (!re.isNull) {
            let bar = echarts.init(document.getElementById('lending_bar'));
            let radar = echarts.init(document.getElementById('lending_radar'));
            let probability = re.proba;
            let anti_proba = [];
            for (let i = 1; i < re.proba.length; ++i) {
                anti_proba.push((1 - probability[i]).toFixed(4));
                probability[i] = probability[i].toFixed(4);
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
        }else{
            let bar = document.getElementById('lending_bar');
            let radar = document.getElementById('lending_radar');
            bar.innerHTML+="<h2 class=\"results_title\" style='line-height:500px;'>数据不足，无法生成分析图</h2>";
            radar.innerHTML+="<h2 class=\"results_title\" style='line-height:500px;'>数据不足，无法生成分析图</h2>";
        }
    }, function () {
    })

};

function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        successFunction();
    }
}

function ajaxToJSONStr(str) {
    //从后端使用jsonresponce传回Ajax= serializers.serialize("json", queryset)
    str = str.slice(1, -1);
    let reg1 = new RegExp("\\\\\"", "g");
    let reg2 = new RegExp("\\\\\\\\", "g");
    let temp = str.replace(reg1, "\"");
    temp = temp.replace(reg2, "\\");
    return temp;
}

function listToJSONStr(str) {
    //从后端传来的list使用该方法转换成json字符串
    str = str.slice(1, -1);
    return str;
}

lendResConBtn.onclick = function () {

    location.assign('./lending_confirm.html');
};

lendResCelBtn.onclick = function () {
    if (localStorage.getItem('loanInfo') != null) {
        localStorage.removeItem('loanInfo');
    }
    location.assign('./lending.html');
};
