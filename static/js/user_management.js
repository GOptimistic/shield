let xhrRegister = new XMLHttpRequest();
let new_user = document.getElementById("new_user_btn");
let user_info = {};
window.onload = function () {
     ajaxResponse(xhrRegister, function () {
        user_info = JSON.parse(xhrRegister.responseText);
        let userinfo_tbody = document.getElementById("user-info");
        userinfo_tbody.innerHTML = "";
        console.log(user_info.length);
        for(var index = 0; index < user_info.length; index++) {
            console.log(index);
            let temp = user_info[index];
            console.log(temp);
            console.log(typeof(temp));
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
}

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
}

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

new_user.onclick = function () {
    location.assign('./new_user.html')
}