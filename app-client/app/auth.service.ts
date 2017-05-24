import { Injectable } from '@angular/core';
import {User} from "./_models/user";
import {Http, Response } from "@angular/http";
import {AppConfig} from "./app.config";
import {tokenNotExpired} from "angular2-jwt";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {

    constructor(
        private config: AppConfig,
        private http: Http
    ) { }

    saveToken(token: string) {
        localStorage.setItem('meanToken', token);
    }

    getToken() {
        return localStorage.getItem('meanToken');
    }

    currentUser(): User {
        //return this.logout();
        const token = this.getToken();
        let payload;
        payload = token.split('.')[1];
        payload = atob(payload);
        payload = JSON.parse(payload);
        const user = new User();
        user.username = payload.username;
        user.email = payload.email;
        user.lastname = payload.lastname;
        user.firstname = payload.firstname;
        user.lang = payload.lang;
        console.log(payload);
        user.pic = payload.pic;
        return user;
    }

    isLoggedIn() {
        return tokenNotExpired('meanToken');
    }

    register(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            let formData: any = new FormData();
            let xhr = new XMLHttpRequest();
            formData.append('username', user.username);
            formData.append('email', user.email);
            formData.append('password', user.password);
            formData.append('passwordConf', user.passwordConf);
            formData.append('lastname', user.lastname);
            formData.append('firstname', user.firstname);
            formData.append('pic', user.pic, user.pic.name);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', this.config.apiUrl + '/register', true);
            xhr.send(formData);
        })
        .then((response: Response) => {
            return response.json()
        })
        .catch(this.handleError);
        /*return this.http.post(this.config.apiUrl + '/register', user)
            .toPromise()*/

    }

    login(username: string, password: string) {
        return this.http.post(this.config.apiUrl + '/auth', {username: username, password: password})
            .toPromise()
            .then((response: Response) => {
                let res = response.json();
                if (res && res.token) {
                    this.saveToken(res.token);
                    return true;
                }
                return false
            })
            .catch(this.handleError);
    }

    logout() {
        localStorage.removeItem('meanToken');
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
