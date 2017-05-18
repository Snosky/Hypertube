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
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/pairwise");
require("rxjs/add/operator/map");
require("rxjs/add/operator/exhaustMap");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/startWith");
var DEFAULT_SCROLL_POSITION = {
    sH: 0,
    sT: 0,
    cH: 0
};
var InfiniteScrollerDirective = (function () {
    function InfiniteScrollerDirective(elm) {
        var _this = this;
        this.elm = elm;
        this.scrollPercent = 70;
        this.isUserScrollingDown = function (position) {
            return position[0].sT < position[1].sT;
        };
        this.isScrollExpectedPercent = function (position) {
            return ((position.sT + position.cH) / position.sH) > (_this.scrollPercent / 100);
        };
    }
    InfiniteScrollerDirective.prototype.ngAfterViewInit = function () {
        this.registerScrollEvent();
        this.streamScrollEvents();
        this.requestCallbackOnScroll();
    };
    InfiniteScrollerDirective.prototype.registerScrollEvent = function () {
        this.scrollEvent = Observable_1.Observable.fromEvent(this.elm.nativeElement, 'scroll');
    };
    InfiniteScrollerDirective.prototype.streamScrollEvents = function () {
        var _this = this;
        this.userScrolledDown = this.scrollEvent
            .map(function (e) { return ({
            sH: e.target.scrollHeight,
            sT: e.target.scrollTop,
            cH: e.target.clientHeight
        }); })
            .pairwise()
            .filter(function (positions) { return _this.isUserScrollingDown(positions) && _this.isScrollExpectedPercent(positions[1]); });
    };
    InfiniteScrollerDirective.prototype.requestCallbackOnScroll = function () {
        var _this = this;
        this.requestOnScroll = this.userScrolledDown;
        if (this.immediateCallback) {
            this.requestOnScroll
                .startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]);
        }
        this.requestOnScroll
            .exhaustMap(function () { return _this.scrollCallback(); })
            .subscribe(function () { });
    };
    return InfiniteScrollerDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InfiniteScrollerDirective.prototype, "scrollCallback", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InfiniteScrollerDirective.prototype, "immediateCallback", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InfiniteScrollerDirective.prototype, "scrollPercent", void 0);
InfiniteScrollerDirective = __decorate([
    core_1.Directive({
        selector: '[appInfiniteScroller]'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], InfiniteScrollerDirective);
exports.InfiniteScrollerDirective = InfiniteScrollerDirective;
//# sourceMappingURL=infinite-scroller.directive.js.map