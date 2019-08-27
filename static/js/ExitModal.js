(function() {
	/*建立模态框对象*/
	var modalBox = {};
	/*获取模态框*/
	modalBox.modal = document.getElementById("ExitModal");
    /*获得trigger按钮*/
	modalBox.triggerBtn = document.getElementById("exitaccount");
    /*获得关闭按钮*/
	modalBox.closeBtn = document.getElementById("closeBtn");
	/*确定退出按钮*/
	var exitconfirm = document.getElementById("exit_btn_confirm");
	/*取消退出按钮*/
	var exitcancel = document.getElementById("exit_btn_cancel");
	exitconfirm.onclick=function(){
		modalBox.close();
		window.location.href = "./home.html";
	}
	exitcancel.onclick=function(){
		modalBox.close();


	}
	/*模态框显示*/
	modalBox.show = function() {
		console.log(this.modal);
		this.modal.style.display = "block";
	}
	/*模态框关闭*/
	modalBox.close = function() {
		this.modal.style.display = "none";
		// self.location.href="./lending.html";

	}
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
		//alert("0000");
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







