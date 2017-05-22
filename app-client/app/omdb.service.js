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
var OmdbService = (function () {
    function OmdbService(http) {
        this.http = http;
        this.url = 'http://www.omdbapi.com/?apikey=4b79467b';
    }
    OmdbService.prototype.getMoreInfo = function (imdb_id) {
        return this.http.get(this.url + '&i=' + imdb_id)
            .toPromise()
            .then(function (info) { return info.json(); });
    };
    return OmdbService;
}());
OmdbService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], OmdbService);
exports.OmdbService = OmdbService;
//# sourceMappingURL=omdb.service.js.map