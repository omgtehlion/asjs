### What is asjs?

asjs is yet anoter attempt to bring [async/await](http://msdn.microsoft.com/en-us/library/vstudio/hh191443.aspx#BKMK_HowtoWriteanAsyncMethod) to JavaScript.

### What is async/await anyway?

In short, async/await is a syntax sugar for [promises](http://wiki.commonjs.org/wiki/Promises/A).

In JavaScript asynchronous programming usually utilizes callbacks or [promises](http://wiki.commonjs.org/wiki/Promises/A). (A promise object represents a value that will be fulfilled in the future). Promises were designed to bring some structure and clarity to async code, and reduce callback clutter.
In C# world people were using callbacks too, then there were [future objects/Tasks](http://msdn.microsoft.com/en-us/library/vstudio/system.threading.tasks.task.aspx) with async/await syntax sugar.

Tasks in C# and promises in JS have a lot in common. They both represent some value that a function may proide. Or error if a function failed in some way. Hence, concepts are really similar, but async syntax is much simpler than using a promise.

Consider this pseudo-code, func1 and func2 return promises:
```js
var myFunc = function() {
    func1().then(function(data1) {
        //... some processing of data1 ...
        return func2(someProcessedValue);
    }).then(function(data2) {
        //... some processing of data2 ...
    });
}
```
Here you have a lot of boiler-plate code: every time you have to repeat `then`, `function` and a lot of braces.

Async/await in C# gives much cleaner syntax:
```c#
async void myFunc() {
    var data1 = await func1();
    //... some processing of data1 ...
    var data2 = await func2(someProcessedValue);
    //... some processing of data2 ...
}
```

You have less callbacks, less clutter. Code now looks like you are using good old syncronous functions. But you still have all the benefits of async code and simplicity of synchronouse one.

In JavaScript this can be achieved by extending language syntax, or by changing async/await syntax slightly.
I chose the latter approach, because alternating JS syntax would brake a lot of tools, and I wanted some compatibility.

Here is the change:
```js
var myFunc = async(function() {
    var data1 = await(func1());
    // ... some processing of data1 ...
    var data2 = await(func2(someProcessedValue));
    // ... some processing of data2 ...
});
```

async and await keywords now look loke ordinary functions. This is still (syntactically) valid JavaScript code.

### Is this the first implementation?

No, it is not.
I [have](https://github.com/google/traceur-compiler/wiki/LanguageFeatures#wiki-Deferred_Functions) [tried](https://github.com/bjouhier/galaxy#asyncawait-in-javascript) [different](https://github.com/Alxandr/augmented) implementations, but was dissatisfied with all of them.

And, lastly, there’s a “[fatal flaw](http://www.hornlo.org/lohnet/wdjef/)” in all of them. To solve that problem, I decided to build asjs myself.

### Pros and cons
Pros:
  * this is still syntactically correct javascript, editors will not yell at you, tool will not complain;
  * it is very confined: brings only async/await feature, not whole new language;
  * compatible with any promises library of your choice (if it conforms to Promises/A or /A+);

Cons:
  * needs some preprocessing, though it can be done on-the-fly if you use node.js;
  * have some extra parentheses, when compared to C#.

### Try separately

  1. Clone this repo with `git clone https://github.com/omgtehlion/asjs.git`
  2. `cd asjs`
  3. Play with examples, using `node asjs examples/1-dns-query.js` (or `examples/2-count-lines.js`)
  4. Then try your own code with `node asjs your_app.js`.

### Try in your nodejs app which already uses promises

If you already have some application built using promises, you can easily try asjs.

  1. `npm install asjs`
  2. In the beginning of your entry point file insert this code: `require("asjs").setupOnTheFly(".tmpjs");`
  3. Replace any of your methods that use promises with async/await, these methods will be preprocessed on-the-fly
  4. Have fun.

### Command line tool

Can be obtained via npm or cloning a git repo.

```
usage: node asjs [flags] FILE

When no flag specified asjs will preprocess and execute your program
Available flags:
   --tmp           Save preprocessed code to FILE.tmp and execute it
   --preprocess    Just output preprocessed code to stdout, no execution
   --raw           Same as preprocess, but will not include runtime
                   this flag used to preprocess code for browsers
   --in-place      Preprocess and overwrite original file, no execution
```

### Tests

Tests can be  found in [test/](test/) directory.
To run tests use `npm test` command.
