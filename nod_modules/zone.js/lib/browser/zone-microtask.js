System.register(['../microtask', 'es6-promise', '../core', '../patch/browser'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var microtask, es6Promise, core, browserPatch;
    return {
        setters:[
            function (microtask_1) {
                microtask = microtask_1;
            },
            function (es6Promise_1) {
                es6Promise = es6Promise_1;
            },
            function (core_1) {
                core = core_1;
            },
            function (browserPatch_1) {
                browserPatch = browserPatch_1;
            }],
        execute: function() {
            if (core.Zone.prototype['scheduleMicrotask']) {
                console.warn('Zone-microtasks already exported on window the object!');
            }
            else {
                microtask.addMicrotaskSupport(core.Zone);
                global.Zone = core.Zone;
                global.zone = new global.Zone();
                // Monkey patch the Promise implementation to add support for microtasks
                global.Promise = es6Promise.Promise;
                browserPatch.apply();
            }
        }
    }
});
//# sourceMappingURL=zone-microtask.js.map