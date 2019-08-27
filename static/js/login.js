//for login in the index page
function ajaxResponse(xhr, successFunction, falseFunction) {
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                //alert("成功");
                successFunction();
            } else {
                //alert("失败" + xhr.status);
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
            let respones = JSON.parse(xhrRegister.responseText);
            if(respones.msg == 'login successfully'){
                 location.assign('http://127.0.0.1:8000/index/lending.html');
            }else{
                alert(respones.msg);
            }
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

// function addCookie(userID){
//      let Days = 30;
//             var exp = new Date();
//             exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
//             document.cookie = 'username=' + userID + '; expires=' + exp.toUTCString() + '; path=/';
// };