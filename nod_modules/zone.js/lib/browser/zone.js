System.register(['../core', '../patch/browser'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core, browserPatch;
    var Zone;
    return {
        setters:[
            function (core_1) {
                core = core_1;
            },
            function (browserPatch_1) {
                browserPatch = browserPatch_1;
            }],
        execute: function() {
            if (global.Zone) {
                console.warn('Zone already exported on window the object!');
            }
            else {
                global.Zone = core.Zone;
                global.zone = new global.Zone();
                browserPatch.apply();
            }
            exports_1("Zone", Zone = global.Zone);
        }
    }
});
//# sourceMappingURL=zone.js.map