let new_user_name = document.getElementById("newUser_input_realname");
let new_user_phone = document.getElementById("newUser_input_phoneNum");
let new_user_rank = document.getElementById("newUser_input_rank");
let btn_ok = document.getElementById("new_user_btn_ok")
let xhrRegister = new XMLHttpRequest();
btn_ok.onclick = function () {
    ajaxResponse(xhrRegister,
        function () {
            let nothing = listToJSONStr(xhrRegister.responseText);
            
            }, function () {
        });
    let info = {
       new_user_name: new_user_name,
       new_user_phone: new_user_phone,
       new_user_rank: new_user_rank 
    }
    xhrRegister.open('POST', '../new_user/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(info));
}