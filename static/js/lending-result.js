window.onload = function () {
    let xhrRegister = new XMLHttpRequest();
    let lendingResult ={
        borrowerName: borrowerName,
        borrowerID: borrowerID
    }

    ajaxResponse()

    xhrRegister.open('POST','http://127.0.0.1:8000/Lending-Result');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(lendingResult));
};