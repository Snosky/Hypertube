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
var angular2_jwt_1 = require("angular2-jwt");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
var http_1 = require("@angular/http");
var CommentService = (function () {
    function CommentService(config, authHttp) {
        this.config = config;
        this.authHttp = authHttp;
    }
    CommentService.prototype.save = function (comment, imdb_code) {
        return this.authHttp.post(this.config.apiUrl + '/comment/add', { comment: comment, imdb_code: imdb_code })
            .map(this.extractData)
            .catch(this.handleError);
    };
    CommentService.prototype.get = function (imdb_code) {
        return this.authHttp.get(this.config.apiUrl + '/comment/get/' + imdb_code)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CommentService.prototype.extractData = function (res) {
        return res.json();
    };
    CommentService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    return CommentService;
}());
CommentService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [app_config_1.AppConfig,
        angular2_jwt_1.AuthHttp])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map