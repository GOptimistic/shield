//function searchFunction() {
    // var myselect = document.getElementById("select-method");
    // var index = myselect.selectedIndex; //被选中的搜索条件的下标
    // var value = myselect.options[index].value;
    //console.log(value);
    //if (value === 'option1') {
    //let search_context = document.getElementById('select-context').value;
    //console.log(search_context);
window.onload = function(){
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
            var workerinfo = JSON.parse(xhrRegister.responseType);
        }, function () {
        });
    let h_name = document.getElementById('accountinfo_name') ;
    h_name.innerHTML = workerinfo.username;

    print()
    // let search = {
    //     search_context: search_context,
    //     search_status: value
    // };
    xhrRegister.open('POST', 'http://127.0.0.1:8000/accountinfo/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(search));


    //}
 // var my_tbody = document.getElementById("need-repay-info");
 //    my_tbody.innerHTML = "";
 //
 //    var context = ["赵一样", "123456123456789123", "11111111", "1123.12", "小额贷款", "2013-03-03  7:28:47"];
 //    var totalnum = 3;
 //    var index = 1;
 //    for (var i = 0; i < totalnum; i++) {
 //        my_tbody.innerHTML = my_tbody.innerHTML + '<' +
 //            'tr><td><input type="checkbox"></td><td>' +
 //            index + '</td><td class="am-hide-sm-only">' +
 //            context[0] + '</td><td>' +
 //            context[1] + '</td><td>' +
 //            context[2] + '</td><td>' +
 //            context[3] + '</td><td>' +
 //            context[4] + '</td><td class="am-hide-sm-only">' +
 //            context[5] + '</td><td><div class="am-btn-toolbar">' +
 //            '<div class="am-btn-groupam-btn-group-xs"><button ' +
 //            'class="am-btn am-btn-default am-btn-xs am-text-secondary">' +
 //            '<span class="am-icon-pencil-square-o"></span>' +
 //            '还款</button></div></div></td></tr>';
 //
 //        index += 1;
 //    }
};

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
};
