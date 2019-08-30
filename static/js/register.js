let codeBtn = document.getElementById('zphone');
let code = "";
let confirmBtn = document.getElementById('confirm');
let user_id = "";
let success = false;

/*建立模态框对象*/
var modalBox = {};
/*获取模态框*/
modalBox.modal = document.getElementById("myModal");
/*获得trigger按钮*/
modalBox.triggerBtn = document.getElementById("confirm");
/*获得关闭按钮*/
modalBox.closeBtn = document.getElementById("changPwd_closeBtn");
/*模态框显示*/
modalBox.show = function () {
    console.log(this.modal);
    this.modal.style.display = "block";
};
/*模态框关闭*/
modalBox.close = function () {
    this.modal.style.display = "none";
    self.location.href = "./changePsw.html";
};
/*模态框初始化*/
modalBox.init = function () {
    var that = this;
    if (success) {
        that.show();
    }
    this.closeBtn.onclick = function () {
        that.close();
    };
    // this.outsideClick();
};


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

function Checkphone(obj) {
    if (obj === "") {
        document.getElementById("error_tip").innerHTML = "手机号不能为空";
    } else {
        var re = /^1[345678]\d{9}$/; //校验手机号
        if (re.test(obj)) {
            document.getElementById('zphone').disabled = false;
            document.getElementById("error_tip").innerHTML = "√";
        } else {
            document.getElementById("error_tip").innerHTML = "你输入的手机格式不正确";
            document.getElementById('zphone').disabled = true;
        }

    }
}

codeBtn.onclick = function () {
    let phoneNum = document.getElementById('changingPsw-phone').innerHTML;
    console.log(phoneNum);
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
            let re = JSON.parse(xhrRegister.responseText);
            console.log(re);
            code = re.message;
        }, function () {
        });

    xhrRegister.open('POST', 'http://127.0.0.1:8000/sendCode/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(phoneNum));
};

confirmBtn.onclick = function () {
    let pwd = document.getElementById('chaningPsw_input_newPsw').value;
    let pwd_c = document.getElementById('chaningPsw_input_confirmnewPsw').value;
    let code_input = document.getElementById('changingPsw_input_code').value;
    if (code_input === "") {
        alert("验证码为空");
    }
    if (pwd === "") {
        alert("新密码为空");
    }
    if (pwd_c === "") {
        alert("确认密码为空");
    }
    if (code_input === code) {
        if (pwd === pwd_c) {
            let xhrRegister = new XMLHttpRequest();
            ajaxResponse(xhrRegister,
                function () {
                    let re = JSON.parse(xhrRegister.responseText);
                    console.log(re);
                    if (re.msg === '修改成功！') {
                        success = true;

                        modalBox.init();
                    }
                }, function () {
                }
            );

            user_id = document.getElementById('changingPsw-id').innerHTML;

            let idNpwd = {
                id: user_id,
                pwd: pwd
            };

            console.log("js:" + user_id);
            console.log("js:" + pwd);

            xhrRegister.open('POST', 'http://127.0.0.1:8000/changePwd/');
            xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
            xhrRegister.send(JSON.stringify(idNpwd));
        } else {
            alert("两次输入不一致")
        }
    } else {
        alert("验证码错误");
    }
};
// (function () {
//
// })();

//按钮倒计时
let iTime = 60;
let sTime = '';

function RemainTime() {
    if (iTime === 0) {
        document.getElementById('zphone').disabled = false;
        sTime = "获取验证码";
        iTime = 60;
        document.getElementById('zphone').value = sTime;
        return;
    } else {
        document.getElementById('zphone').disabled = true;
        sTime = "重新发送(" + iTime + ")";
        iTime--;
    }
    setTimeout(function () {
        RemainTime()
    }, 1000);
    document.getElementById('zphone').value = sTime;
}
