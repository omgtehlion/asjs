var asyncAnimate = function (element) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var i;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                element.style.left = "0px";
                element.style.top = "50px";
                i = 0;
                __state = 1;
                return __continue;
            }
        case 1: {
                if (i <= 100) {
                    element.style.left = i + "px";
                    __state = 3;
                    return __awaiter = Vow.delay(0, 30);
                } else {
                    i = 50;
                    __state = 5;
                    return __continue;
                }
            }
        case 3: {
                i += 5;
                __state = 1;
                return __continue;
            }
        case 5: {
                if (i <= 150) {
                    element.style.top = i + "px";
                    __state = 7;
                    return __awaiter = Vow.delay(0, 30);
                } else {
                    i = 100;
                    __state = 9;
                    return __continue;
                }
            }
        case 7: {
                i += 5;
                __state = 5;
                return __continue;
            }
        case 9: {
                if (i >= 0) {
                    element.style.left = i + "px";
                    __state = 11;
                    return __awaiter = Vow.delay(0, 30);
                } else {
                    i = 150;
                    __state = 13;
                    return __continue;
                }
            }
        case 11: {
                i -= 5;
                __state = 9;
                return __continue;
            }
        case 13: {
                if (i >= 50) {
                    element.style.top = i + "px";
                    __state = 15;
                    return __awaiter = Vow.delay(0, 30);
                } else {
                    __state = -1;
                    __builder.ret();
                    break;
                }
            }
        case 15: {
                i -= 5;
                __state = 13;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

var animation;
document.getElementById("btn-animate").onclick = function(e) {
    if (animation)
        animation.abort();
    animation = asyncAnimate(document.getElementById("animated"));
}

