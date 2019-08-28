//for login in the index page
function ajaxResponse(xhr,successFunction,falseFunction) {
     xhr.onreadystatechange = function () {
         if (xhr.readyState === 4) {
             console.log(xhr.status);
             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                 //alert("成功");
                 successFunction();
             } else {
                 // alert("失败" + xhr.status);
                 document.getElementById("login_name_j").innerHTML = "用户名或密码为空";
                 falseFunction();
             }
         }
     }
 };

let subBt = document.getElementById('login-button');
subBt.onclick = function () {
    let userID = document.getElementById('login-name').value;
    let pwd = document.getElementById('login-password').value;
    let xhrRegister = new XMLHttpRequest();

    ajaxResponse(xhrRegister,
        function () {
            let response = JSON.parse(xhrRegister.responseText);
            document.getElementById("login_name_j").innerHTML = response.msg;
            location.assign('http://127.0.0.1:8000/index/lending.html');
        },function () {
            });
    let user = {
        userID: userID,
        pwd: pwd
    };

    xhrRegister.open('POST', 'http://127.0.0.1:8000/login/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(user));
};
