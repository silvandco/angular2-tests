System.register(['../utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils;
    var bindPromiseFn;
    function _patchPromiseFnsOnObject(objectPath, fnNames) {
        var obj = global;
        var exists = objectPath.every(function (segment) {
            obj = obj[segment];
            return obj;
        });
        if (!exists) {
            return;
        }
        fnNames.forEach(function (name) {
            var fn = obj[name];
            if (fn) {
                obj[name] = bindPromiseFn(fn);
            }
        });
    }
    function _patchThenable(thenable) {
        var then = thenable.then;
        thenable.then = function () {
            var args = utils.bindArguments(arguments);
            var nextThenable = then.apply(thenable, args);
            return _patchThenable(nextThenable);
        };
        var ocatch = thenable.catch;
        thenable.catch = function () {
            var args = utils.bindArguments(arguments);
            var nextThenable = ocatch.apply(thenable, args);
            return _patchThenable(nextThenable);
        };
        return thenable;
    }
    function apply() {
        // Patch .then() and .catch() on native Promises to execute callbacks in the zone where
        // those functions are called.
        if (global.Promise) {
            utils.patchPrototype(Promise.prototype, [
                'then',
                'catch'
            ]);
            // Patch browser APIs that return a Promise
            var patchFns = [
                // fetch
                [[], ['fetch']],
                [['Response', 'prototype'], ['arrayBuffer', 'blob', 'json', 'text']]
            ];
            patchFns.forEach(function (objPathAndFns) {
                _patchPromiseFnsOnObject(objPathAndFns[0], objPathAndFns[1]);
            });
        }
    }
    exports_1("apply", apply);
    return {
        setters:[
            function (utils_1) {
                utils = utils_1;
            }],
        execute: function() {
            if (global.Promise) {
                exports_1("bindPromiseFn", bindPromiseFn = function (delegate) {
                    return function () {
                        var delegatePromise = delegate.apply(this, arguments);
                        // if the delegate returned an instance of Promise, forward it.
                        if (delegatePromise instanceof Promise) {
                            return delegatePromise;
                        }
                        // Otherwise wrap the Promise-like in a global Promise
                        return new Promise(function (resolve, reject) {
                            delegatePromise.then(resolve, reject);
                        });
                    };
                });
            }
            else {
                exports_1("bindPromiseFn", bindPromiseFn = function (delegate) {
                    return function () {
                        return _patchThenable(delegate.apply(this, arguments));
                    };
                });
            }
            module.exports = {
                apply: apply,
                bindPromiseFn: bindPromiseFn
            };
        }
    }
});
//# sourceMappingURL=promise.js.map