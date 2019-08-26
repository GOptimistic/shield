(function() {
	/*建立模态框对象*/
	var modalBox = {};
	/*获取模态框*/
	modalBox.modal = document.getElementById("myModal");
    /*获得trigger按钮*/
	modalBox.triggerBtn = document.getElementById("triggerBtn");
    /*获得关闭按钮*/
	modalBox.closeBtn = document.getElementById("closeBtn");
	/*模态框显示*/
	modalBox.show = function() {
		console.log(this.modal);
		this.modal.style.display = "block";
	}
	/*模态框关闭*/
	modalBox.close = function() {
		this.modal.style.display = "none";

	}
	/*当用户点击模态框内容之外的区域，模态框也会关闭*/
	modalBox.outsideClick = function() {
		var modal = this.modal;
		window.onclick = function(event) {
            if(event.target == modal) {
            	modal.style.display = "none";
            }
		}
	}
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

/*按钮弹出模态框*/
function lending_confirm_pop_box(){
    var container = document.getElementById('div-container');
    container.style.display="block";
}

/*取消事件*/
function cancle(){
    var container = document.getElementById('div-container');
    container.style.display="none";
}

/*确认事件，因为现在没有确认事件，就将弹出框隐藏*/
function confrim(){
    var container = document.getElementById('div-container');
    container.style.display="none";
}