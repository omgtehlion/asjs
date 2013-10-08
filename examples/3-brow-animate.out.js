var asyncAnimate = function (element) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var STEPS, move;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                element.style.left = "0px";
                element.style.top = "50px";
                STEPS = 20;
                move = function (prop, from, to) {
                    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
                    var step, i;
                    return __builder.run(function () {
                        switch (__state) {
                        case 0: {
                                step = (to - from) / STEPS;
                                i = 0;
                                __state = 1;
                                return __continue;
                            }
                        case 1: {
                                if (i <= STEPS) {
                                    element.style[prop] = from + i * step + "px";
                                    __state = 3;
                                    return Vow.delay(0, 30);
                                } else {
                                    __state = -1;
                                    __builder.ret();
                                    break;
                                }
                            }
                        case 3: {
                                i++;
                                __state = 1;
                                return __continue;
                            }
                        default:
                            throw 'Internal error: encountered wrong state';
                        }
                    });
                };
                __state = 1;
                return move("left", 0, 100);
            }
        case 1: {
                __state = 2;
                return move("top", 50, 150);
            }
        case 2: {
                __state = 3;
                return move("left", 100, 0);
            }
        case 3: {
                __state = 4;
                return move("top", 150, 50);
            }
        case 4: {
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

var animation;
document.getElementById("btn-animate").onclick = function(e) {
    if (animation)
        animation.abort();
    animation = asyncAnimate(document.getElementById("animated"));
}

