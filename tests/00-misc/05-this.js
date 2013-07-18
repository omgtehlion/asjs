/// {
///     description: '`this` should be a valid pointer',
///     stdout: 'promised'
/// }

var Vow = require("vow");
var x = {
    promiseMe: function() {
        return Vow.fulfill("promised");
    },
    main: async(function() {
        console.log(await(this.promiseMe()));
    })
};

x.main();
