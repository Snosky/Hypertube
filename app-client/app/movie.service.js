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
require("rxjs/add/operator/toPromise");
var angular2_jwt_1 = require("angular2-jwt");
var MovieService = (function () {
    function MovieService(config, authHttp) {
        this.config = config;
        this.authHttp = authHttp;
    }
    MovieService.prototype.search = function (params) {
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
        return this.authHttp.get(this.config.apiUrl + '/movies', { search: httpparams })
            .map(function (res) { return res.json(); });
    };
    MovieService.prototype.getOne = function (slug) {
        return this.authHttp.get(this.config.apiUrl + '/movie/' + slug)
            .toPromise()
            .then(function (movie) { return movie.json(); });
    };
    MovieService.prototype.yearsRange = function () {
        return this.authHttp.get(this.config.apiUrl + '/movies/years')
            .toPromise()
            .then(function (range) { return range.json(); });
    };
    MovieService.prototype.setView = function (slug) {
        return this.authHttp.get(this.config.apiUrl + '/movie/' + slug + '/view')
            .toPromise();
    };
    MovieService.prototype.updateViewTime = function (movie_id) {
        return this.authHttp.get(this.config.apiUrl + '/movie/' + movie_id + '/seen')
            .toPromise();
    };
    return MovieService;
}());
MovieService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [app_config_1.AppConfig,
        angular2_jwt_1.AuthHttp])
], MovieService);
exports.MovieService = MovieService;
//# sourceMappingURL=movie.service.js.map