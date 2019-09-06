var re;
window.onload = function () {
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
            re = JSON.parse(xhrRegister.responseText);
            let tbody = document.getElementById('alert-list');
            tbody.innerHTML = "";
            var index = 0;
            for (; index < re.length; index++) {
                //for(var i in re){
                console.log(re[index]);
                tbody.innerHTML = tbody.innerHTML + '<tr id="alert_tr' + (index + 1) + '><td><input type="checkbox"></td><td>' +
                    (index + 1) + '</td><td>' + re[index].loaner_name + '</td><td>' +
                    re[index].loaner_id + '</td><td>' + re[index].loan_times_insvnd +
                    '</td><td>' + re[index].insert_time + '</td><td><div class="am-btn-toolbar">' +
                    '<div class="am-btn-groupam-btn-group-xs"><button type="button" ' + 'id="' + (index) + '" onclick="know_btn_action(this)" ' +
                    'class="am-btn am-btn-default am-btn-xs am-text-secondary">' +
                    '<span class="am-icon-pencil-square-o"></span>' +
                    '知道了</button></div></div></td></tr>';
            }
        }, function () {
        });
   
    xhrRegister.open('POST', '../alert/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send();
};

function know_btn_action(element) {
    let info = {
        loanerPId: re[element.id].pid
    };
     let xhrRegister = new XMLHttpRequest();
      ajaxResponse(xhrRegister,
          function () {
              location.reload();
          },
          function () {

          })
     xhrRegister.open('POST', '../alert_know/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(info));
}

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