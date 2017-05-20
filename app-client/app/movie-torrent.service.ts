import { Injectable } from '@angular/core';
import {AppConfig} from "./app.config";
import {Http} from "@angular/http";
import {MovieTorrent} from "./_models/movieTorrent";

@Injectable()
export class MovieTorrentService {

    constructor(
        private config: AppConfig,
        private http: Http
    ) { }

    getMovieTorrents(slug: string): Promise<MovieTorrent[]>{
        return this.http.get(this.config.apiUrl + '/movie/' + slug + '/torrents')
            .toPromise()
            .then(torrents => torrents.json() as MovieTorrent[])
    }
}
