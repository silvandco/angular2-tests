System.register(['../jasmine/patch'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jasminePatch;
    return {
        setters:[
            function (jasminePatch_1) {
                jasminePatch = jasminePatch_1;
            }],
        execute: function() {
            jasminePatch.apply();
        }
    }
});
//# sourceMappingURL=jasmine-patch.js.map