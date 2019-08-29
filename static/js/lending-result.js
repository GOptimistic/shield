let lendResConBtn = document.getElementById('lending-result-confirm');
let lendResCelBtn = document.getElementById('lending-result-cancel');
window.onload = function () {
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
        xhrRegister.open('POST', 'http://127.0.0.1:8000/Lending-Result');
        xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhrRegister.send(JSON.stringify(lendingResult));
    }

    ajaxResponse(xhrRegister, function () {
        let jsonString = listToJSONStr(xhrRegister.responseText);

    }, function () {
    })

};

function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        successFunction();
    }
};

function listToJSONStr(str) {
    //从后端传来的list使用该方法转换成json字符串
    str = str.slice(1, -1);
    return str;
}

lendResConBtn.onclick = function () {

    location.assign('http://127.0.0.1:8000/index/lending_confirm.html');
};

lendResCelBtn.onclick = function () {
    if (localStorage.getItem('loanInfo') != null) {
        localStorage.removeItem('loanInfo');
    }
    location.assign('http://127.0.0.1:8000/index/lending.html');
};
