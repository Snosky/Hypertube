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
var auth_service_1 = require("./auth.service");
var router_1 = require("@angular/router");
var user_service_1 = require("./user.service");
var flash_service_1 = require("./flash.service");
var AppComponent = (function () {
    function AppComponent(authService, userService, router, flash) {
        var _this = this;
        this.authService = authService;
        this.userService = userService;
        this.router = router;
        this.flash = flash;
        this.route = '';
        this.navbar = false;
        router.events.subscribe(function (val) {
            if (authService.isLoggedIn()) {
                _this.currentUser = _this.authService.currentUser();
                _this._refresh = _this.authService.refresh.subscribe(function (refresh) { return _this.currentUser = _this.authService.currentUser(); });
            }
            else
                _this.currentUser = null;
        });
        this.route = router.url;
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.updateLang = function (lang) {
        var _this = this;
        if (['fre', 'eng'].indexOf(lang) === -1)
            return false;
        this.userService.updateLang(lang)
            .subscribe(function (result) {
            _this.currentUser.lang = lang;
            _this.authService.saveToken(result.token);
        }, function (error) { return _this.flash.error(error); });
    };
    AppComponent.prototype.ngOnDestroy = function () {
        if (this.currentUser) {
            this._refresh._unsubscribe();
        }
    };
    AppComponent.prototype.toggleNavBar = function () {
        this.navbar = !this.navbar;
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        router_1.Router,
        flash_service_1.FlashService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map