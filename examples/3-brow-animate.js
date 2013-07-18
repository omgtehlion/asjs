var asyncAnimate = async(function(element) {
    element.style.left = "0px";
    element.style.top = "50px";
    for (var i = 0; i <= 100; i += 5) {
        element.style.left = i + "px";
        await(Vow.delay(0, 30));
    }
    for (var i = 50; i <= 150; i += 5) {
        element.style.top = i + "px";
        await(Vow.delay(0, 30));
    }
    for (var i = 100; i >= 0; i -= 5) {
        element.style.left = i + "px";
        await(Vow.delay(0, 30));
    }
    for (var i = 150; i >= 50; i -= 5) {
        element.style.top = i + "px";
        await(Vow.delay(0, 30));
    }
});

var animation;
document.getElementById("btn-animate").onclick = function(e) {
    if (animation)
        animation.abort();
    animation = asyncAnimate(document.getElementById("animated"));
}
