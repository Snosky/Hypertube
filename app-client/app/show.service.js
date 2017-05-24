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
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
var ShowService = (function () {
    function ShowService(config, authHttp) {
        this.config = config;
        this.authHttp = authHttp;
    }
    ShowService.prototype.search = function (params) {
        var httpparams = new http_1.URLSearchParams();
        httpparams.set('limit', '36');
        if (params.page)
            httpparams.set('page', params.page.toString());
        if (params.query_term)
            httpparams.set('query_term', params.query_term);
        if (params.genres && params.genres != 'all')
            httpparams.set('genres', params.genres);
        if (params.years)
            httpparams.set('years', params.years);
        if (params.rating)
            httpparams.set('rating', params.rating);
        if (params.order && params.order !== 'default')
            httpparams.set('order', params.order);
        return this.authHttp.get(this.config.apiUrl + '/shows', { search: httpparams })
            .map(function (res) { return res.json(); });
    };
    ShowService.prototype.getOne = function (slug) {
        return this.authHttp.get(this.config.apiUrl + '/show/' + slug)
            .toPromise()
            .then(function (movie) { return movie.json(); });
    };
    ShowService.prototype.yearsRange = function () {
        return this.authHttp.get(this.config.apiUrl + '/shows/years')
            .toPromise()
            .then(function (range) { return range.json(); });
    };
    ShowService.prototype.getEpisodes = function (slug) {
        return this.authHttp.get(this.config.apiUrl + '/show/' + slug + '/episodes')
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    ShowService.prototype.getEpisodesObs = function (slug) {
        return this.authHttp.get(this.config.apiUrl + '/show/' + slug + '/episodes')
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ShowService.prototype.updateViewTime = function (show_id) {
        return this.authHttp.get(this.config.apiUrl + '/show/' + show_id + '/seen')
            .toPromise();
    };
    ShowService.prototype.handleError = function (error) {
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
        return Observable_1.Observable.throw(errMsg);
    };
    return ShowService;
}());
ShowService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [app_config_1.AppConfig,
        angular2_jwt_1.AuthHttp])
], ShowService);
exports.ShowService = ShowService;
//# sourceMappingURL=show.service.js.map