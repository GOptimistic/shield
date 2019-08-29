let cirBtn = document.getElementById('continue-lend');
let modBtn = document.getElementById('continue-modify');
let lenConName = document.getElementById('lending_confirm_name');
let lenConID = document.getElementById('lending_confirm_id');
let lenConPhone = document.getElementById('lending_confirm_phone');
let lenConType = document.getElementById('lending_confirm_type');
let lenConSum = document.getElementById('lending_confirm_sum');
let lenConDateTime = document.getElementById('lending_confirm_datetime');
let loanInfo;
let xhrRegister = new XMLHttpRequest();
window.onload = function () {
    if (typeof Storage == 'undefined') {
        alert('do not support storage');
    } else {
        let acceptStr = localStorage.getItem('loanInfo');
        loanInfo = JSON.parse(acceptStr);
    }
    lenConName.innerHTML = loanInfo.borrowerName;
    lenConID.innerHTML = loanInfo.borrowerID;
    lenConPhone.innerHTML = loanInfo.borrowerPhone;
    lenConType.innerHTML = loanInfo.borrowType;
    lenConSum.innerHTML = loanInfo.borrowedSum;
    lenConDateTime.innerHTML = loanInfo.shouldPaybackTime;
};

cirBtn.onclick = function () {
    //交易单号位交易地点代码+交易时间(距离1970/01/01的毫秒数)
    let borrowDatetime = new Date().Format("yyyy-MM-dd HH:mm:ss");
    let tradeOrder = '000' + Date.parse(borrowDatetime);

    loanInfo.borrowerTime = borrowDatetime;
    loanInfo.tradeOrder = tradeOrder;
    loanInfo.tradePlace = '中国银行江宁分行';
    loanInfo.payback = 0;
    loanInfo.paybackTime = null;

    let response = JSON.parse(xhrRegister.responseText);
    ajaxResponse(xhrRegister, function () {

        alert(response.msg);
        localStorage.removeItem('loanInfo');
        location.assign('http://127.0.0.1:8000/index/lending.html');
    }, function () {
        alert(response.msg);
        localStorage.removeItem('loanInfo');
        location.assign('http://127.0.0.1:8000/index/lending.html');
    });

    xhrRegister.open('POST', 'http://127.0.0.1:8000/addLending/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(loanInfo));


};

modBtn.onclick = function () {
    if (localStorage.getItem('loanInfo') != null) {
        localStorage.removeItem('loanInfo');
    }
    location.assign('http://127.0.0.1:8000/index/lending.html');
}

function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                successFunction();
            } else {
                // alert("失败" + xhr.status);
                falseFunction();
            }
        }
    }
};

function listToJSONStr(str) {
    //从后端传来的list使用该方法转换成json字符串
    str = str.slice(1, -1);
    return str;
}

//Date的prototype 属性可以向对象添加属性和方法。
Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "S+": this.getMilliseconds()
    };
    //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
        //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
        }
    }
    return fmt;
};