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
var user_1 = require("./_models/user");
var http_1 = require("@angular/http");
var app_config_1 = require("./app.config");
var angular2_jwt_1 = require("angular2-jwt");
require("rxjs/add/operator/toPromise");
var AuthService = (function () {
    function AuthService(config, http) {
        this.config = config;
        this.http = http;
    }
    AuthService.prototype.saveToken = function (token) {
        localStorage.setItem('meanToken', token);
    };
    AuthService.prototype.getToken = function () {
        return localStorage.getItem('meanToken');
    };
    AuthService.prototype.currentUser = function () {
        var token = this.getToken();
        var payload;
        payload = token.split('.')[1];
        payload = atob(payload);
        payload = JSON.parse(payload);
        var user = new user_1.User();
        user.username = payload.username;
        user.email = payload.email;
        return user;
    };
    AuthService.prototype.isLoggedIn = function () {
        return angular2_jwt_1.tokenNotExpired('meanToken');
    };
    AuthService.prototype.register = function (user) {
        return this.http.post(this.config.apiUrl + '/register', user)
            .toPromise()
            .then(function (response) {
            return response.json();
        })
            .catch(this.handleError);
    };
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return this.http.post(this.config.apiUrl + '/auth', { username: username, password: password })
            .toPromise()
            .then(function (response) {
            var res = response.json();
            if (res && res.token) {
                _this.saveToken(res.token);
                return true;
            }
            return false;
        })
            .catch(this.handleError);
    };
    AuthService.prototype.logout = function () {
        localStorage.removeItem('meanToken');
    };
    AuthService.prototype.handleError = function (error) {
        var err;
        if (error instanceof http_1.Response) {
            var body = error.json();
            err = body.errors || JSON.stringify(body);
        }
        else {
            err = error.message ? error.message : error.toString();
        }
        return Promise.reject(err);
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [app_config_1.AppConfig,
        http_1.Http])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=authsdad.service.js.map