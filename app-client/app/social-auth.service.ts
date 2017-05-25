import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";

import 'rxjs/add/operator/toPromise';
import {AppConfig} from "./app.config";
import {AuthService} from "./auth.service";

@Injectable()
export class SocialAuthService {

    constructor(
        private config: AppConfig,
        private http: Http,
        private authService: AuthService
    ) { }

    login(provider: string, params: any) {
        switch (provider) {
            case 'facebook':
                return this.facebook(params.code);

            case '42':
                return this.fortytwo(params.code);
        }
    }

    private facebook(code: string) {
        return this.http.post(this.config.apiUrl + '/auth/facebook', {code: code})
            .toPromise()
            .then((response: Response) => {
                let res = response.json();
                if (res && res.token) {
                    this.authService.saveToken(res.token);
                    return true;
                }
                return false;
            })
            .catch((error: Response | any) => {
                return false;
            });
    }

    private fortytwo(code: string) {
        return this.http.post(this.config.apiUrl + '/auth/42', {code: code})
            .toPromise()
            .then((response: Response) => {
                let res = response.json();
                if (res && res.token) {
                    this.authService.saveToken(res.token);
                    return true;
                }
                return false;
            })
            .catch((error: Response | any) => {
            });
    }
}
