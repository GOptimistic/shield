//用户管理界面js文件
//作者：霍然
//时间：2019-09-03
(function () {
    /*建立模态框对象*/
    var modalBox = {};
    /*获取模态框*/
    modalBox.modal = document.getElementById("userModal");
    /*获得trigger按钮*/
    modalBox.triggerBtn = document.getElementById("usermanagemententry");
    /*获得关闭按钮*/
    modalBox.closeBtn = document.getElementById("user_management_closeBtn");
    /*模态框显示*/
    modalBox.show = function () {
        console.log(this.modal);
        this.modal.style.display = "block";
    };
    /*模态框关闭*/
    modalBox.close = function () {
        this.modal.style.display = "none";

    };
    modalBox.init = function () {
        var that = this;
        this.triggerBtn.onclick = function () {
            that.show();
        };
        this.closeBtn.onclick = function () {
            that.close();
        }
    };

    modalBox.init();

    var confrim = document.getElementById("usermanage_con");
    var cancle = document.getElementById("usermanage_can");
    confrim.onclick = function () {
    	let xhrRegister = new XMLHttpRequest();
        var user_id = document.getElementById("usermanageinputid").value;
        var user_psw = document.getElementById("usermanageinputpsw").value;
        if ((user_id !== "") && (user_psw !== "")) {
            let user = {
                USERID: user_id,
                USERPSW: user_psw
            };
            xhrRegister.open('POST', '../userManageEnter/');
            xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
            xhrRegister.send(JSON.stringify(user));

        } else {
            if (user_id === "") {
                document.getElementById("entry_error_psw").innerHTML = "工号不能为空";
            } else {
                document.getElementById("entry_error_psw").innerHTML = "密码不能为空";
            }
        }
        ajaxResponse(xhrRegister,
            function () {
                let response = JSON.parse(xhrRegister.responseText);
                if(response.msg){
                	 location.assign('./user_management.html');
				}else{
                	document.getElementById("entry_error_psw").innerHTML = "账号或密码不正确";
				}
            }, function () {
            });
    };
    cancle.onclick = function () {
        modalBox.close();
    }
})();


//响应函数模板
function ajaxResponse(xhr, successFunction, falseFunction) {
    //响应函数
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

