let chkRadio = document.getElementsByName("lending_radio");
let anaBtn = document.getElementById('analysis-button');
let conBtn = document.getElementById('continue-lend');
let borrowerName = document.getElementById('lending_input_name').value;
let borrowerID = document.getElementById('lending_input_ID').value;
let borrowerPhone = document.getElementById('lending_input_phonenum').value;
let borrowedMoney = document.getElementById('lending_input_money').value;
let temp = document.getElementById('lending_input_date').value;

alert(timeString(temp));
let shouldPaybackTime = new Date(timeString(temp)).Format("yyyy-MM-dd HH:mm:ss");
alert('reach here');
let loanType;
let xhrRegister = new XMLHttpRequest();
let divAnaResult = document.getElementById('lending-result');

anaBtn.onclick = function () {

    for (var i = 0; i < chkRadio.length; i++) {
        if (chkRadio[i].checked) {
            break;
        }
    }
    switch (++i) {
        case 1:
            loanType = '个人贷款';
            break;
        case 2:
            loanType = '企业贷款';
            break;
        case 3:
            loanType = '房屋贷款';
            break;
        case 4:
            loanType = '汽车贷款';
            break;
        case 5:
            loanType = '商户贷款';
            break;
        case 6:
            loanType = '结婚贷款';
            break;
        case 7:
            loanType = '小额贷款';
            break;
        case 8:
            loanType = '短期贷款';
            break;
        default:
            alert('请选择贷款类型');
    }
    if (borrowerName == '' || borrowerID == '' || borrowerPhone == '' || borrowedMoney == ''
        ||  shouldPaybackTime == null) {
        alert('请输入完整信息');
    }


    location.assign('http://127.0.0.1:8000/index/lending_results.html');
    divAnaResult.innerHTML = "<p>test</p>";
}

conBtn.onclick = function () {
    //交易单号位交易地点代码+交易时间(距离1970/01/01的毫秒数)
    let borrowDatetime = new Date().Format("yyyy-MM-dd HH:mm:ss");
    var tradeOrder = '000' + Date.parse(borrowDatetime);

    var lendingInfo = {
        borrowerName: borrowerName,
        borrowerID: borrowerID,
        borrowerTime: borrowDatetime,
        borrowerSum: borrowedMoney,
        borrowerPhone: borrowerPhone,
        borrowType: loanType,
        payback: 0,
        shouldPaybackTime: shouldPaybackTime,
        paybackTime: null,
        tradeOrder: tradeOrder,
        tradePlace: '中国银行江宁分行'
    };

    xhrRegister.open('POST', 'http://127.0.0.1:8000/addLending')
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(lendingInfo));
};

//Date的prototype 属性可以向对象添加属性和方法。
Date.prototype.Format = function (fmt) {
    var o = {
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
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
        }
    }
    return fmt;
};

function timeString(temp) {
    let dateAry = temp.split("/");
    let tempStr = dateAry[2] + ' ' + dateAry[1] + ',' + dateAry[2];
    return tempStr;
}

// var orderCount = function () {
//     let xhrRegister = new XMLHttpRequest();
//     xhrRegister.open('POST', 'http://127.0.0.1:8000/count/');
//     xhrRegister.send();
//     let response = JSON.parse(xhrRegister.responseText);
//     if (xhrRegister.readyState === 4) {
//         if (xhrRegister.status >= 200 && xhrRegister.status < 300) {
//             return new Number(response.msg);
//         }
//     }
//     return alert('can not get the order');
// }

