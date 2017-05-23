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
var platform_browser_1 = require("@angular/platform-browser");
var movie_service_1 = require("../movie.service");
var movie_torrent_service_1 = require("../movie-torrent.service");
var omdb_service_1 = require("../omdb.service");
var angular2_jwt_1 = require("angular2-jwt");
var MovieComponent = (function () {
    function MovieComponent(route, sanitizer, movieService, omdbService, movieTorrentService, authHttp) {
        this.route = route;
        this.sanitizer = sanitizer;
        this.movieService = movieService;
        this.omdbService = omdbService;
        this.movieTorrentService = movieTorrentService;
        this.authHttp = authHttp;
        this.info = {};
    }
    MovieComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.slug = this.route.snapshot.params['slug'];
        this.movieService.getOne(this.slug)
            .then(function (movie) {
            _this.movie = movie;
            _this.omdbService.getMoreInfo(movie.imdb_code)
                .then(function (info) { return _this.info = info; });
        });
    };
    MovieComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.movieTorrentService.getMovieTorrents(this.slug)
            .then(function (torrents) { return _this.torrents = torrents; });
    };
    MovieComponent.prototype.youtubeTrailer = function () {
        return this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/' + this.movie.yt_trailer_code + '?rel=0');
    };
    MovieComponent.prototype.launchStream = function () {
        this.stream = 'http://localhost:3000/movie/watch/' + this.torrent;
    };
    MovieComponent.prototype.closeVideo = function () {
        this.stream = null;
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
        platform_browser_1.DomSanitizer,
        movie_service_1.MovieService,
        omdb_service_1.OmdbService,
        movie_torrent_service_1.MovieTorrentService,
        angular2_jwt_1.AuthHttp])
], MovieComponent);
exports.MovieComponent = MovieComponent;
//# sourceMappingURL=movie.component.js.map