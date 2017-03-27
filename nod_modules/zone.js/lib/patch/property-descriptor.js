System.register(['./websocket', '../utils', '../keys'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var webSocketPatch, utils, keys;
    var eventNames, unboundKey;
    function apply() {
        if (utils.isNode()) {
            return;
        }
        var supportsWebSocket = typeof WebSocket !== 'undefined';
        if (canPatchViaPropertyDescriptor()) {
            // for browsers that we can patch the descriptor:  Chrome & Firefox
            if (!utils.isWebWorker()) {
                var onEventNames = eventNames.map(function (property) {
                    return 'on' + property;
                });
                utils.patchProperties(HTMLElement.prototype, onEventNames);
            }
            utils.patchProperties(XMLHttpRequest.prototype);
            if (supportsWebSocket) {
                utils.patchProperties(WebSocket.prototype);
            }
        }
        else {
            // Safari, Android browsers (Jelly Bean)
            if (!utils.isWebWorker()) {
                patchViaCapturingAllTheEvents();
            }
            utils.patchClass('XMLHttpRequest');
            if (supportsWebSocket) {
                webSocketPatch.apply();
            }
        }
    }
    exports_1("apply", apply);
    function canPatchViaPropertyDescriptor() {
        if (!utils.isWebWorker() && !Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick')
            && typeof Element !== 'undefined') {
            // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
            // IDL interface attributes are not configurable
            var desc = Object.getOwnPropertyDescriptor(Element.prototype, 'onclick');
            if (desc && !desc.configurable)
                return false;
        }
        Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {});
        return result;
    }
    // Whenever any event fires, we check the event target and all parents
    // for `onwhatever` properties and replace them with zone-bound functions
    // - Chrome (for now)
    function patchViaCapturingAllTheEvents() {
        eventNames.forEach(function (property) {
            var onproperty = 'on' + property;
            document.addEventListener(property, function (event) {
                var elt = event.target, bound;
                while (elt) {
                    if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                        bound = global.zone.bind(elt[onproperty]);
                        bound[unboundKey] = elt[onproperty];
                        elt[onproperty] = bound;
                    }
                    elt = elt.parentElement;
                }
            }, true);
        });
    }
    return {
        setters:[
            function (webSocketPatch_1) {
                webSocketPatch = webSocketPatch_1;
            },
            function (utils_1) {
                utils = utils_1;
            },
            function (keys_1) {
                keys = keys_1;
            }],
        execute: function() {
            eventNames = 'copy cut paste abort blur focus canplay canplaythrough change click contextmenu dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart message mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup pause play playing progress ratechange reset scroll seeked seeking select show stalled submit suspend timeupdate volumechange waiting mozfullscreenchange mozfullscreenerror mozpointerlockchange mozpointerlockerror error webglcontextrestored webglcontextlost webglcontextcreationerror'.split(' ');
            ;
            unboundKey = keys.create('unbound');
            ;
        }
    }
});
//# sourceMappingURL=property-descriptor.js.map