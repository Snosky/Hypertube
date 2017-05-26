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
var flash_service_1 = require("../flash.service");
var MovieComponent = (function () {
    function MovieComponent(route, router, flash, sanitizer, movieService, omdbService, movieTorrentService) {
        this.route = route;
        this.router = router;
        this.flash = flash;
        this.sanitizer = sanitizer;
        this.movieService = movieService;
        this.omdbService = omdbService;
        this.movieTorrentService = movieTorrentService;
        this.info = {};
        this.openVideo = false;
    }
    MovieComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.slug = this.route.snapshot.params['slug'];
        this.movieService.getOne(this.slug)
            .then(function (movie) {
            _this.movie = movie;
            _this.omdbService.getMoreInfo(movie.imdb_code)
                .then(function (info) { return _this.info = info; });
            _this.movieTorrentService.getMovieTorrents(_this.slug)
                .then(function (torrents) { return _this.torrents = torrents; })
                .catch(function (error) {
                _this.flash.error('No torrents found');
                _this.torrents = [];
            });
        })
            .catch(function (error) {
            if (error.status === 404) {
                _this.flash.error('Movie not found', true);
            }
            else {
                _this.flash.error('An error occurred. Please retry', true);
            }
            _this.router.navigate(['']);
        });
    };
    MovieComponent.prototype.youtubeTrailer = function () {
        return this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/' + this.movie.yt_trailer_code + '?rel=0');
    };
    MovieComponent.prototype.launchStream = function () {
        this.openVideo = true;
        //this.stream = 'http://localhost:3000/movie/watch/' + this.torrent;
    };
    MovieComponent.prototype.closeVideo = function () {
        this.openVideo = false;
        //this.stream = null;
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
        router_1.Router,
        flash_service_1.FlashService,
        platform_browser_1.DomSanitizer,
        movie_service_1.MovieService,
        omdb_service_1.OmdbService,
        movie_torrent_service_1.MovieTorrentService])
], MovieComponent);
exports.MovieComponent = MovieComponent;
//# sourceMappingURL=movie.component.js.map