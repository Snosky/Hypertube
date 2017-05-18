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
var Subject_1 = require("rxjs/Subject");
var HomeComponent = (function () {
    function HomeComponent(authService, ytsService) {
        var _this = this;
        this.authService = authService;
        this.ytsService = ytsService;
        this.page = 1;
        this.moviesContainerHeight = 0;
        this.searchTerm = new Subject_1.Subject();
        this.processMovies = function (movies) {
            _this.movies = _this.movies.concat(movies);
        };
        this.scrollCallback = this.getMovies.bind(this);
    }
    HomeComponent.prototype.search = function (term) {
        this.searchTerm.next(term);
    };
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentUser = this.authService.currentUser();
        this.movies = this.searchTerm
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(function (term) { return _this.ytsService.search({ query_term: term }); })
            .catch(function (error) {
            console.warn(error);
            return Observable_1.Observable.of([]);
        });
    };
    HomeComponent.prototype.ngAfterViewInit = function () {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
        this.getMovies();
    };
    HomeComponent.prototype.getMovies = function () {
        /*this.ytsService.getDefault(this.page)
            .toPromise()
            .then((movies) => {
                if (this.movies[0])
                    this.movies = this.movies.concat(movies);
                else
                    this.movies = movies;
            });
        this.page++;
        /*return this.ytsService.getDefault(this.page)
            .then((movies) => {
                this.processMovies(movies);

            })*/
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
        yts_service_1.YtsService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map