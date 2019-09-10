//修改密码功能js文件
//作者：马瑞
//时间：2019-08-31
//网页加载时加载用户信息
window.onload = function () {
    let changePwdName = document.getElementById('changingPsw-name');
    let changePwdId = document.getElementById('changingPsw-id');
    let changePwdPhone = document.getElementById('changingPsw-phone');
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
             let jsonString = listToJSONStr(xhrRegister.responseText);
            //console.log(jsonString);
            let workerinfo = JSON.parse(jsonString);
             changePwdName.innerHTML = workerinfo.user_real_name;
            changePwdId.innerHTML = workerinfo.username;
            changePwdPhone.innerHTML = workerinfo.user_phone;
        }, function () {
        });
    xhrRegister.open('POST', '../accountinfo/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send();
};

//响应函数模板
function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        successFunction();
    }
}

function listToJSONStr(str) {
    //从后端传来的list使用该方法转换成json字符串
     str = str.slice(1,-1);
     return str;
}