import {Component, OnInit} from '@angular/core';
import {User} from "./_models/user";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    currentUser: User;
    route: any = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        router.events.subscribe((val) => {
            if (authService.isLoggedIn())
                this.currentUser = this.authService.currentUser();
            else
                this.currentUser = null;
        })
        this.route = router.url;
    }

    ngOnInit() {
    }
}
