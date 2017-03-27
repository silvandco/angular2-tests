System.register(['rxjs/Observable'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Observable_1;
    var obs;
    return {
        setters:[
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            obs = new Observable_1.Observable(function (obs) {
                var i = 0;
                setInterval(function (_) { obs.next(++i); }, 1000);
            });
            obs.subscribe(function (i) { return console.log(i + " seconds elapsed"); });
        }
    }
});
// #enddocregion
//# sourceMappingURL=observable.js.map