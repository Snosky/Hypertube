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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var app_config_1 = require("./app.config");
var auth_service_1 = require("./auth.service");
var SocialAuthService = (function () {
    function SocialAuthService(config, http, authService) {
        this.config = config;
        this.http = http;
        this.authService = authService;
    }
    SocialAuthService.prototype.login = function (provider, params) {
        switch (provider) {
            case 'facebook':
                return this.facebook(params.code);
            case '42':
                return this.fortytwo(params.code);
        }
    };
    SocialAuthService.prototype.facebook = function (code) {
        var _this = this;
        return this.http.post(this.config.apiUrl + '/auth/facebook', { code: code })
            .toPromise()
            .then(function (response) {
            var res = response.json();
            if (res && res.token) {
                _this.authService.saveToken(res.token);
                return true;
            }
            return false;
        })
            .catch(function (error) {
            return false;
        });
    };
    SocialAuthService.prototype.fortytwo = function (code) {
        var _this = this;
        return this.http.post(this.config.apiUrl + '/auth/42', { code: code })
            .toPromise()
            .then(function (response) {
            var res = response.json();
            if (res && res.token) {
                _this.authService.saveToken(res.token);
                return true;
            }
            return false;
        })
            .catch(function (error) {
        });
    };
    return SocialAuthService;
}());
SocialAuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [app_config_1.AppConfig,
        http_1.Http,
        auth_service_1.AuthService])
], SocialAuthService);
exports.SocialAuthService = SocialAuthService;
//# sourceMappingURL=social-auth.service.js.map