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
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var movie_service_1 = require("../movie.service");
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/concat");
require("rxjs/add/operator/merge");
require("rxjs/add/operator/share");
var HomeComponent = (function () {
    function HomeComponent(authService, movieService) {
        this.authService = authService;
        this.movieService = movieService;
        this.movies = [];
        this.moviesContainerHeight = 0;
        this.ratingRangeFormat = [0, 100];
        this.pageStream = new Subject_1.Subject();
        this.page = 1;
        this.searchTerms = new Subject_1.Subject();
        this.term = '';
        this.genreTerm = new Subject_1.Subject();
        this.genres = [];
        this.years = new Subject_1.Subject();
        this.rating = new Subject_1.Subject();
        this.orderTerm = new Subject_1.Subject();
        this.order = '';
        this.scrollCallback = this.getNextPage.bind(this);
    }
    HomeComponent.prototype.search = function (term) {
        this.page = 1;
        this.searchTerms.next(term);
    };
    HomeComponent.prototype.filterGenre = function (select) {
        var options = [];
        for (var i = 0; i < select.target.selectedOptions.length; i++)
            if (select.target.selectedOptions[i].value !== 'all')
                options[i] = select.target.selectedOptions[i].value;
        this.page = 1;
        this.genreTerm.next(options);
    };
    HomeComponent.prototype.yearsRangeChange = function (e) {
        this.page = 1;
        this.years.next(e);
    };
    ;
    HomeComponent.prototype.ratingRangeChange = function (e) {
        this.page = 1;
        this.rating.next(e);
    };
    HomeComponent.prototype.filterOrder = function (term) {
        this.page = 1;
        this.orderTerm.next(term);
    };
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentUser = this.authService.currentUser();
        // Get years range
        this.movieService.yearsRange()
            .then(function (range) {
            _this.yearsRange = range;
            _this.yearsRangeFormat = [range.min, range.max];
        });
        var pageSource = this.pageStream
            .map(function (pageNumber) {
            _this.page = pageNumber;
            return {
                query_term: _this.term,
                page: pageNumber,
                genres: _this.genres,
                years: _this.yearsRangeFormat,
                rating: _this.ratingRangeFormat,
                order: _this.order
            };
        });
        var genreSource = this.genreTerm
            .map(function (genres) {
            _this.genres = genres;
            return {
                query_term: _this.term,
                page: 1,
                genres: genres,
                years: _this.yearsRangeFormat,
                rating: _this.ratingRangeFormat,
                order: _this.order
            };
        });
        var yearsSource = this.years
            .map(function (range) {
            _this.yearsRangeFormat = range;
            return {
                query_term: _this.term,
                page: 1,
                genres: _this.genres,
                years: range,
                rating: _this.ratingRangeFormat,
                order: _this.order
            };
        });
        var ratingSource = this.rating
            .map(function (range) {
            _this.ratingRangeFormat = range;
            return {
                query_term: _this.term,
                page: 1,
                genres: _this.genres,
                years: _this.yearsRangeFormat,
                rating: range,
                order: _this.order
            };
        });
        var orderSource = this.orderTerm
            .map(function (order) {
            _this.order = order;
            return {
                query_term: _this.term,
                page: 1,
                genres: _this.genres,
                years: _this.yearsRangeFormat,
                rating: _this.ratingRangeFormat,
                order: order
            };
        });
        var searchSource = this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .map(function (term) {
            _this.term = term;
            return {
                query_term: term,
                page: 1,
                genres: _this.genres,
                years: _this.yearsRangeFormat,
                rating: _this.ratingRangeFormat,
                order: _this.order
            };
        });
        var source = pageSource
            .merge(searchSource, genreSource, yearsSource, ratingSource, orderSource)
            .startWith({
            query_term: this.term,
            page: this.page,
            genres: this.genres,
            years: this.yearsRangeFormat,
            rating: this.ratingRangeFormat,
            order: this.order
        })
            .switchMap(function (params) {
            return _this.movieService.search(params);
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
        return this.movieService.search({
            query_term: this.term,
            page: this.page + 1,
            genres: this.genres,
            years: this.yearsRangeFormat,
            rating: this.ratingRangeFormat
        });
        // TODO : Change this to someting better
    };
    HomeComponent.prototype.onResize = function (e) {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
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
        movie_service_1.MovieService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map