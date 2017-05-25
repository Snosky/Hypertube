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
var router_1 = require("@angular/router");
var social_auth_service_1 = require("../social-auth.service");
require("rxjs/add/operator/switchMap");
var flash_service_1 = require("../flash.service");
var SocialAuthComponent = (function () {
    function SocialAuthComponent(socialAuthService, router, route, flash) {
        this.socialAuthService = socialAuthService;
        this.router = router;
        this.route = route;
        this.flash = flash;
        this.loading = false;
    }
    SocialAuthComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        var provider = this.route.snapshot.params['provider'];
        if (provider) {
            this.loading = true;
            this.socialAuthService.login(provider, this.route.snapshot.queryParams)
                .then(function (success) {
                if (success === true) {
                    _this.loading = false;
                    _this.flash.success('You are now logged in.', true);
                    _this.router.navigate([_this.returnUrl]);
                }
                else {
                    _this.loading = false;
                    _this.flash.error('An error occurred. Please retry.');
                }
            })
                .catch(function (error) {
                _this.loading = false;
                _this.flash.error('An error occurred. Please retry.');
            });
        }
    };
    SocialAuthComponent.prototype.facebookLogin = function () {
        this.loading = true;
        window.location.href = 'https://www.facebook.com/v2.9/dialog/oauth?client_id=1006427196157157&scope=email&redirect_uri=http://localhost:3001/auth/facebook';
    };
    SocialAuthComponent.prototype.login42 = function () {
        this.loading = true;
        window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=b891f269ed7d8f5bca65afaccb26aeffe83e885d8fe173a2c4fd51668daee2fb&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2F42&response_type=code';
    };
    return SocialAuthComponent;
}());
SocialAuthComponent = __decorate([
    core_1.Component({
        selector: 'app-social-auth',
        templateUrl: './social-auth.component.html',
        styleUrls: ['./social-auth.component.css']
    }),
    __metadata("design:paramtypes", [social_auth_service_1.SocialAuthService,
        router_1.Router,
        router_1.ActivatedRoute,
        flash_service_1.FlashService])
], SocialAuthComponent);
exports.SocialAuthComponent = SocialAuthComponent;
//# sourceMappingURL=social-auth.component.js.map