/// {
///     description: 'Await on promises from other libs',
///     stdout: 'hello!\n0'
/// }

var when = require("when");

ticks = 0;
var running = true;
var ticker = function() {
    ticks++;
    if (running)
        process.nextTick(ticker);
};
ticker();

var main = async(function() {
    var resolved = when.resolve("hello!");
    console.log(await(resolved));
    
    var start = ticks;
    for (var i = 0; i < 1000; i++)
        await(resolved);
    console.log(ticks - start);
    running = false;
});

main();
