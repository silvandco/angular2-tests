System.register(['./define-property', '../utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var define_property_1, utils;
    function apply() {
        if (utils.isWebWorker() || utils.isNode() || !('registerElement' in global.document)) {
            return;
        }
        var _registerElement = document.registerElement;
        var callbacks = [
            'createdCallback',
            'attachedCallback',
            'detachedCallback',
            'attributeChangedCallback'
        ];
        document.registerElement = function (name, opts) {
            if (opts && opts.prototype) {
                callbacks.forEach(function (callback) {
                    if (opts.prototype.hasOwnProperty(callback)) {
                        var descriptor = Object.getOwnPropertyDescriptor(opts.prototype, callback);
                        if (descriptor && descriptor.value) {
                            descriptor.value = global.zone.bind(descriptor.value);
                            define_property_1._redefineProperty(opts.prototype, callback, descriptor);
                        }
                        else {
                            opts.prototype[callback] = global.zone.bind(opts.prototype[callback]);
                        }
                    }
                    else if (opts.prototype[callback]) {
                        opts.prototype[callback] = global.zone.bind(opts.prototype[callback]);
                    }
                });
            }
            return _registerElement.apply(document, [name, opts]);
        };
    }
    exports_1("apply", apply);
    return {
        setters:[
            function (define_property_1_1) {
                define_property_1 = define_property_1_1;
            },
            function (utils_1) {
                utils = utils_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=register-element.js.map