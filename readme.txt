[ о чём это вообще? ]

это — синтаксический сахар для промисов, благодаря которому не надо создавать много колбэков.
например, была функция: 
  var func = function() {
      var promise = Vow.promise();
      .....что-то полезное....
      promise.resolve(x)
      .....
      return promise;
  }
то с этим «сахаром» можно написать:
  var func = async(function() {
      .....что-то полезное....
      return x;
  }
asjs автоматически завернёт возвращаемое значение в промис

и с другой стороны, если с промисами приходится писать:
  promise1().then(function(data1) {
      ... операции с data1 ...
      return promise2(data1.x);
  }).then(function(data2) {
      ... операции с data2 ...
  }).then
  ....
то с async-await можно написать как-будто этот код синхронный:
  var data1 = await(promise1());
  ... операции с data1 ...
  var data2 = await(promise2(data1.x));
  ... операции с data2 ...
  ...
естественно, код останется асинхронным, просто будет завёрнут в ожидание промисов


[ что запускать ]

node asjs file.js — препроцессит и выполняет на лету
node asjs --tmp file.js — препроцессит в *.tmp.js и выполняет
node asjs --preprocess file.js — препроцессит и выводит в stdout
node asjs --in-place file.js — препроцессит прямо на месте

node asjs на unix-системах можно заменить просто на ./asjs.js
