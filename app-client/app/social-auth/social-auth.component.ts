import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SocialAuthService} from "../social-auth.service";

import 'rxjs/add/operator/switchMap';
import {FlashService} from "../flash.service";

@Component({
    selector: 'app-social-auth',
    templateUrl: './social-auth.component.html',
    styleUrls: ['./social-auth.component.css']
})
export class SocialAuthComponent implements OnInit {
    returnUrl: string;
    loading = false;

    constructor(
        private socialAuthService: SocialAuthService,
        private router: Router,
        private route: ActivatedRoute,
        private flash: FlashService
    ) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        let provider = this.route.snapshot.params['provider'];
        if (provider) {
            this.loading = true;
            this.socialAuthService.login(provider, this.route.snapshot.queryParams)
                .then((success) => {
                    if (success === true) {
                        this.loading = false;
                        this.flash.success('You are now logged in.', true);
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.loading = false;
                        this.flash.error('An error occurred. Please retry.');
                    }
                })
                .catch((error) => {
                    this.loading = false;
                    this.flash.error('An error occurred. Please retry.');
                });
        }
    }

    facebookLogin() {
        this.loading = true;
        window.location.href = 'https://www.facebook.com/v2.9/dialog/oauth?client_id=1006427196157157&scope=email&redirect_uri=http://localhost:3001/auth/facebook';
    }

    login42() {
        this.loading = true;
        window.location.href= 'https://api.intra.42.fr/oauth/authorize?client_id=b891f269ed7d8f5bca65afaccb26aeffe83e885d8fe173a2c4fd51668daee2fb&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2F42&response_type=code'
    }

}
