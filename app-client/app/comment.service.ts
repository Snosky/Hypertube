import {Injectable} from "@angular/core";
import {AppConfig} from "./app.config";
import {AuthHttp} from "angular2-jwt";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Comment} from "./_models/comment";
import {Response} from "@angular/http";

@Injectable()
export class CommentService {
    constructor(
        private config: AppConfig,
        private authHttp: AuthHttp
    ){ }

    save(comment: string, imdb_code: string): Observable<Comment> {
        return this.authHttp.post(this.config.apiUrl + '/comment/add', {comment: comment, imdb_code: imdb_code})
            .map(this.extractData)
            .catch(this.handleError);

    }

    get(imdb_code: string): Observable<Comment[]> {
            return this.authHttp.get(this.config.apiUrl + '/comment/get/' + imdb_code)
                .map(this.extractData)
                .catch(this.handleError);
    }

    private extractData(res: Response) {
        return res.json();
    }

    private handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}