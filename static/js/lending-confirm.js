let cirBtn = document.getElementById('continue-lend');

cirBtn.onclick = function () {
    let xhrRegister = new XMLHttpRequest();
    //交易单号位交易地点代码+交易时间(距离1970/01/01的毫秒数)
    let borrowDatetime = new Date().Format("yyyy-MM-dd HH:mm:ss");
    var tradeOrder = '000' + Date.parse(borrowDatetime);

    var lendingInfo = {
        borrowerName: borrowerName,
        borrowerID: borrowerID,
        borrowerTime: borrowDatetime,
        borrowerSum: borrowedMoney,
        borrowerPhone: borrowerPhone,
        borrowType: loanType,
        payback: 0,
        shouldPaybackTime: shouldPaybackTime,
        paybackTime: null,
        tradeOrder: tradeOrder,
        tradePlace: '中国银行江宁分行'
    };

    xhrRegister.open('POST', 'http://127.0.0.1:8000/addLending')
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(lendingInfo));
};

