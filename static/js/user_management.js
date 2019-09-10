//用户管理界面js文件
//作者：霍然
//时间：2019-09-03
let xhrRegister = new XMLHttpRequest();
let new_user = document.getElementById("new_user_btn");
let user_info = {};
//页面加载时加载信息
window.onload = function () {
     ajaxResponse(xhrRegister, function () {
        user_info = JSON.parse(xhrRegister.responseText);
        let userinfo_tbody = document.getElementById("user-info");
        userinfo_tbody.innerHTML = "";
        for(var index = 0; index < user_info.length; index++) {
            let temp = user_info[index];
            userinfo_tbody.innerHTML = userinfo_tbody.innerHTML + '<tr id="user-manage-tr' + (index + 1) + '"><td>' + (index + 1) + '</td>' +
                '<td>' + user_info[index].username + '</td>' + '<td>' + user_info[index].user_real_name + '</td><td>' +
                user_info[index].user_phone + '</td>' + '<td>' + user_info[index].user_rank +
                '</td><td><div class="am-btn-toolbar">' + '<div class="am-btn-groupam-btn-group-xs"><button type="button" '
                + 'id="' + (index) + '" onclick="delete_btn_action(this)" ' + 'class="am-btn am-btn-default am-btn-xs am-text-secondary">'
                +'<span class="am-icon-pencil-square-o"></span>' + '删除</button></div></div></td></tr>';
        }
    }, function () {

    });

    let nothing = "2";

    xhrRegister.open('POST', '../user_management/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(nothing));
};

//响应函数模板
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
//删除按钮功能
function delete_btn_action(element) {
    let xhrRegister2 = new XMLHttpRequest();
    ajaxResponse(xhrRegister2,
        function () {
            console.log(1);

            },function () {
        });

    //window.location.href = "repayment.html?trade_order="+re[parseInt(element.id)].trade_;
    xhrRegister2.open('POST', '../delete_user/');
    xhrRegister2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister2.send(JSON.stringify(user_info[element.id]));

    location.reload();
}

//新用户按钮功能
new_user.onclick = function () {
    location.assign('./new_user.html')
};