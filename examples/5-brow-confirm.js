var btnConfirm = document.getElementById("btn-confirm");
var chkCustomConfirm = document.getElementById("chk-custom-confirm");
var confirmResult = document.getElementById("confirm-result");

btnConfirm.onclick = async(function(e) {
    var confirm = (chkCustomConfirm.checked ? customConfirm : sysConfirm)("Do you really want to do some nasty action?");
    confirmResult.innerHTML = await(confirm);
});

// using default system confirmation:
var sysConfirm = async(function(message) {
    return confirm(message);
});

// using custom on-page dialog:
var customConfirm = function(message) {
    var promise = Vow.promise();

    var wrap = document.getElementById("confirm-wrap");
    var txt = document.getElementById("confirm-txt");
    var ok = document.getElementById("confirm-ok");
    var cancel = document.getElementById("confirm-cancel");

    document.body.style.overflow = "hidden";
    wrap.style.display = "block";
    txt.innerHTML = "";
    txt.appendChild(document.createTextNode(message));
    ok.onclick = function() { cleanup(); promise.fulfill(true); };
    cancel.onclick = function() { cleanup(); promise.fulfill(false); };
    function cleanup() {
        document.body.style.overflow = "auto";
        wrap.style.display = "none";
    }

    return promise;
};
