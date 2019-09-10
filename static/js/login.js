//for login in the index page
//登陆页面js文件
//作者：李昊博 马瑞
//时间：2019-08-22

//响应函数模板
function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                successFunction();
            } else {
                // alert("失败" + xhr.status);
                falseFunction();
            }
        }
    }
};

//回车时，默认是登陆
function keyLogin() {
    if (event.keyCode === 13)  //回车键的键值为13
        document.getElementById("login-button").click(); //调用登录按钮的登录事件
}

//确认按钮功能，发出请求，访问数据库
let subBt = document.getElementById('login-button');
subBt.onclick = function () {
    let userID = document.getElementById('login-name').value;
    let pwd = document.getElementById('login-password').value;
    let xhrRegister = new XMLHttpRequest();

    ajaxResponse(xhrRegister,
        function () {
            let response = JSON.parse(xhrRegister.responseText);
            document.getElementById("login_name_j").innerHTML = response.msg;
            if (response.msg === 'login successfully') {
                location.assign('./home_after.html');
            }

        }, function () {
            let respones = JSON.parse(xhrRegister.responseText);
            document.getElementById("login_name_j").innerHTML = respones.msg;
        });
    let user = {
        userID: userID,
        pwd: pwd
    };

    xhrRegister.open('POST', '../login/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(user));
};
