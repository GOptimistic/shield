let chkPpsRadio = document.getElementsByName("lending-purpose-radio");
let chkDurRadio = document.getElementsByName('lending-duration-radio');
let chkGrdRadio = document.getElementsByName('lending-grade-radio');
let chkHosRadio = document.getElementsByName('lending-house-radio');
let anaBtn = document.getElementById('analysis-button');
let borrowerName, borrowerID, borrowerPhone, loanedMoney, loanType;
let duration, grade, empTitle, empLength, annualIncome, homeOwnership, rate;

anaBtn.onclick = function () {
    borrowerName = document.getElementById('lending_input_name').value;
    borrowerID = document.getElementById('lending_input_ID').value;
    borrowerPhone = document.getElementById('lending_input_phonenum').value;
    loanedMoney = document.getElementById('lending_input_money').value;
    empTitle = document.getElementById('lending_input_emptitle').value;
    annualIncome = document.getElementById('lending_input_anlincome').value;
    empLength = document.getElementById('lending_input_emplength').value;

    let xhrRegister = new XMLHttpRequest();

    for (var n = 0; i < chkHosRadio.length; i++) {
        if (chkHosRadio[i].checked) {
            break;
        }
    }
    let Ownership = {
        0: 1,
        1: 2,
        2: 3,
        3: 4,
    };
    homeOwnership = null;
    for (let index in Ownership) {
        if (index == n) {
            homeOwnership = Ownership[index];
        }
    }

    for (var m = 0; i < chkGrdRadio.length; i++) {
        if (chkGrdRadio[i].checked) {
            break;
        }
    }
    let Grade = {
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: 7,
        7: 8
    };
    grade = null;
    for(let index in Grade){
        if(index ==m){
            grade = Grade[index];
        }
    }

    for (var n = 0; i < chkDurRadio.length; i++) {
        if (chkDurRadio[i].checked) {
            break;
        }
    }
    switch (n) {
        case 0:
            duration = 3;
            rate = 4.75;
            break;
        case 1:
            duration = 5;
            rate = 4.9;
            break;
        default:
            duration = null;
    }

    for (var i = 0; i < chkPpsRadio.length; i++) {
        if (chkPpsRadio[i].checked) {
            break;
        }
    }
    switch (i) {
        case 0:
            loanType = '企业贷款';
            break;
        case 1:
            loanType = '房屋贷款';
            break;
        case 2:
            loanType = '汽车贷款';
            break;
        case 3:
            loanType = '商户贷款';
            break;
        case 4:
            loanType = '结婚贷款';
            break;
        case 5:
            loanType = '购物贷款';
            break;
        default:
            loanType = null;
    }

    if (borrowerName != '' && borrowerID != '' && borrowerPhone != '' && loanedMoney != '' && duration != null
        && loanType != null && homeOwnership != null && empLength != '' && empTitle != '' && annualIncome != ''
        && grade != null) {

        let lendingInfo = {
            borrowerName: borrowerName,
            borrowerID: borrowerID,
            loanedMoney: loanedMoney,
            borrowerPhone: borrowerPhone,
            borrowType: loanType,
            loanDuration: duration,
            homeOwnership: homeOwnership,
            empTitle: empTitle,
            empLength: empLength,
            rate: rate,
            annualIncome: annualIncome,
            grade: grade
        };

        if (typeof Storage == 'undefined') {
            alert('do not support storage');
        } else {
            let sendStr = JSON.stringify(lendingInfo);
            localStorage.setItem('loanInfo', sendStr);
        }
        location.assign('./lending_results.html');
    } else {
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


