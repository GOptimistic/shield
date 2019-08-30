var re = {};

function searchFunction() {
    var myselect = document.getElementById("select-method");
    var index = myselect.selectedIndex; //被选中的搜索条件的下标
    var value = myselect.options[index].value;
    console.log(value);

    let context = [];

    let search_context = document.getElementById('select-context').value;
    //console.log(search_context);
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
            re = JSON.parse(xhrRegister.responseText);
            console.log(re);
            // var jsonObject= JSON.parse(re);
            // var totalnum = re.num;
            // var a1 = re.i0;
            // var a = JSON.parse(a1);
            var my_tbody = document.getElementById("need-repay-info");
            my_tbody.innerHTML = "";
            var index = 0;
            for (; index < re.length; index++) {
                //for(var i in re){
                console.log(re[index]);
                my_tbody.innerHTML = my_tbody.innerHTML + '<tr id="repayment_tr' + (index+1) +'><td><input type="checkbox"></td><td>' +
                    (index + 1) + '</td><td class="am-hide-sm-only">' + re[index].borrower_name + '</td><td>' +
                    re[index].borrower_id + '</td><td>' + re[index].trade_order + '</td><td>' + re[index].trade_type +
                    '</td><td>' + re[index].trade_money + '</td><td>' + re[index].trade_date +
                    '</td><td>' + re[index].end_date + '</td><td><div class="am-btn-toolbar">' +
                    '<div class="am-btn-groupam-btn-group-xs"><button type="button" ' + 'id="' + (index) + '" onclick="repayment_btn_action(this)" ' +
                    'class="am-btn am-btn-default am-btn-xs am-text-secondary">' +
                    '<span class="am-icon-pencil-square-o"></span>' +
                    '还款</button></div></div></td></tr>';
            }
        }, function () {
        });
    let search = {
        search_context: search_context,
        search_status: value
    };

    xhrRegister.open('POST', 'http://127.0.0.1:8000/repayment/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(search));
}

// 从输入框重接受手机号或单号，放到数据库中查询，再返回结果
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

function repayment_btn_action(element){
    let xhrRegister2 = new XMLHttpRequest();
    ajaxResponse(xhrRegister2,
        function () {
            console.log(1);

            },function () {
        });

    //window.location.href = "repayment.html?trade_order="+re[parseInt(element.id)].trade_;
    xhrRegister2.open('POST', 'http://127.0.0.1:8000/repayment_repay/');
    xhrRegister2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister2.send(JSON.stringify(re[element.id]));

}

