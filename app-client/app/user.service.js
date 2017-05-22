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
var app_config_1 = require("./app.config");
var http_1 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
require("rxjs/add/operator/toPromise");
var auth_service_1 = require("./auth.service");
var UserService = (function () {
    function UserService(config, authHttp, authService) {
        this.config = config;
        this.authHttp = authHttp;
        this.authService = authService;
    }
    UserService.prototype.update = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            formData.append('username', user.username);
            formData.append('email', user.email);
            formData.append('firstname', user.firstname);
            formData.append('lastname', user.lastname);
            if (user.password)
                formData.append('password', user.password);
            if (user.passwordConf)
                formData.append('passwordConf', user.passwordConf);
            if (user.pic)
                formData.append('pic', user.pic);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(JSON.parse(xhr.response).errors);
                    }
                }
            };
            xhr.open('POST', _this.config.apiUrl + '/user/update', true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + _this.authService.getToken());
            xhr.send(formData);
        });
    };
    UserService.prototype.me = function () {
        return this.authHttp.get(this.config.apiUrl + '/user/me')
            .toPromise()
            .then(function (response) {
            return response.json();
        })
            .catch(this.handleError);
    };
    UserService.prototype.handleError = function (error) {
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
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [app_config_1.AppConfig,
        angular2_jwt_1.AuthHttp,
        auth_service_1.AuthService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map