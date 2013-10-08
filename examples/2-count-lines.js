var fs = require('vow-fs');

var countLines = async(function(path) {
    var names = await(fs.listDir(path));
    var total = 0;
    for (var i = 0; i < names.length; i++) {
        var fullname = path + '/' + names[i];
        if (await(fs.stat(fullname)).isDirectory()) {
            total += await(countLines(fullname));
        } else {
            var count = await(fs.read(fullname, 'utf-8')).split('\n').length;
            console.log(fullname + ': ' + count);
            total += count;
        }
    }
    return total;
});

var countLinesParallel = async(function() {
    console.log('Counting lines in parallel...');
    var future1 = countLines(__dirname + '/../examples');
    var future2 = countLines(__dirname + '/../src');
    var future3 = countLines(__dirname + '/../tests');
    var total = await(future1) + await(future2) + await(future3);
    console.log('TOTAL: ' + total);
    return total;
});

countLinesParallel().then(null, console.error);
