"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var flash_service_1 = require("../flash.service");
var FlashComponent = (function () {
    function FlashComponent(flashService) {
        this.flashService = flashService;
    }
    FlashComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.flashService.getMessage().subscribe(function (message) { _this.message = message; });
    };
    return FlashComponent;
}());
FlashComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'app-flash',
        templateUrl: './flash.component.html',
        styleUrls: ['./flash.component.css']
    }),
    __metadata("design:paramtypes", [flash_service_1.FlashService])
], FlashComponent);
exports.FlashComponent = FlashComponent;
//# sourceMappingURL=flash.component.js.map