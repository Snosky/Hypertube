import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {Observable} from "rxjs/Observable";

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';

interface ScrollPosition {
    sH: number;
    sT: number;
    cH: number;
}

const DEFAULT_SCROLL_POSITION: ScrollPosition = {
    sH: 0,
    sT: 0,
    cH: 0
};

@Directive({
    selector: '[appInfiniteScroller]'
})
export class InfiniteScrollerDirective implements AfterViewInit {
    private scrollEvent: any;
    private userScrolledDown: any;
    private requestStream: any;
    private requestOnScroll: any;

    @Input()
    scrollCallback: any;

    @Input()
    immediateCallback: any;

    @Input()
    scrollPercent = 70;

    constructor(private elm: ElementRef) { }

    ngAfterViewInit() {
        this.registerScrollEvent();
        this.streamScrollEvents();
        this.requestCallbackOnScroll();
    }

    private registerScrollEvent() {
        this.scrollEvent = Observable.fromEvent(this.elm.nativeElement, 'scroll');
    }

    private streamScrollEvents() {
        this.userScrolledDown = this.scrollEvent
            .map((e: any): ScrollPosition => ({
                sH: e.target.scrollHeight,
                sT: e.target.scrollTop,
                cH: e.target.clientHeight
            }))
            .pairwise()
            .filter((positions: ScrollPosition[]) => this.isUserScrollingDown(positions) && this.isScrollExpectedPercent(positions[1]))
    }

    private requestCallbackOnScroll() {
        this.requestOnScroll = this.userScrolledDown;

        if (this.immediateCallback) {
            this.requestOnScroll
                .startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]);
        }

        this.requestOnScroll
            .exhaustMap(() => { return this.scrollCallback(); })
            .subscribe(() => { });
    }

    private isUserScrollingDown = (position: ScrollPosition[]) => {
        return position[0].sT < position[1].sT;
    };

    private isScrollExpectedPercent = (position: ScrollPosition) => {
        return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
    };
}
