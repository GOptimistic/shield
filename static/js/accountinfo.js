let hName = document.getElementById('accountinfo_name');
let hId = document.getElementById('accountinfo_id');
let testP = document.getElementById('accountinfo_phonenum');
window.onload = function () {
    var workerinfo;
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
            let str = xhrRegister.responseText;
            let jsonString = toJSONStr(str);
            workerinfo = JSON.parse(jsonString);
            let inside = workerinfo['fields'];
            console.log(inside);
            let fie = JSON.stringify(inside);
            let test = JSON.parse(fie);
            //var jsone = eval("("+ inside +")");
            //console.log(jsone);
            hName.innerHTML = test.user_real_name;
            hId.innerHTML = test.username;
            testP.innerHTML = test.user_phone;
        }, function () {
        });
    xhrRegister.open('POST', 'http://127.0.0.1:8000/accountinfo/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send();

};

// 从输入框重接受手机号或单号，放到数据库中查询，再返回结果
function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        //     if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        //         successFunction();
        //     } else {
        //         falseFunction();
        //     }
        // }
        successFunction();
    }
};

function toJSONStr(str) {
    //从后端使用jsonresponce传回Ajax= serializers.serialize("json", queryset)
    str = str.slice(2, -2);
    let reg1 = new RegExp("\\\\\"", "g");
    let reg2 = new RegExp("\\\\\\\\", "g");
    let temp = str.replace(reg1, "\"");
    temp = temp.replace(reg2, "\\");
    return temp;
}
