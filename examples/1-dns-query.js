var dns = require("dns");
var fs = require("fs");
require("../tests/include/promisify");

var main = async(function(fileName) {
    var hosts = await(fs.readFile.promise(fileName, "utf-8")).split("\n");
    console.log("Querying " + hosts.length + " domains in parallel...");
    var values = hosts.map(function(host) { return dns.resolve.promise(host); });
    var addrMap = {};
    for (var i = 0; i < hosts.length; i++)
        addrMap[hosts[i]] = await(values[i]);
    return addrMap;
});

main(__dirname + "/../tests/include/hosts.txt").then(
    function(data) { console.log("result: " + JSON.stringify(data)); },
    function(err) { console.error("error: " + err); }
);
