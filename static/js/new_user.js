//新用户页面js文件
//作者：霍然
//时间：2019-09-5
let xhrRegister = new XMLHttpRequest();
//响应函数模板
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

//模态框函数，发出请求新建用户
(function() {
	/*建立模态框对象*/
	var modalBox = {};
	/*获取模态框*/
	modalBox.modal = document.getElementById("addModal");
    /*获得trigger按钮*/
   modalBox.triggerBtn = document.getElementById("new_confirm");
    /*获得关闭按钮*/
	modalBox.closeBtn = document.getElementById("add_closeBtn");
	/*确定退出按钮*/
	var addconfirm = document.getElementById("add_btn_confirm");
	/*取消退出按钮*/
	var addcancel = document.getElementById("add_btn_cancel");
	addconfirm.onclick=function(){
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
	addcancel.onclick=function(){
		modalBox.close();
	};
	/*模态框显示*/
	modalBox.show = function() {
		console.log(this.modal);
		this.modal.style.display = "block";
	};
	/*模态框关闭*/
	modalBox.close = function() {
		this.modal.style.display = "none";
	};
	/*当用户点击模态框内容之外的区域，模态框也会关闭*/
	modalBox.outsideClick = function() {
		var modal = this.modal;
		window.onclick = function(event) {
            if(event.target == modal) {
            	modal.style.display = "none";
            }
		}
	};
    /*模态框初始化*/
	modalBox.init = function() {
		var that = this;
		//alert("0000");
		this.triggerBtn.onclick = function() {
            that.show();
		};
		this.closeBtn.onclick = function() {
			that.close();
		};
		this.outsideClick();
	};
	modalBox.init();
})();