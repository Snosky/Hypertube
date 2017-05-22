import { Injectable } from '@angular/core';
import {AppConfig} from "./app.config";
import {Http, RequestOptions, Response} from "@angular/http";
import {User} from "./_models/user";
import {AuthHttp} from "angular2-jwt";

import 'rxjs/add/operator/toPromise';
import {AuthService} from "./auth.service";

@Injectable()
export class UserService {

    constructor(
        private config: AppConfig,
        private authHttp: AuthHttp,
        private authService: AuthService
    ) { }

    update(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            const xhr = new XMLHttpRequest();
            formData.append('username', user.username);
            formData.append('email', user.email);
            formData.append('firstname', user.firstname);
            formData.append('lastname', user.lastname);

            if (user.password)
                formData.append('password', user.password);
            if (user.passwordConf)
                formData.append('passwordConf', user.passwordConf);
            if (user.pic)
                formData.append('pic', user.pic);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(JSON.parse(xhr.response).errors);
                    }
                }
            };
            xhr.open('POST', this.config.apiUrl + '/user/update', true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.authService.getToken());
            xhr.send(formData);
        });
    }

    me(): Promise<User> {
        return this.authHttp.get(this.config.apiUrl + '/user/me')
            .toPromise()
            .then((response: Response) => {
                return response.json()
            })
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let err;
        if (error instanceof Response) {
            const body = error.json();
            err = body.errors || JSON.stringify(body);
        } else {
            err = JSON.parse(error).errors;
            //err = error.message ? error.message : error.toString();
        }
        return Promise.reject(err);
    }
}
