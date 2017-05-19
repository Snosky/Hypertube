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
var yts_service_1 = require("../yts.service");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var MovieComponent = (function () {
    function MovieComponent(route, ytsService, sanitizer) {
        this.route = route;
        this.ytsService = ytsService;
        this.sanitizer = sanitizer;
    }
    MovieComponent.prototype.ngOnInit = function () {
        var _this = this;
        var id = this.route.snapshot.params['id'];
        this.ytsService.getOne(id)
            .then(function (movie) { return _this.movie = movie; });
    };
    MovieComponent.prototype.youtubeTrailer = function () {
        return this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/' + this.movie.yt_trailer_code + '?rel=0');
    };
    return MovieComponent;
}());
MovieComponent = __decorate([
    core_1.Component({
        selector: 'app-movie',
        templateUrl: './movie.component.html',
        styleUrls: ['./movie.component.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        yts_service_1.YtsService,
        platform_browser_1.DomSanitizer])
], MovieComponent);
exports.MovieComponent = MovieComponent;
//# sourceMappingURL=movie.component.js.map