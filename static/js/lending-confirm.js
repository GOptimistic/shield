let lenConName = document.getElementById('lending_confirm_name');
let lenConID = document.getElementById('lending_confirm_id');
let lenConPhone = document.getElementById('lending_confirm_phone');
let lenConType = document.getElementById('lending_confirm_type');
let lenConSum = document.getElementById('lending_confirm_sum');
let lenConDateTime = document.getElementById('lending_confirm_datetime');
let loanInfo;
let xhrRegister = new XMLHttpRequest();

window.onload = function () {
    if (typeof Storage == 'undefined') {
        alert('do not support storage');
    } else {
        let acceptStr = localStorage.getItem('loanInfo');
        loanInfo = JSON.parse(acceptStr);
    }
    lenConName.innerHTML = loanInfo.borrowerName;
    lenConID.innerHTML = loanInfo.borrowerID;
    lenConPhone.innerHTML = loanInfo.borrowerPhone;
    lenConType.innerHTML = loanInfo.borrowType;
    lenConSum.innerHTML = loanInfo.borrowedSum;
    lenConDateTime.innerHTML = loanInfo.loanDuration;
};


let cirBtn = document.getElementById('continue-lend');
cirBtn.onclick = function () {
    alert('pushed');
    //交易单号位交易地点代码+交易时间(距离1970/01/01的毫秒数)
    let borrowDatetime = new Date().Format("yyyy-MM-dd HH:mm:ss");
    let tradeOrder = '000' + Date.parse(borrowDatetime);
    tradeOrder = tradeOrder.slice(0,-3);
    loanInfo.borrowerTime = borrowDatetime;
    loanInfo.tradeOrder = tradeOrder;
    loanInfo.tradePlace = '中国银行江宁分行';
    loanInfo.payback = 0;
    loanInfo.paybackTime = null;
    loanInfo.funding_terms = 0;
    loanInfo.isUpload = 0;
    loanInfo.fundedAmount = document.getElementById('').value;
    loanInfo.shouldPaybackTime = borrowDatetime.setMonth(borrowDatetime.getMonth()+loanInfo.loanDuration)
        .Format("yyyy-MM-dd HH:mm:ss");
    console.log(loanInfo.shouldPaybackTime);

    var response;
    ajaxResponse(xhrRegister, function () {
        response = JSON.parse(xhrRegister.responseText);
        //可在之后改为模态框
        alert(response.msg);
        localStorage.removeItem('loanInfo');
        location.assign('./lending.html');
    }, function () {
        response = JSON.parse(xhrRegister.responseText);
        //可在之后改为模态框
        alert(response.msg);
        localStorage.removeItem('loanInfo');
        location.assign('./lending.html');
    });

    xhrRegister.open('POST', '../addLending/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(loanInfo));


};

let modBtn = document.getElementById('continue-modify');
modBtn.onclick = function () {
    if (localStorage.getItem('loanInfo') != null) {
        localStorage.removeItem('loanInfo');
    }
    location.assign('./lending.html');
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
};

function listToJSONStr(str) {
    //从后端传来的list使用该方法转换成json字符串
    str = str.slice(1, -1);
    return str;
}

//Date的prototype 属性可以向对象添加属性和方法。
Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "S+": this.getMilliseconds()
    };
    //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
        //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
        }
    }
    return fmt;
};

//模态框
(function() {
	/*建立模态框对象*/
	var modalBox = {};
	/*获取模态框*/
	modalBox.modal = document.getElementById("lendingModal");
    /*获得trigger按钮*/
	modalBox.triggerBtn = document.getElementById("continue-lend");
    /*获得关闭按钮*/
	modalBox.closeBtn = document.getElementById("lending_closeBtn");
	/*模态框显示*/
	modalBox.show = function() {
		console.log(this.modal);
		this.modal.style.display = "block";
	};
	/*模态框关闭*/
	modalBox.close = function() {
		this.modal.style.display = "none";
		self.location.href="./lending.html";

	};
	/*当用户点击模态框内容之外的区域，模态框也会关闭*/
	// modalBox.outsideClick = function() {
	// 	var modal = this.modal;
	// 	window.onclick = function(event) {
    //         if(event.target == modal) {
    //         	modal.style.display = "none";
    //         }
	// 	}
	// }
    /*模态框初始化*/
	modalBox.init = function() {
		var that = this;
		this.triggerBtn.onclick = function() {
            that.show();
		}
		this.closeBtn.onclick = function() {
			that.close();
		}
		this.outsideClick();
	}
	modalBox.init();

})();