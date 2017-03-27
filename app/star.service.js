System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var StarService;
    return {
        setters:[],
        execute: function() {
            StarService = (function () {
                function StarService() {
                }
                StarService.prototype.getStar = function () {
                    return "Estrella";
                };
                return StarService;
            }());
            exports_1("StarService", StarService);
        }
    }
});
//# sourceMappingURL=star.service.js.map