import { Injectable } from '@angular/core';
import {AppConfig} from "./app.config";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Movie} from "./_models/movie";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MovieService {
    constructor(
      private config: AppConfig,
      private http: Http
    ) { }

    search(params: any): Observable<Movie[]> {
        let httpparams = new URLSearchParams();
        httpparams.set('limit', '24');
        if (params.page)
            httpparams.set('page', params.page.toString());
        if (params.query_term)
            httpparams.set('query_term', params.query_term);
        if (params.genres)
            httpparams.set('genres', params.genres);

        return this.http.get(this.config.apiUrl + '/movies', { search: httpparams })
            .map(res => res.json() as Movie[])
    }

    getOne(slug: string): Promise<Movie> {
        return this.http.get(this.config.apiUrl + '/movie/' + slug)
            .toPromise()
            .then(movie => movie.json() as Movie)
    }

}
