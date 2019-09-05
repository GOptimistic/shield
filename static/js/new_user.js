let btn_ok = document.getElementById("new_confirm");
let xhrRegister = new XMLHttpRequest();

btn_ok.onclick = function () {
    let new_user_name = document.getElementById("newUser_input_realname").value;
    let new_user_phone = document.getElementById("newUser_input_phoneNum").value;
    let new_user_rank = document.getElementById("newUser_input_rank").value;
    if (new_user_name != "" && new_user_phone != "" && new_user_rank != "" ) {
        ajaxResponse(xhrRegister,
            function () {
                let result = JSON.parse(xhrRegister.responseText);
                //可加模态框
                alert(result.msg);
                location.reload();
            }, function () {
            });
        let info = {
            new_user_name: new_user_name,
            new_user_phone: new_user_phone,
            new_user_rank: new_user_rank
        };
        xhrRegister.open('POST', '../new_user/');
        xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhrRegister.send(JSON.stringify(info));
    }
    else{
        //可加模态框
        alert("shurukong");
    }

};

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