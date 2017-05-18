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

    getDefault(page: number) {
        let params = new URLSearchParams();
        params.set('limit', '24');
        params.set('page', page.toString());

        return this.http.get(this.url + 'list_movies.json', { search: params })
            .map(res => <any[]> res.json().data.movies)
            /*.toPromise()
            .then(response => response.json().data.movies || [])
            .catch(this.handleError);*/
    }

    search(params: any): Observable<any[]> {
        let httpparams = new URLSearchParams();
        httpparams.set('limit', '24');
        if (params.page)
            httpparams.set('page', params.page.toString());
        if (params.query_term)
            httpparams.set('query_term', params.query_term);
        console.log(httpparams.toString());
        return this.http.get(this.url + 'list_movies.json', { search: httpparams })
            .map(res => <any[]> res.json().data.movies)
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }
}
