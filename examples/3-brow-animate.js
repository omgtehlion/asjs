var asyncAnimate = async(function(element) {
    element.style.left = "0px";
    element.style.top = "50px";
    var STEPS = 20;

    var move = async(function(prop, from, to) {
        var step = (to - from) / STEPS;
        for (var i = 0; i <= STEPS; i++) {
            element.style[prop] = (from + i * step) + "px";
            await(Vow.delay(0, 30));
        }
    });

    await(move("left", 0, 100));
    await(move("top", 50, 150));
    await(move("left", 100, 0));
    await(move("top", 150, 50));
});

var animation;
document.getElementById("btn-animate").onclick = function(e) {
    if (animation)
        animation.abort();
    animation = asyncAnimate(document.getElementById("animated"));
}
