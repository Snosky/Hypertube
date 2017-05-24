import { Injectable } from '@angular/core';
import {AppConfig} from "./app.config";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Movie} from "./_models/movie";

import 'rxjs/add/operator/toPromise';
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class MovieService {
    constructor(
      private config: AppConfig,
      private authHttp: AuthHttp
    ) { }

    search(params: any): Observable<Movie[]> {
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

        return this.authHttp.get(this.config.apiUrl + '/movies', { search: httpparams })
            .map(res => res.json() as Movie[])
    }

    getOne(slug: string): Promise<Movie> {
        return this.authHttp.get(this.config.apiUrl + '/movie/' + slug)
            .toPromise()
            .then(movie => movie.json() as Movie)
    }

    yearsRange(): Promise<any> {
        return this.authHttp.get(this.config.apiUrl + '/movies/years')
            .toPromise()
            .then(range => range.json());
    }

    setView(slug: string): Promise<any> {
        return this.authHttp.get(this.config.apiUrl + '/movie/' + slug + '/view')
            .toPromise()
    }

    updateViewTime(movie_id: string) {
        return this.authHttp.get(this.config.apiUrl + '/movie/' + movie_id + '/seen')
            .toPromise();
    }

}
