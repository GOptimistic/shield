window.onload = function () {
    let hName = document.getElementById('accountinfo_name');
    let hId = document.getElementById('accountinfo_id');
    let testP = document.getElementById('accountinfo_phonenum');
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
             let jsonString = listToJSONStr(xhrRegister.responseText);
            //console.log(jsonString);
            let workerinfo = JSON.parse(jsonString);
             hName.innerHTML = workerinfo.user_real_name;
            hId.innerHTML = workerinfo.username;
            testP.innerHTML = workerinfo.user_phone;
        }, function () {
        });
    xhrRegister.open('POST', '../accountinfo/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send();

};

// 从输入框重接受手机号或单号，放到数据库中查询，再返回结果
function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        successFunction();
    }
};

function ajaxToJSONStr(str) {
    //从后端使用jsonresponce传回Ajax= serializers.serialize("json", queryset)
    str = str.slice(2,-2);
    let reg1 = new RegExp("\\\\\"", "g");
    let reg2 = new RegExp("\\\\\\\\", "g");
    let temp = str.replace(reg1, "\"");
    temp = temp.replace(reg2, "\\");
    return temp;
}

function listToJSONStr(str) {
    //从后端传来的list使用该方法转换成json字符串
     str = str.slice(1,-1);
     return str;
}