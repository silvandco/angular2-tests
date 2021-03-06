System.register(['angular2/core', 'angular2/bootstrap', 'angular2/router'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, bootstrap_1, router_1;
    var MyCmp, AppCmp;
    function main() {
        return bootstrap_1.bootstrap(AppCmp, [core_1.provide(router_1.APP_BASE_HREF, { useValue: '/angular2/examples/router/ts/on_activate' })]);
    }
    exports_1("main", main);
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (bootstrap_1_1) {
                bootstrap_1 = bootstrap_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            // #docregion routerOnActivate
            MyCmp = (function () {
                function MyCmp() {
                    this.log = '';
                }
                MyCmp.prototype.routerOnActivate = function (next, prev) {
                    this.log = "Finished navigating from \"" + (prev ? prev.urlPath : 'null') + "\" to \"" + next.urlPath + "\"";
                };
                MyCmp = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "<div>routerOnActivate: {{log}}</div>" }), 
                    __metadata('design:paramtypes', [])
                ], MyCmp);
                return MyCmp;
            }());
            // #enddocregion
            AppCmp = (function () {
                function AppCmp() {
                }
                AppCmp = __decorate([
                    core_1.Component({
                        selector: 'example-app',
                        template: "\n    <h1>My App</h1>\n    <nav>\n      <a [routerLink]=\"['/HomeCmp']\" id=\"home-link\">Navigate Home</a> |\n      <a [routerLink]=\"['/ParamCmp', {param: 1}]\" id=\"param-link\">Navigate with a Param</a>\n    </nav>\n    <router-outlet></router-outlet>\n  ",
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }),
                    router_1.RouteConfig([
                        { path: '/', component: MyCmp, name: 'HomeCmp' },
                        { path: '/:param', component: MyCmp, name: 'ParamCmp' }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppCmp);
                return AppCmp;
            }());
        }
    }
});
//# sourceMappingURL=on_activate_example.js.map