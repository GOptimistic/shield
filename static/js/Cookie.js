

window.onload = chkCookieFun();
function chkCookieFun(){
    var hadName = getCookie();
    if(hadName == '' || hadName == null){
        //如果没有登陆
    }else{
        //如果登陆
    }

};

 //获取cookie
    var getCookie = function () {
        //获取当前所有cookie
        var strCookies = document.cookie;
        //截取变成cookie数组
        var array = strCookies.split(';');
        //循环每个cookie
        for (var i = 0; i < array.length; i++) {
            //将cookie截取成两部分
            var item = array[i].split("=");
            //判断cookie的name 是否相等
            if (item[0] == 'username') {
                return item[1];
            }
        }
        return null;
    }