let chkRadio = document.getElementsByName("lending_radio");
let anaBtn = document.getElementById('analysis-button');
let borrowerName, borrowerID, borrowerPhone, borrowedMoney, loanType, shouldPaybackTime;

anaBtn.onclick = function () {
    borrowerName = document.getElementById('lending_input_name').value;
    borrowerID = document.getElementById('lending_input_ID').value;
    borrowerPhone = document.getElementById('lending_input_phonenum').value;
    borrowedMoney = document.getElementById('lending_input_money').value;
    let temp = document.getElementById('lending_input_date').value;
    shouldPaybackTime = new Date(temp).Format("yyyy-MM-dd HH:mm:ss");
    let xhrRegister = new XMLHttpRequest();

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
    if (borrowerName != '' && borrowerID != '' && borrowerPhone != '' && borrowedMoney != ''
        &&  shouldPaybackTime != null) {

         let lendingInfo = {
        borrowerName: borrowerName,
        borrowerID: borrowerID,
        borrowedSum: borrowedMoney,
        borrowerPhone: borrowerPhone,
        borrowType: loanType,
        shouldPaybackTime: shouldPaybackTime
    };
        if(typeof Storage == 'undefined'){
            alert('do not support storage');
        }else{
            let sendStr = JSON.stringify(lendingInfo);
            localStorage.setItem('loanInfo', sendStr);
        }
        location.assign('./lending_results.html');
    }else{
         alert('请输入完整信息');
    }
};


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

function toTimeString(temp) {
    let dateAry = temp.split("/");
    let tempStr = dateAry[2] + ' ' + dateAry[1] + ',' + dateAry[2];
    return tempStr;
};


