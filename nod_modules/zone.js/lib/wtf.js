System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var wtfTrace, wtfEvents, wtfEnabled, enabled, createScope, createEvent, leaveScope, beginTimeRange, endTimeRange;
    function noop() {
    }
    return {
        setters:[],
        execute: function() {
            // Detect and setup WTF.
            wtfTrace = null;
            wtfEvents = null;
            wtfEnabled = (function () {
                var wtf = global['wtf'];
                if (wtf) {
                    wtfTrace = wtf['trace'];
                    if (wtfTrace) {
                        wtfEvents = wtfTrace['events'];
                        return true;
                    }
                }
                return false;
            })();
            exports_1("enabled", enabled = wtfEnabled);
            exports_1("createScope", createScope = wtfEnabled ? function (signature, flags) {
                return wtfEvents.createScope(signature, flags);
            } : function (s, f) {
                return noop;
            });
            exports_1("createEvent", createEvent = wtfEnabled ? function (signature, flags) {
                return wtfEvents.createInstance(signature, flags);
            } : function (s, f) {
                return noop;
            });
            exports_1("leaveScope", leaveScope = wtfEnabled ? function (scope, returnValue) {
                wtfTrace.leaveScope(scope, returnValue);
                return returnValue;
            } : function (s, v) {
                return v;
            });
            exports_1("beginTimeRange", beginTimeRange = wtfEnabled ? function (rangeType, action) {
                return wtfTrace.beginTimeRange(rangeType, action);
            } : function (t, a) {
                return null;
            });
            exports_1("endTimeRange", endTimeRange = wtfEnabled ? function (range) {
                wtfTrace.endTimeRange(range);
            } : function (r) {
            });
        }
    }
});
//# sourceMappingURL=wtf.js.map