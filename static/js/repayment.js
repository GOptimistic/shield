let success = true;

/*建立模态框对象*/
var modalBox = {};
/*获取模态框*/
modalBox.modal = document.getElementById("myModal");
/*获得trigger按钮*/
modalBox.triggerBtn = document.getElementById("index");
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
    searchFunction();
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
    // if(changed){
    //     that.close();
    // }
    // this.outsideClick();
};

var re = {};

function searchFunction() {
    var myselect = document.getElementById("select-method");
    var index = myselect.selectedIndex; //被选中的搜索条件的下标
    var value = myselect.options[index].value;
    console.log(value);

    let context = [];

    let search_context = document.getElementById('select-context').value;
    if (!checkInput(value, search_context)) {
        return alert('请正确输入信息')
    }
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
                my_tbody.innerHTML = my_tbody.innerHTML + '<tr id="repayment_tr' + (index + 1) + '><td><input type="checkbox"></td><td>' +
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

    xhrRegister.open('POST', '../repayment/');
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

function repayment_btn_action(element) {
    modalBox.init();
    let repayBtn = document.getElementById('repay_button');
    repayBtn.onclick = function () {
        let money = document.getElementById('repayment_money').value;
        if (!isMoney(money)) {
            return alert('请正确输入信息')
        }
        console.log(money);
        let xhrRegister2 = new XMLHttpRequest();
        ajaxResponse(xhrRegister2,
            function () {
                console.log(1);
                re = JSON.parse(xhrRegister2.responseText);
                console.log(re);
                if (re.msg === "success") {
                    // changed=true;
                    modalBox.close();
                }
            }, function () {
            });
        let repay = {
            money: money,
            repay: re[element.id]
        };
        console.log(repay);
        //window.location.href = "repayment.html?trade_order="+re[parseInt(element.id)].trade_;
        xhrRegister2.open('POST', '../repayment_repay/');
        xhrRegister2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhrRegister2.send(JSON.stringify(repay));

        //searchFunction()
    }
}

function checkInput(option, input) {
    if (option === 'option1') {
        return checkCard(input)
    } else if (option === 'option2') {
        return isOrderNum(input)
    } else
        return false;
}

function checkCard(str) {
    //15位数身份证正则表达式
    let arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    //18位数身份证正则表达式
    let arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
    if (str.match(arg1) == null && str.match(arg2) == null) {
        return false;
    } else {
        return true;
    }
}

function isOrderNum(str) {
    var reg = /^[0-9]{13}$/;   /*定义验证表达式*/
    return reg.test(str);     /*进行验证*/
}


function isMoney(s) {//判断是否为金额格式
    let regu = "^[0-9]+[.]*[0-9]{0,3}$";
    let re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } else {
        return false;
    }
}