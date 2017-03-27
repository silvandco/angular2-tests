!function(e){function r(n){if(t[n])return t[n].exports;var o=t[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var t={};return r.m=e,r.c=t,r.p="",r(0)}([function(module,exports){"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function Inject(){for(var e=arguments.length,r=Array(e),t=0;t<e;t++)r[t]=arguments[t];return function(e,t,n){if(n){var o=n.value;o.$inject=r||[]}else e.$inject=r||[]}}function Module(e){var r=arguments.length<=1||void 0===arguments[1]?[]:arguments[1];return function(t){var n,o=null;try{o=angular.module(e)}catch(a){o=angular.module(e,r)}return(n=o.requires).push.apply(n,_toConsumableArray(r)),o}}function Config(){var e=arguments.length<=0||void 0===arguments[0]?"app":arguments[0];return function(r,t,n){n.value.$inject=n.value.$inject||[],Module(e)(r).config(n.value)}}function Run(){var e=arguments.length<=0||void 0===arguments[0]?"app":arguments[0];return function(r,t,n){n.value.$inject=n.value.$inject||[],Module(e)(r).run(n.value)}}function Service(){var e=arguments.length<=0||void 0===arguments[0]?"app":arguments[0];return function(r){r.$inject=r.$inject||[],Module(e)(r).service(r.name,r)}}function Controller(){var e=arguments.length<=0||void 0===arguments[0]?"app":arguments[0];return function(r){r.$inject=r.$inject||[],Module(e)(r).controller(r.name,r)}}function Factory(){var e=arguments.length<=0||void 0===arguments[0]?"app":arguments[0];return function(r,t,n){n.value.$inject=n.value.$inject||[],Module(e)(r).factory(r.name,n.value)}}function Directive(selector){var moduleName=arguments.length<=1||void 0===arguments[1]?"app":arguments[1];return function(target,key,descriptor){if(!selector)throw new Error("@Directive() must contain selector property");var directiveName=selector.replace(/-([a-z])/gi,function(e,r){return r.toUpperCase()}),params=target.toString().match(/function\s+[a-z0-9_]+\((.*?)\)/i)[1];Module(moduleName)(target).directive(directiveName,[].concat(_toConsumableArray(target.$inject),[eval("("+params+") => new target("+params+");")]))}}function bootstrap(e){return new Promise(function(r){angular.element(document).ready(function(){r(e)})})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Inject=Inject,exports.Module=Module,exports.Config=Config,exports.Run=Run,exports.Service=Service,exports.Controller=Controller,exports.Factory=Factory,exports.Directive=Directive,exports.bootstrap=bootstrap}]);