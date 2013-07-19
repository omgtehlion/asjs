var fs = require('vow-fs');

var countLines = async(function(path) {
    var names = await(fs.listDir(path));
    var total = 0;
    for (var i = 0; i < names.length; i++) {
        var fullname = path + '/' + names[i];
        var stat = await(fs.stat(fullname));
        if (stat.isDirectory()) {
            total += await(countLines(fullname));
        } else {
            var content = await(fs.read(fullname, 'utf8'));
            var count = content.split('\n').length;
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
