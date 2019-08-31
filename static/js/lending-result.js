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
        let blockInfoLength = lendingInfo['blockLength'];
        let localInfo = lendingInfo['local'];
        let localInfoLength = lendingInfo['localLength'];
        blockHisInfo.innerHTML = '';
        localHisInfo.innerHTML = '';
        for(let i = 0; i<blockInfoLength; i++){
            blockHisInfo.innerHTML = blockHisInfo.innerHTML + '<tr><th class="table-id">' +
                (i+1) + '</th> <th class="table-author am-hide-sm-only">' +
                blockInfo[i].name + '</th> <th calss="table-title table-title-id">' +
                blockInfo[i].ID_card + '</th> <th class="table-type">' +
                blockInfo[i].money + '</th> <th class="table-date am-hide-sm-only">' +
                blockInfo[i].default_date + '</th> </tr>';
        }
        for(let i = 0; i<localInfoLength; i++){
            localHisInfo.innerHTML = localHisInfo.innerHTML + '<tr> <th class="table-id">' +
                (i+1) + '</th> <th class="table-author am-hide-sm-only">' +
                localInfo[i].borrower_name + '</th><th calss="table-title table-title-id">' +
                localInfo[i].borrower_id + '</th><th class="table-title">' +
                localInfo[i].trade_order + '</th><th class="table-type">' +
                localInfo[i].borrow_type + '</th><th class="table-type">' +
                localInfo[i].borrower_sum + '</th><th class="table-type">' +
                localInfo[i].trade_place + '</th><th class="table-date am-hide-sm-only">' +
                localInfo[i].borrower_time + '</th><th class="table-date am-hide-sm-only">' +
                localInfo[i].should_payback_time + '</th><th class="table-date am-hide-sm-only">' +
                localInfo[i].payback_time + '</th></tr>';
        }
    }, function () {
    })

};

function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        successFunction();
    }
};

function ajaxToJSONStr(str) {
    //从后端使用jsonresponce传回Ajax= serializers.serialize("json", queryset)
    str = str.slice(1,-1);
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
