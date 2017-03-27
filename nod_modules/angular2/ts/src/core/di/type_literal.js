System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TypeLiteral;
    return {
        setters:[],
        execute: function() {
            /**
             * Type literals is a Dart-only feature. This is here only so we can x-compile
             * to multiple languages.
             */
            TypeLiteral = (function () {
                function TypeLiteral() {
                }
                Object.defineProperty(TypeLiteral.prototype, "type", {
                    get: function () { throw new Error("Type literals are only supported in Dart"); },
                    enumerable: true,
                    configurable: true
                });
                return TypeLiteral;
            }());
            exports_1("TypeLiteral", TypeLiteral);
        }
    }
});
//# sourceMappingURL=type_literal.js.map