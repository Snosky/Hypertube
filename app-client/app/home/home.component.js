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
var auth_service_1 = require("../auth.service");
var yts_service_1 = require("../yts.service");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/concat");
require("rxjs/add/operator/merge");
require("rxjs/add/operator/share");
var Subject_1 = require("rxjs/Subject");
var router_1 = require("@angular/router");
var HomeComponent = (function () {
    function HomeComponent(authService, ytsService, router) {
        this.authService = authService;
        this.ytsService = ytsService;
        this.router = router;
        this.movies = [];
        this.moviesContainerHeight = 0;
        this.pageStream = new Subject_1.Subject();
        this.page = 1;
        this.searchTerms = new Subject_1.Subject();
        this.term = '';
        this.genreTerm = new Subject_1.Subject();
        this.genre = '';
        this.scrollCallback = this.getNextPage.bind(this);
    }
    HomeComponent.prototype.search = function (term) {
        this.page = 1;
        this.searchTerms.next(term);
    };
    HomeComponent.prototype.filterGenre = function (term) {
        this.page = 1;
        this.genreTerm.next(term);
    };
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentUser = this.authService.currentUser();
        var genreSource = this.genreTerm
            .map(function (genre) {
            _this.genre = genre;
            return { query_term: _this.term, page: 1, genre: genre };
        });
        var pageSource = this.pageStream
            .map(function (pageNumber) {
            _this.page = pageNumber;
            return { query_term: _this.term, page: pageNumber, genre: _this.genre };
        });
        var searchSource = this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .map(function (term) {
            _this.term = term;
            return { query_term: term, page: 1, genre: _this.genre };
        });
        var source = pageSource
            .merge(searchSource, genreSource)
            .startWith({ query_term: this.term, page: this.page, genre: this.genre })
            .switchMap(function (params) {
            return _this.ytsService.search(params);
        })
            .catch(function (error) {
            console.warn(error);
            return Observable_1.Observable.of([]);
        });
        source.subscribe(function (movies) {
            if (!movies)
                return false;
            if (_this.page > 1)
                _this.movies = _this.movies.concat(movies);
            else
                _this.movies = movies;
        });
    };
    HomeComponent.prototype.ngAfterViewInit = function () {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
    };
    HomeComponent.prototype.getNextPage = function () {
        this.pageStream.next(this.page + 1);
        return this.ytsService.search({ query_term: this.term, page: this.page + 1 });
        // TODO : Change this to someting better
    };
    HomeComponent.prototype.onResize = function (e) {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
    };
    HomeComponent.prototype.goToMovie = function (slug) {
        console.log(slug);
        this.router.navigate(['/slug', slug]);
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'app-home',
        templateUrl: './home.component.html',
        styleUrls: ['./home.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        yts_service_1.YtsService,
        router_1.Router])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map