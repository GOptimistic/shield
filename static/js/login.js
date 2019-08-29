//for login in the index page
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

//回车时，默认是登陆
function keyLogin() {
    if (event.keyCode === 13)  //回车键的键值为13
        document.getElementById("login-button").click(); //调用登录按钮的登录事件
}

let subBt = document.getElementById('login-button');
subBt.onclick = function () {
    let userID = document.getElementById('login-name').value;
    let pwd = document.getElementById('login-password').value;
    let xhrRegister = new XMLHttpRequest();

    ajaxResponse(xhrRegister,
        function () {
            let response = JSON.parse(xhrRegister.responseText);
            document.getElementById("login_name_j").innerHTML = response.msg;
            console.log("success")
            console.log(response.msg)
            if (response.msg === 'login successfully') {
                location.assign('http://127.0.0.1:8000/index/home_after.html');
            }

        }, function () {
            let respones = JSON.parse(xhrRegister.responseText)
            console.log("false");
            console.log(respones.msg)
            document.getElementById("login_name_j").innerHTML = respones.msg;
        });
    let user = {
        userID: userID,
        pwd: pwd
    };

    xhrRegister.open('POST', 'http://127.0.0.1:8000/login/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(user));
};
