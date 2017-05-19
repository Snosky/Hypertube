import { Injectable } from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";

import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";

@Injectable()
export class YtsService {
    url  = 'https://yts.ag/api/v2/';

    constructor(
        private http: Http
    ) { }

    search(params: any): Observable<any[]> {
        let httpparams = new URLSearchParams();
        httpparams.set('limit', '24');
        if (params.page)
            httpparams.set('page', params.page.toString());
        if (params.query_term)
            httpparams.set('query_term', params.query_term);
        if (params.genre)
            httpparams.set('genre', params.genre);
        return this.http.get(this.url + 'list_movies.json', { search: httpparams })
            .map(res => <any[]> res.json().data.movies)
    }

    getOne(id: number) {
        let params = new URLSearchParams();
        params.set('movie_id', id.toString());
        return this.http.get(this.url + 'movie_details.json', { search: params })
            .toPromise()
            .then(movie => movie.json().data.movie)
    }
}
