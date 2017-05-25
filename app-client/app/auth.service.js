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
var rxjs_1 = require("rxjs");
var AuthService = (function () {
    function AuthService(config, http) {
        this.config = config;
        this.http = http;
        this.refresh = new rxjs_1.Subject();
    }
    AuthService.prototype.saveToken = function (token) {
        localStorage.setItem('meanToken', token);
        this.refresh.next('update');
    };
    AuthService.prototype.getToken = function () {
        return localStorage.getItem('meanToken');
    };
    AuthService.prototype.currentUser = function () {
        //return this.logout();
        var token = this.getToken();
        if (!token) {
            console.log('pas token');
            this.logout();
            return null;
        }
        var payload;
        payload = token.split('.')[1];
        try {
            payload = atob(payload);
        }
        catch (err) {
            console.log('Atob failed', err);
            this.logout();
            return null;
        }
        payload = JSON.parse(payload);
        var user = new user_1.User();
        user.username = payload.username;
        user.email = payload.email;
        user.lastname = payload.lastname;
        user.firstname = payload.firstname;
        user._id = payload._id;
        user.lang = payload.lang;
        user.pic = payload.pic;
        return user;
    };
    AuthService.prototype.isLoggedIn = function () {
        return angular2_jwt_1.tokenNotExpired('meanToken');
    };
    AuthService.prototype.register = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            formData.append('username', user.username);
            formData.append('email', user.email);
            formData.append('password', user.password);
            formData.append('passwordConf', user.passwordConf);
            formData.append('lastname', user.lastname);
            formData.append('firstname', user.firstname);
            formData.append('pic', user.pic, user.pic.name);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.response);
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', _this.config.apiUrl + '/register', true);
            xhr.send(formData);
        })
            .then(function (response) {
            return JSON.parse(response);
        })
            .catch(this.handleError);
        /*return this.http.post(this.config.apiUrl + '/register', user)
            .toPromise()*/
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
            err = JSON.parse(error).errors;
            //err = error.message ? error.message : error.toString();
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
//# sourceMappingURL=auth.service.js.map