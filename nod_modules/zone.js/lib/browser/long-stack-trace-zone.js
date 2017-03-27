System.register(['../zones/long-stack-trace'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var long_stack_trace_1;
    return {
        setters:[
            function (long_stack_trace_1_1) {
                long_stack_trace_1 = long_stack_trace_1_1;
            }],
        execute: function() {
            if (!global.Zone) {
                throw new Error('zone.js should be installed before loading the long stack trace zone');
            }
            global.Zone.longStackTraceZone = long_stack_trace_1.longStackTraceZone;
        }
    }
});
//# sourceMappingURL=long-stack-trace-zone.js.map