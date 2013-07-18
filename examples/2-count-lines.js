var countLines = async(function(path) {
    var names = await(fs.readdir(path));
    var total = 0;
    for (var i = 0; i < names.length; i++) {
        var fullname = path + '/' + names[i];
        if ((await(fs.stat(fullname))).isDirectory()) {
            total += await(countLines(fullname));
        } else {
            var count = (await(fs.readFile(fullname, 'utf8'))).split('\n').length;
            console.log(fullname + ': ' + count);
            total += count;
        }
    }
    return total;
});

var projectLineCountsParallel = async(function() {
    var future1 = countLines(__dirname + '/../examples');
    var future2 = countLines(__dirname + '/../lib');
    var future3 = countLines(__dirname + '/../test');
    var total = await(future1) + await(future2) + await(future3);
    console.log('TOTAL: ' + total);
    return total;
});
