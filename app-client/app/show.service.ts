import { Injectable } from '@angular/core';
import {AppConfig} from "./app.config";
import {URLSearchParams, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Show} from "./_models/show";
import {Episode} from "./_models/episode";

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ShowService {

    constructor(
        private config: AppConfig,
        private authHttp: AuthHttp
    ) { }

    search(params: any): Observable<Show[]> {
        let httpparams = new URLSearchParams();
        httpparams.set('limit', '36');
        if (params.page)
            httpparams.set('page', params.page.toString());
        if (params.query_term)
            httpparams.set('query_term', params.query_term);
        if (params.genres && params.genres != 'all')
            httpparams.set('genres', params.genres);
        if (params.years)
            httpparams.set('years', params.years);
        if (params.rating)
            httpparams.set('rating', params.rating);
        if (params.order && params.order !== 'default')
            httpparams.set('order', params.order);

        return this.authHttp.get(this.config.apiUrl + '/shows', { search: httpparams })
            .map(res => res.json() as Show[])
    }

    getOne(slug: string): Promise<Show> {
        return this.authHttp.get(this.config.apiUrl + '/show/' + slug)
            .toPromise()
            .then(movie => movie.json() as Show)
    }

    yearsRange(): Promise<any> {
        return this.authHttp.get(this.config.apiUrl + '/shows/years')
            .toPromise()
            .then(range => range.json());
    }

    getEpisodes(slug: string): Promise<Episode[]> {
        return this.authHttp.get(this.config.apiUrl + '/show/' + slug + '/episodes')
            .toPromise()
            .then(res => res.json() as Episode[])
    }

    getEpisodesObs(slug: string): Observable<Episode[]> {
        return this.authHttp.get(this.config.apiUrl + '/show/' + slug + '/episodes')
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    updateViewTime(show_id: string) {
        return this.authHttp.get(this.config.apiUrl + '/show/'+ show_id +'/seen')
            .toPromise();
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
        return Observable.throw(errMsg);
    }

}
