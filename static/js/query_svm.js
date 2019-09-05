let query_analysis = document.getElementById('query_analysis');

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

query_analysis.onclick = function(){
    let xhrRegister = new XMLHttpRequest();
    ajaxResponse(xhrRegister,
        function () {
            re = JSON.parse(xhrRegister.responseText);
            console.log(re);

        }, function () {
        });
    // let search = {
    //     search_context: search_context,
    //     search_status: value
    // };
    let search = 'test'

    xhrRegister.open('POST', '../query_svm/');
    xhrRegister.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhrRegister.send(JSON.stringify(search));
}