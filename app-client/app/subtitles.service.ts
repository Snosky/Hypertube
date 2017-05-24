import {Injectable} from "@angular/core";
import {AppConfig} from "./app.config";
import {AuthHttp} from "angular2-jwt";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Response} from "@angular/http";

@Injectable()
export class SubtitlesService {

    constructor(
        private config: AppConfig,
        private authHttp: AuthHttp
    ) {  }

    getSubtitles(torrent_id: string, type: string) {
        return this.authHttp.get(this.config.apiUrl + '/' + type + '/subtitles/' + torrent_id)
            .map(res => res.json())
            .catch(this.handleError)
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