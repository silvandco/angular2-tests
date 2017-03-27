System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var VoterComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            VoterComponent = (function () {
                function VoterComponent() {
                    this.votesCount = 10;
                    this.myVote = 0;
                    this.vote = new core_1.EventEmitter();
                    this.release = new core_1.EventEmitter();
                    this.maxVotes = 11;
                    this.minVotes = 9;
                }
                VoterComponent.prototype.onAddClick = function () {
                    if (this.votesCount < this.maxVotes) {
                        this.votesCount++;
                        this.myVote = 1;
                        this.vote.emit({ myVote: this.myVote });
                    }
                };
                VoterComponent.prototype.onDelClick = function () {
                    if (this.votesCount > this.minVotes) {
                        this.votesCount--;
                        this.myVote = -1;
                        this.vote.emit({ myVote: this.myVote });
                    }
                };
                VoterComponent.prototype.onRelease = function () {
                    this.release.emit({ myVote: this.myVote });
                    this.myVote = 0;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], VoterComponent.prototype, "votesCount", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], VoterComponent.prototype, "myVote", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], VoterComponent.prototype, "vote", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], VoterComponent.prototype, "release", void 0);
                VoterComponent = __decorate([
                    core_1.Component({
                        selector: 'voter',
                        template: "\n    <i class=\"glyphicon\" [class.glyphicon-menu-up]= true\n        [class.highlighted]=\"myVote == 1\"\n        (click)=\"onAddClick()\" (mouseleave)=\"onRelease()\"></i>\n        <br>\n    <span>{{votesCount}}</span>\n    <br>\n    <i class=\"glyphicon\" [class.glyphicon-menu-down] = true\n        [class.highlighted]=\"myVote == -1\"\n        (click)=\"onDelClick()\" (mouseleave)=\"onRelease()\"></i>   \n    ",
                        styles: ["\n        .glyphicon-menu-up   {\n            color: #ccc;\n            cursor: pointer;\n            font-size: 30px;\n            text-align:center;\n\n        }\n        \n        .glyphicon-menu-down   {\n            color: #ccc;\n            cursor: pointer;\n            font-size: 30px;\n            text-align:center;\n\n        }\n\n        .highlighted {\n            color: orange;\n        }   \n    "]
                    }), 
                    __metadata('design:paramtypes', [])
                ], VoterComponent);
                return VoterComponent;
            }());
            exports_1("VoterComponent", VoterComponent);
        }
    }
});
//# sourceMappingURL=voter.component.js.map