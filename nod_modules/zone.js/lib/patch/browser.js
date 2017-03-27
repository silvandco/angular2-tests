System.register(['./functions', './promise', './mutation-observer', './define-property', './register-element', './event-target', './property-descriptor', './geolocation', './file-reader'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var fnPatch, promisePatch, mutationObserverPatch, definePropertyPatch, registerElementPatch, eventTargetPatch, propertyDescriptorPatch, geolocationPatch, fileReaderPatch;
    function apply() {
        fnPatch.patchSetClearFunction(global, global.Zone, [
            ['setTimeout', 'clearTimeout', false, false],
            ['setInterval', 'clearInterval', true, false],
            ['setImmediate', 'clearImmediate', false, false],
            ['requestAnimationFrame', 'cancelAnimationFrame', false, true],
            ['mozRequestAnimationFrame', 'mozCancelAnimationFrame', false, true],
            ['webkitRequestAnimationFrame', 'webkitCancelAnimationFrame', false, true]
        ]);
        fnPatch.patchFunction(global, [
            'alert',
            'prompt'
        ]);
        eventTargetPatch.apply();
        propertyDescriptorPatch.apply();
        promisePatch.apply();
        mutationObserverPatch.patchClass('MutationObserver');
        mutationObserverPatch.patchClass('WebKitMutationObserver');
        definePropertyPatch.apply();
        registerElementPatch.apply();
        geolocationPatch.apply();
        fileReaderPatch.apply();
    }
    exports_1("apply", apply);
    return {
        setters:[
            function (fnPatch_1) {
                fnPatch = fnPatch_1;
            },
            function (promisePatch_1) {
                promisePatch = promisePatch_1;
            },
            function (mutationObserverPatch_1) {
                mutationObserverPatch = mutationObserverPatch_1;
            },
            function (definePropertyPatch_1) {
                definePropertyPatch = definePropertyPatch_1;
            },
            function (registerElementPatch_1) {
                registerElementPatch = registerElementPatch_1;
            },
            function (eventTargetPatch_1) {
                eventTargetPatch = eventTargetPatch_1;
            },
            function (propertyDescriptorPatch_1) {
                propertyDescriptorPatch = propertyDescriptorPatch_1;
            },
            function (geolocationPatch_1) {
                geolocationPatch = geolocationPatch_1;
            },
            function (fileReaderPatch_1) {
                fileReaderPatch = fileReaderPatch_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=browser.js.map