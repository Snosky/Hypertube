import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {NavigationStart, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Injectable()
export class FlashService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear flash message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange)
                    this.keepAfterNavigationChange = false; // If keep on change
                else
                    this.subject.next();
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'danger', text: message });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
