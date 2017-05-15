import { Injectable } from '@angular/core';
import {AppConfig} from "./app.config";
import {Http, Response} from "@angular/http";
import {User} from "./_models/user";
import {AuthHttp} from "angular2-jwt";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

    constructor(
        private config: AppConfig,
        private authHttp: AuthHttp
    ) { }

    update(user: User): Promise<User> {
        return this.authHttp.post(this.config.apiUrl + '/user/update', user)
            .toPromise()
            .then((response: Response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let err;
        if (error instanceof Response) {
            const body = error.json();
            err = body.errors || JSON.stringify(body);
        } else {
            err = error.message ? error.message : error.toString();
        }
        return Promise.reject(err);
    }
}
