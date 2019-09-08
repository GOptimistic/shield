var re;
window.onload = function () {
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
            re = JSON.parse(xhrRegister.responseText);
            let tbody = document.getElementById('black-list');
            tbody.innerHTML = "";
            var index = 0;
            for (; index < re.length; index++) {

                console.log(re[index]);
                tbody.innerHTML = tbody.innerHTML + '<tr id="blacklist_tr' + (index + 1) + '><td><input type="checkbox"></td><td>' +
                    (index + 1) + '</td><td>' + re[index].name + '</td><td>' +
                    re[index].ID_card + '</td><td>' + re[index].money +
                    '</td><td>' + re[index].default_date + '</td><td>' +re[index].funding_terms+
                    '</td></tr>';
            }
        }, function () {
        });

    xhrRegister.open('POST', '../blacklist/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send();
};

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