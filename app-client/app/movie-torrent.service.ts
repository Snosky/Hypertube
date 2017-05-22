import { Injectable } from '@angular/core';
import {AppConfig} from "./app.config";
import {MovieTorrent} from "./_models/movieTorrent";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class MovieTorrentService {

    constructor(
        private config: AppConfig,
        private authHttp: AuthHttp
    ) { }

    getMovieTorrents(slug: string): Promise<MovieTorrent[]>{
        return this.authHttp.get(this.config.apiUrl + '/movie/' + slug + '/torrents')
            .toPromise()
            .then(torrents => torrents.json() as MovieTorrent[])
    }
}
