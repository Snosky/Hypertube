import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from "./_models/user";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {FlashService} from "./flash.service";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    currentUser: User;
    route: any = '';
    navbar = false;

    private _refresh: any;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
        private flash: FlashService
    ) {
        router.events.subscribe((val) => {
            if (authService.isLoggedIn()) {
                this.currentUser = this.authService.currentUser();
                this._refresh = this.authService.refresh.subscribe(refresh => this.currentUser = this.authService.currentUser())
            }
            else
                this.currentUser = null;
        })
        this.route = router.url;
    }

    ngOnInit() {
    }

    updateLang(lang: string) {
        if (['fre', 'eng'].indexOf(lang) === -1)
            return false;

        this.userService.updateLang(lang)
            .subscribe(
                result => {
                    this.currentUser.lang = lang;
                    this.authService.saveToken(result.token)
                },
                error => this.flash.error(error)
            );
    }

    ngOnDestroy() {
        if (this.currentUser) {
            this._refresh._unsubscribe();
        }
    }

    toggleNavBar(){
        this.navbar = !this.navbar;
    }

}
