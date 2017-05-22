import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class OmdbService {
    private url = 'http://www.omdbapi.com/?apikey=4b79467b';

    constructor(
        private http: Http
    ) { }

    getMoreInfo(imdb_id: string) {
        return this.http.get(this.url + '&i=' + imdb_id)
            .toPromise()
            .then( info => info.json() )
    }
}
