System.register(['../keys'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var keys;
    var originalInstanceKey, creationZoneKey, isActiveKey;
    // wrap some native API on `window`
    function patchClass(className) {
        var OriginalClass = global[className];
        if (!OriginalClass)
            return;
        global[className] = function (fn) {
            this[originalInstanceKey] = new OriginalClass(global.zone.bind(fn, true));
            // Remember where the class was instantiate to execute the enqueueTask and dequeueTask hooks
            this[creationZoneKey] = global.zone;
        };
        var instance = new OriginalClass(function () { });
        global[className].prototype.disconnect = function () {
            var result = this[originalInstanceKey].disconnect.apply(this[originalInstanceKey], arguments);
            if (this[isActiveKey]) {
                this[creationZoneKey].dequeueTask();
                this[isActiveKey] = false;
            }
            return result;
        };
        global[className].prototype.observe = function () {
            if (!this[isActiveKey]) {
                this[creationZoneKey].enqueueTask();
                this[isActiveKey] = true;
            }
            return this[originalInstanceKey].observe.apply(this[originalInstanceKey], arguments);
        };
        var prop;
        for (prop in instance) {
            (function (prop) {
                if (typeof global[className].prototype !== 'undefined') {
                    return;
                }
                if (typeof instance[prop] === 'function') {
                    global[className].prototype[prop] = function () {
                        return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                    };
                }
                else {
                    Object.defineProperty(global[className].prototype, prop, {
                        set: function (fn) {
                            if (typeof fn === 'function') {
                                this[originalInstanceKey][prop] = global.zone.bind(fn);
                            }
                            else {
                                this[originalInstanceKey][prop] = fn;
                            }
                        },
                        get: function () {
                            return this[originalInstanceKey][prop];
                        }
                    });
                }
            }(prop));
        }
    }
    exports_1("patchClass", patchClass);
    return {
        setters:[
            function (keys_1) {
                keys = keys_1;
            }],
        execute: function() {
            originalInstanceKey = keys.create('originalInstance');
            creationZoneKey = keys.create('creationZone');
            isActiveKey = keys.create('isActive');
            ;
        }
    }
});
//# sourceMappingURL=mutation-observer.js.map