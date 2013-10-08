var btnConfirm = document.getElementById("btn-confirm");
var chkCustomConfirm = document.getElementById("chk-custom-confirm");
var confirmResult = document.getElementById("confirm-result");

btnConfirm.onclick = function (e) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1;
    var confirm;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                confirm = (chkCustomConfirm.checked ? customConfirm : sysConfirm)("Do you really want to do some nasty action?");
                __state = 1;
                return confirm;
            }
        case 1: {
                $1 = __builder.val;
                confirmResult.innerHTML = $1;
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

// using default system confirmation:
var sysConfirm = function (message) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                $1 = confirm(message);
                __state = -1;
                __builder.ret($1);
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

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

