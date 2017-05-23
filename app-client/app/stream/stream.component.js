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
var StreamComponent = (function () {
    function StreamComponent(movieService, showService) {
        this.movieService = movieService;
        this.showService = showService;
        this.preload = 'auto';
        this.viewSend = false;
    }
    StreamComponent.prototype.onPlayerReady = function (api) {
        var _this = this;
        this.api = api;
        this.api.getDefaultMedia().subscriptions.progress.subscribe(function (progress) {
            var percent = (progress.srcElement.currentTime / progress.srcElement.duration) * 100;
            if (!isNaN(percent) && percent >= 85 && _this.viewSend === false) {
                _this.viewSend = true;
                console.log('Movie view');
                if (_this.type === 'movie')
                    _this.movieService.updateViewTime(_this.id).then(function () { console.log('Movie set to view'); }).catch(function (error) { return console.warn(error); });
                else if (_this.type === 'show')
                    _this.showService.updateViewTime(_this.id);
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
StreamComponent = __decorate([
    core_1.Component({
        selector: 'app-stream',
        templateUrl: './stream.component.html',
        styleUrls: ['./stream.component.css'],
        inputs: ['source', 'type', 'id']
    }),
    __metadata("design:paramtypes", [movie_service_1.MovieService,
        show_service_1.ShowService])
], StreamComponent);
exports.StreamComponent = StreamComponent;
//# sourceMappingURL=stream.component.js.map