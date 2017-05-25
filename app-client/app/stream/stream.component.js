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
var movie_service_1 = require("../movie.service");
var show_service_1 = require("../show.service");
var flash_service_1 = require("../flash.service");
var subtitles_service_1 = require("../subtitles.service");
var auth_service_1 = require("../auth.service");
var StreamComponent = (function () {
    function StreamComponent(authService, movieService, showService, subtitlesService, flash) {
        this.authService = authService;
        this.movieService = movieService;
        this.showService = showService;
        this.subtitlesService = subtitlesService;
        this.flash = flash;
        this.preload = 'auto';
        this.loadPlayer = false;
        this.viewSend = false;
    }
    StreamComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentUser = this.authService.currentUser();
        this.source = 'http://localhost:3000/' + this.type + '/watch/' + this.torrentid;
        this.subtitlesService.getSubtitles(this.torrentid, this.type)
            .subscribe(function (subtitles) {
            _this.subtitles = subtitles;
            _this.loadPlayer = true;
        }, function (error) { return _this.flash.error(error); });
    };
    StreamComponent.prototype.onPlayerReady = function (api) {
        var _this = this;
        this.api = api;
        this.api.getDefaultMedia().subscriptions.progress.subscribe(function (progress) {
            if (!progress.srcElement)
                return;
            var percent = (progress.srcElement.currentTime / progress.srcElement.duration) * 100;
            if (!isNaN(percent) && percent >= 85 && _this.viewSend === false) {
                _this.viewSend = true;
                if (_this.type === 'movie')
                    _this.movieService.updateViewTime(_this.id).then(function () { }).catch(function (error) { return console.warn(error); });
                else if (_this.type === 'show')
                    _this.showService.updateViewTime(_this.id).then(function () { }).catch(function (error) { return console.warn(error); });
            }
        });
    };
    return StreamComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], StreamComponent.prototype, "type", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], StreamComponent.prototype, "id", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], StreamComponent.prototype, "torrentid", void 0);
StreamComponent = __decorate([
    core_1.Component({
        selector: 'app-stream',
        templateUrl: './stream.component.html',
        styleUrls: ['./stream.component.css'],
        inputs: ['torrentid', 'type', 'id']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        movie_service_1.MovieService,
        show_service_1.ShowService,
        subtitles_service_1.SubtitlesService,
        flash_service_1.FlashService])
], StreamComponent);
exports.StreamComponent = StreamComponent;
//# sourceMappingURL=stream.component.js.map