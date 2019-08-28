function queryFunction() {
    //要查询的身份证号
    var idNumber = document.getElementById("query-identitynumber").value;
    console.log(idNumber);
    //要查询的贷款单号
    var loanNumber = document.getElementById("query-serialnumber").value;
    console.log(loanNumber);
    //要查询的贷款日期
    var loanDate = document.getElementById("query-loandate").value;
    console.log(loanDate);
    window.location.href = "query_result.html?idNumber="+idNumber+'&loanNumber='+loanNumber+'&loanDate='+loanDate;
};

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
};
