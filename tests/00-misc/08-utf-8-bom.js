/// {
///     description: 'Utf-8 BOM at the beginning of source should be skipped',
///     exact: true
/// }

﻿// <-- mind the BOM
var main = async(function() {
    var data = 12345;
    console.log("data: " + data);
    return data;
});

main().then(function(x) {
    console.log("returned: " + x);
}, function(y) {
    console.log("failed: " + y);
});
