//home页面模态框
//作者：马瑞
//时间：2019-09-04
(function() {
	/*建立模态框对象*/
	var modalBox = {};
	/*获取模态框*/
	modalBox.modal = document.getElementById("myModal");
    /*获得trigger按钮*/
	modalBox.triggerBtn = document.getElementById("triggerBtn");
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
    /*模态框初始化*/
	modalBox.init = function() {
		var that = this;
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