/**
 * Creates keys for `private` properties on exposed objects to minimize interactions with other codebases.
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common;
    function create(name) {
        // `Symbol` implementation is broken in Chrome 39.0.2171, do not use them even if they are available
        return '_zone$' + name;
    }
    exports_1("create", create);
    return {
        setters:[],
        execute: function() {
            exports_1("common", common = {
                addEventListener: create('addEventListener'),
                removeEventListener: create('removeEventListener')
            });
        }
    }
});
//# sourceMappingURL=keys.js.map