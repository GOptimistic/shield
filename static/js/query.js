function queryFunction() {
    //要查询的身份证号
    var idNumber = document.getElementById("query-identitynumber").value;
    console.log(idNumber);
    //要查询的贷款单号
    var loanNumber = document.getElementById("query-serialnumber").value;
    console.log(loanNumber);
    window.location.href = "query_result.html?idNumber=" + idNumber + '&loanNumber=' + loanNumber;
    // if (isDate(loanDate) || checkCard(idNumber) || isOrderNum(loanNumber)) {
    //     window.location.href = "query_result.html?idNumber=" + idNumber + '&loanNumber=' + loanNumber + '&loanDate=' + loanDate;
    //     window.location.href = "query_result.html?idNumber=" + idNumber + '&loanNumber=' + loanNumber + '&loanDate=' + loanDate;
    // } else {
    //     return alert('请正确输入信息');
    // }
}

// 从输入框重接受手机号或单号，放到数据库中查询，再返回结果
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

function isOrderNum(str) {
    var reg = /^[0-9]{13}$/;   /*定义验证表达式*/
    return reg.test(str);     /*进行验证*/
}

function checkCard(str) {
    //15位数身份证正则表达式
    let arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    //18位数身份证正则表达式
    let arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
    if (str.match(arg1) == null && str.match(arg2) == null) {
        return false;
    } else {
        return true;
    }
}

function isDate(str) {
    //适用于mm/dd/yyyy格式
    let arg = /^(0[1-9]|1[012])\/([012][0-9]|3[01])\/(\d{4})$/;
    return arg.test(str);
}