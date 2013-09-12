/// {
///     description: 'Should not wait for already resolved promise',
///     stdout: '0'
/// }

var Vow = require("vow");

ticks = 0;
var running = true;
var ticker = function() {
    ticks++;
    if (running)
        process.nextTick(ticker);
};
ticker();

var main = async(function() {
    var promised = Vow.fulfill(1);
    await(promised);

    var start = ticks;
    for (var i = 0; i < 1000; i++)
        await(promised);
    console.log(ticks - start);
    running = false;
});

main();
