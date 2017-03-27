System.register(['../utils'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var utils;
    function apply() {
        // patched properties depend on addEventListener, so this needs to come first
        if (global.EventTarget) {
            utils.patchEventTargetMethods(global.EventTarget.prototype);
        }
        else {
            var apis = [
                'ApplicationCache',
                'EventSource',
                'FileReader',
                'InputMethodContext',
                'MediaController',
                'MessagePort',
                'Node',
                'Performance',
                'SVGElementInstance',
                'SharedWorker',
                'TextTrack',
                'TextTrackCue',
                'TextTrackList',
                'WebKitNamedFlow',
                'Worker',
                'WorkerGlobalScope',
                'XMLHttpRequest',
                'XMLHttpRequestEventTarget',
                'XMLHttpRequestUpload'
            ];
            apis.forEach(function (api) {
                var proto = global[api] && global[api].prototype;
                // Some browsers e.g. Android 4.3's don't actually implement
                // the EventTarget methods for all of these e.g. FileReader.
                // In this case, there is nothing to patch.
                if (proto && proto.addEventListener) {
                    utils.patchEventTargetMethods(proto);
                }
            });
            // Patch the methods on `window` instead of `Window.prototype`
            // `Window` is not accessible on Android 4.3
            if (typeof (window) !== 'undefined') {
                utils.patchEventTargetMethods(window);
            }
        }
    }
    exports_1("apply", apply);
    return {
        setters:[
            function (utils_1) {
                utils = utils_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=event-target.js.map