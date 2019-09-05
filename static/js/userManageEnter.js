// function ajaxResponse(xhr, successFunction, falseFunction) {
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             console.log(xhr.status);
//             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
//                 successFunction();
//             } else {
//                 falseFunction();
//             }
//         }
//     }
// };
(function() {
	/*建立模态框对象*/
	var modalBox = {};
	/*获取模态框*/
	modalBox.modal = document.getElementById("userModal");
	/*获得trigger按钮*/
	modalBox.triggerBtn = document.getElementById("usermanagemententry");
    /*获得关闭按钮*/
	modalBox.closeBtn = document.getElementById("user_management_closeBtn");
	/*模态框显示*/
	modalBox.show = function() {
		console.log(this.modal);
		this.modal.style.display = "block";
	}
	/*模态框关闭*/
	modalBox.close = function() {
		this.modal.style.display = "none";

	}
	modalBox.init = function() {
		var that = this;
		this.triggerBtn.onclick = function(){
		    that.show();
        }

		this.closeBtn.onclick = function() {
			that.close();
		}
	}

	modalBox.init();

	var confrim = document.getElementById("usermanage_con");
	var cancle = document.getElementById("usermanage_can");
	confrim.onclick = function () {
		// let xhrRegister = new XMLHttpRequest();
		var user_id = document.getElementById("usermanageinputid").value;
		var user_psw = document.getElementById("usermanageinputpsw").value;
		if((user_id != "") && (user_psw != ""))
		{
			// ajaxResponse(xhrRegister,
			// function () {
			// 	let response = JSON.parse(xhrRegister.responseText);
			// },function () {
			// });
			if((user_id == "admin") && (user_psw == "admin"))
			{
				console.log("haole ");
				location.assign('./user_management.html');
			}
		}
		else
		{
			alert("输入不能为空");
		}
		// let user = {
		// 	USERID: userid,
		// 	USERPSW: userpsw
		// }
		//  xhrRegister.open('POST', '../userManageEnter/');
		// xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
		// xhrRegister.send(JSON.stringify(user));

	};

	cancle.onclick = function () {
		modalBox.close();
	}


})();




