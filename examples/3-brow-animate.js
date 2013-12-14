var animation;

document.getElementById("btn-animate").onclick = async(function() {
    var element = document.getElementById("animated");
    var current = animation = {};

    element.style.left = "0px";
    element.style.top = "50px";
    var STEPS = 20;

    var move = async(function(prop, from, to) {
        var step = (to - from) / STEPS;
        for (var i = 0; i <= STEPS && current === animation; i++) {
            element.style[prop] = (from + i * step) + "px";
            await(Vow.delay(0, 30));
        }
    });

    await(move("left", 0, 100));
    await(move("top", 50, 150));
    await(move("left", 100, 0));
    await(move("top", 150, 50));
});
