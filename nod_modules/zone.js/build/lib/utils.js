var keys = require('./keys');
function bindArguments(args) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = global.zone.bind(args[i]);
        }
    }
    return args;
}
exports.bindArguments = bindArguments;
;
function patchPrototype(obj, fnNames) {
    fnNames.forEach(function (name) {
        var delegate = obj[name];
        if (delegate) {
            obj[name] = function () {
                return delegate.apply(this, bindArguments(arguments));
            };
        }
    });
}
exports.patchPrototype = patchPrototype;
;
function isWebWorker() {
    return (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
}
exports.isWebWorker = isWebWorker;
function isNode() {
    return (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]');
}
exports.isNode = isNode;
function patchProperty(obj, prop) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop) || {
        enumerable: true,
        configurable: true
    };
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var _prop = '_' + prop;
    desc.set = function (fn) {
        if (this[_prop]) {
            this.removeEventListener(eventName, this[_prop]);
        }
        if (typeof fn === 'function') {
            this[_prop] = fn;
            this.addEventListener(eventName, fn, false);
        }
        else {
            this[_prop] = null;
        }
    };
    desc.get = function () {
        return this[_prop];
    };
    Object.defineProperty(obj, prop, desc);
}
exports.patchProperty = patchProperty;
;
function patchProperties(obj, properties) {
    (properties || (function () {
        var props = [];
        for (var prop in obj) {
            props.push(prop);
        }
        return props;
    }()).
        filter(function (propertyName) {
        return propertyName.substr(0, 2) === 'on';
    })).
        forEach(function (eventName) {
        patchProperty(obj, eventName);
    });
}
exports.patchProperties = patchProperties;
;
var originalFnKey = keys.create('originalFn');
var boundFnsKey = keys.create('boundFns');
function patchEventTargetMethods(obj) {
    // This is required for the addEventListener hook on the root zone.
    obj[keys.common.addEventListener] = obj.addEventListener;
    obj.addEventListener = function (eventName, handler, useCapturing) {
        //Ignore special listeners of IE11 & Edge dev tools, see https://github.com/angular/zone.js/issues/150
        if (handler && handler.toString() !== "[object FunctionWrapper]") {
            var eventType = eventName + (useCapturing ? '$capturing' : '$bubbling');
            var fn;
            if (handler.handleEvent) {
                // Have to pass in 'handler' reference as an argument here, otherwise it gets clobbered in
                // IE9 by the arguments[1] assignment at end of this function.
                fn = (function (handler) {
                    return function () {
                        handler.handleEvent.apply(handler, arguments);
                    };
                })(handler);
            }
            else {
                fn = handler;
            }
            handler[originalFnKey] = fn;
            handler[boundFnsKey] = handler[boundFnsKey] || {};
            handler[boundFnsKey][eventType] = handler[boundFnsKey][eventType] || global.zone.bind(fn);
            arguments[1] = handler[boundFnsKey][eventType];
        }
        // - Inside a Web Worker, `this` is undefined, the context is `global` (= `self`)
        // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
        // see https://github.com/angular/zone.js/issues/190
        var target = this || global;
        return global.zone.addEventListener.apply(target, arguments);
    };
    // This is required for the removeEventListener hook on the root zone.
    obj[keys.common.removeEventListener] = obj.removeEventListener;
    obj.removeEventListener = function (eventName, handler, useCapturing) {
        var eventType = eventName + (useCapturing ? '$capturing' : '$bubbling');
        if (handler && handler[boundFnsKey] && handler[boundFnsKey][eventType]) {
            var _bound = handler[boundFnsKey];
            arguments[1] = _bound[eventType];
            delete _bound[eventType];
            global.zone.dequeueTask(handler[originalFnKey]);
        }
        // - Inside a Web Worker, `this` is undefined, the context is `global`
        // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
        // see https://github.com/angular/zone.js/issues/190
        var target = this || global;
        var result = global.zone.removeEventListener.apply(target, arguments);
        return result;
    };
}
exports.patchEventTargetMethods = patchEventTargetMethods;
;
var originalInstanceKey = keys.create('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = global[className];
    if (!OriginalClass)
        return;
    global[className] = function () {
        var a = bindArguments(arguments);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default: throw new Error('what are you even doing?');
        }
    };
    var instance = new OriginalClass();
    var prop;
    for (prop in instance) {
        (function (prop) {
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
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            global[className][prop] = OriginalClass[prop];
        }
    }
}
exports.patchClass = patchClass;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMudHMiXSwibmFtZXMiOlsiYmluZEFyZ3VtZW50cyIsInBhdGNoUHJvdG90eXBlIiwiaXNXZWJXb3JrZXIiLCJpc05vZGUiLCJwYXRjaFByb3BlcnR5IiwicGF0Y2hQcm9wZXJ0aWVzIiwicGF0Y2hFdmVudFRhcmdldE1ldGhvZHMiLCJwYXRjaENsYXNzIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFZLElBQUksV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUkvQix1QkFBOEIsSUFBSTtJQUNoQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7UUFDMUNBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN0Q0EsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7QUFDZEEsQ0FBQ0E7QUFQZSxxQkFBYSxnQkFPNUIsQ0FBQTtBQUFBLENBQUM7QUFFRix3QkFBK0IsR0FBRyxFQUFFLE9BQU87SUFDekNDLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLElBQUlBO1FBQzVCLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2IsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHO2dC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QUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxXQUFXQSxJQUFJQSxhQUFhQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvREEsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDaERBLENBQUNBO0lBQ0hBLENBQUNBO0FBQ0hBLENBQUNBO0FBL0NlLGtCQUFVLGFBK0N6QixDQUFBO0FBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGtleXMgZnJvbSAnLi9rZXlzJztcbi8vIEhhY2sgc2luY2UgVHlwZVNjcmlwdCBpc24ndCBjb21waWxpbmcgdGhpcyBmb3IgYSB3b3JrZXIuXG5kZWNsYXJlIHZhciBXb3JrZXJHbG9iYWxTY29wZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRBcmd1bWVudHMoYXJncykge1xuICBmb3IgKHZhciBpID0gYXJncy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmICh0eXBlb2YgYXJnc1tpXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJnc1tpXSA9IGdsb2JhbC56b25lLmJpbmQoYXJnc1tpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcmdzO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoUHJvdG90eXBlKG9iaiwgZm5OYW1lcykge1xuICBmbk5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGVsZWdhdGUgPSBvYmpbbmFtZV07XG4gICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICBvYmpbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseSh0aGlzLCBiaW5kQXJndW1lbnRzKGFyZ3VtZW50cykpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2ViV29ya2VyKCkge1xuICByZXR1cm4gKHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZSgpIHtcbiAgcmV0dXJuICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApIHx8IHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9O1xuXG4gIC8vIEEgcHJvcGVydHkgZGVzY3JpcHRvciBjYW5ub3QgaGF2ZSBnZXR0ZXIvc2V0dGVyIGFuZCBiZSB3cml0YWJsZVxuICAvLyBkZWxldGluZyB0aGUgd3JpdGFibGUgYW5kIHZhbHVlIHByb3BlcnRpZXMgYXZvaWRzIHRoaXMgZXJyb3I6XG4gIC8vXG4gIC8vIFR5cGVFcnJvcjogcHJvcGVydHkgZGVzY3JpcHRvcnMgbXVzdCBub3Qgc3BlY2lmeSBhIHZhbHVlIG9yIGJlIHdyaXRhYmxlIHdoZW4gYVxuICAvLyBnZXR0ZXIgb3Igc2V0dGVyIGhhcyBiZWVuIHNwZWNpZmllZFxuICBkZWxldGUgZGVzYy53cml0YWJsZTtcbiAgZGVsZXRlIGRlc2MudmFsdWU7XG5cbiAgLy8gc3Vic3RyKDIpIGN1eiAnb25jbGljaycgLT4gJ2NsaWNrJywgZXRjXG4gIHZhciBldmVudE5hbWUgPSBwcm9wLnN1YnN0cigyKTtcbiAgdmFyIF9wcm9wID0gJ18nICsgcHJvcDtcblxuICBkZXNjLnNldCA9IGZ1bmN0aW9uIChmbikge1xuICAgIGlmICh0aGlzW19wcm9wXSkge1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpc1tfcHJvcF0pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXNbX3Byb3BdID0gZm47XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmbiwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzW19wcm9wXSA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIGRlc2MuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzW19wcm9wXTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaFByb3BlcnRpZXMob2JqLCBwcm9wZXJ0aWVzPykge1xuICAocHJvcGVydGllcyB8fCAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHByb3BzID0gW107XG4gICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICBwcm9wcy5wdXNoKHByb3ApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH0oKSkuXG4gICAgZmlsdGVyKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWUuc3Vic3RyKDAsMikgPT09ICdvbic7XG4gICAgfSkpLlxuICAgIGZvckVhY2goZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgcGF0Y2hQcm9wZXJ0eShvYmosIGV2ZW50TmFtZSk7XG4gICAgfSk7XG59O1xuXG52YXIgb3JpZ2luYWxGbktleSA9IGtleXMuY3JlYXRlKCdvcmlnaW5hbEZuJyk7XG52YXIgYm91bmRGbnNLZXkgPSBrZXlzLmNyZWF0ZSgnYm91bmRGbnMnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoRXZlbnRUYXJnZXRNZXRob2RzKG9iaikge1xuICAvLyBUaGlzIGlzIHJlcXVpcmVkIGZvciB0aGUgYWRkRXZlbnRMaXN0ZW5lciBob29rIG9uIHRoZSByb290IHpvbmUuXG4gIG9ialtrZXlzLmNvbW1vbi5hZGRFdmVudExpc3RlbmVyXSA9IG9iai5hZGRFdmVudExpc3RlbmVyO1xuICBvYmouYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGhhbmRsZXIsIHVzZUNhcHR1cmluZykge1xuICAgIC8vSWdub3JlIHNwZWNpYWwgbGlzdGVuZXJzIG9mIElFMTEgJiBFZGdlIGRldiB0b29scywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzE1MFxuICAgIGlmIChoYW5kbGVyICYmIGhhbmRsZXIudG9TdHJpbmcoKSAhPT0gXCJbb2JqZWN0IEZ1bmN0aW9uV3JhcHBlcl1cIikge1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IGV2ZW50TmFtZSArICh1c2VDYXB0dXJpbmcgPyAnJGNhcHR1cmluZycgOiAnJGJ1YmJsaW5nJyk7XG4gICAgICB2YXIgZm47XG4gICAgICBpZiAoaGFuZGxlci5oYW5kbGVFdmVudCkge1xuICAgICAgICAvLyBIYXZlIHRvIHBhc3MgaW4gJ2hhbmRsZXInIHJlZmVyZW5jZSBhcyBhbiBhcmd1bWVudCBoZXJlLCBvdGhlcndpc2UgaXQgZ2V0cyBjbG9iYmVyZWQgaW5cbiAgICAgICAgLy8gSUU5IGJ5IHRoZSBhcmd1bWVudHNbMV0gYXNzaWdubWVudCBhdCBlbmQgb2YgdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgZm4gPSAoZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlRXZlbnQuYXBwbHkoaGFuZGxlciwgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KShoYW5kbGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZuID0gaGFuZGxlcjtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlcltvcmlnaW5hbEZuS2V5XSA9IGZuO1xuICAgICAgaGFuZGxlcltib3VuZEZuc0tleV0gPSBoYW5kbGVyW2JvdW5kRm5zS2V5XSB8fCB7fTtcbiAgICAgIGhhbmRsZXJbYm91bmRGbnNLZXldW2V2ZW50VHlwZV0gPSBoYW5kbGVyW2JvdW5kRm5zS2V5XVtldmVudFR5cGVdIHx8IGdsb2JhbC56b25lLmJpbmQoZm4pO1xuICAgICAgYXJndW1lbnRzWzFdID0gaGFuZGxlcltib3VuZEZuc0tleV1bZXZlbnRUeXBlXTtcbiAgICB9XG5cbiAgICAvLyAtIEluc2lkZSBhIFdlYiBXb3JrZXIsIGB0aGlzYCBpcyB1bmRlZmluZWQsIHRoZSBjb250ZXh0IGlzIGBnbG9iYWxgICg9IGBzZWxmYClcbiAgICAvLyAtIFdoZW4gYGFkZEV2ZW50TGlzdGVuZXJgIGlzIGNhbGxlZCBvbiB0aGUgZ2xvYmFsIGNvbnRleHQgaW4gc3RyaWN0IG1vZGUsIGB0aGlzYCBpcyB1bmRlZmluZWRcbiAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvMTkwXG4gICAgdmFyIHRhcmdldCA9IHRoaXMgfHwgZ2xvYmFsO1xuICAgIHJldHVybiBnbG9iYWwuem9uZS5hZGRFdmVudExpc3RlbmVyLmFwcGx5KHRhcmdldCwgYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBUaGlzIGlzIHJlcXVpcmVkIGZvciB0aGUgcmVtb3ZlRXZlbnRMaXN0ZW5lciBob29rIG9uIHRoZSByb290IHpvbmUuXG4gIG9ialtrZXlzLmNvbW1vbi5yZW1vdmVFdmVudExpc3RlbmVyXSA9IG9iai5yZW1vdmVFdmVudExpc3RlbmVyO1xuICBvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGhhbmRsZXIsIHVzZUNhcHR1cmluZykge1xuICAgIHZhciBldmVudFR5cGUgPSBldmVudE5hbWUgKyAodXNlQ2FwdHVyaW5nID8gJyRjYXB0dXJpbmcnIDogJyRidWJibGluZycpO1xuICAgIGlmIChoYW5kbGVyICYmIGhhbmRsZXJbYm91bmRGbnNLZXldICYmIGhhbmRsZXJbYm91bmRGbnNLZXldW2V2ZW50VHlwZV0pIHtcbiAgICAgIHZhciBfYm91bmQgPSBoYW5kbGVyW2JvdW5kRm5zS2V5XTtcbiAgICAgIGFyZ3VtZW50c1sxXSA9IF9ib3VuZFtldmVudFR5cGVdO1xuICAgICAgZGVsZXRlIF9ib3VuZFtldmVudFR5cGVdO1xuICAgICAgZ2xvYmFsLnpvbmUuZGVxdWV1ZVRhc2soaGFuZGxlcltvcmlnaW5hbEZuS2V5XSk7XG4gICAgfVxuXG4gICAgLy8gLSBJbnNpZGUgYSBXZWIgV29ya2VyLCBgdGhpc2AgaXMgdW5kZWZpbmVkLCB0aGUgY29udGV4dCBpcyBgZ2xvYmFsYFxuICAgIC8vIC0gV2hlbiBgYWRkRXZlbnRMaXN0ZW5lcmAgaXMgY2FsbGVkIG9uIHRoZSBnbG9iYWwgY29udGV4dCBpbiBzdHJpY3QgbW9kZSwgYHRoaXNgIGlzIHVuZGVmaW5lZFxuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy8xOTBcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcyB8fCBnbG9iYWw7XG4gICAgdmFyIHJlc3VsdCA9IGdsb2JhbC56b25lLnJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkodGFyZ2V0LCBhcmd1bWVudHMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuXG52YXIgb3JpZ2luYWxJbnN0YW5jZUtleSA9IGtleXMuY3JlYXRlKCdvcmlnaW5hbEluc3RhbmNlJyk7XG5cbi8vIHdyYXAgc29tZSBuYXRpdmUgQVBJIG9uIGB3aW5kb3dgXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hDbGFzcyhjbGFzc05hbWUpIHtcbiAgdmFyIE9yaWdpbmFsQ2xhc3MgPSBnbG9iYWxbY2xhc3NOYW1lXTtcbiAgaWYgKCFPcmlnaW5hbENsYXNzKSByZXR1cm47XG5cbiAgZ2xvYmFsW2NsYXNzTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGEgPSBiaW5kQXJndW1lbnRzKGFyZ3VtZW50cyk7XG4gICAgc3dpdGNoIChhLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOiB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoKTsgYnJlYWs7XG4gICAgICBjYXNlIDE6IHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdKTsgYnJlYWs7XG4gICAgICBjYXNlIDI6IHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdKTsgYnJlYWs7XG4gICAgICBjYXNlIDM6IHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdLCBhWzJdKTsgYnJlYWs7XG4gICAgICBjYXNlIDQ6IHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdLCBhWzJdLCBhWzNdKTsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ3doYXQgYXJlIHlvdSBldmVuIGRvaW5nPycpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgaW5zdGFuY2UgPSBuZXcgT3JpZ2luYWxDbGFzcygpO1xuXG4gIHZhciBwcm9wO1xuICBmb3IgKHByb3AgaW4gaW5zdGFuY2UpIHtcbiAgICAoZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2VbcHJvcF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZ2xvYmFsW2NsYXNzTmFtZV0ucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdLmFwcGx5KHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0sIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZ2xvYmFsW2NsYXNzTmFtZV0ucHJvdG90eXBlLCBwcm9wLCB7XG4gICAgICAgICAgc2V0OiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXSA9IGdsb2JhbC56b25lLmJpbmQoZm4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXSA9IGZuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0ocHJvcCkpO1xuICB9XG5cbiAgZm9yIChwcm9wIGluIE9yaWdpbmFsQ2xhc3MpIHtcbiAgICBpZiAocHJvcCAhPT0gJ3Byb3RvdHlwZScgJiYgT3JpZ2luYWxDbGFzcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgZ2xvYmFsW2NsYXNzTmFtZV1bcHJvcF0gPSBPcmlnaW5hbENsYXNzW3Byb3BdO1xuICAgIH1cbiAgfVxufTtcbiJdfQ==