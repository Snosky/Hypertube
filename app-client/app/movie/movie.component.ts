import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MovieService} from "../movie.service";
import {Movie} from "../_models/movie";
import {MovieTorrent} from "../_models/movieTorrent";
import {MovieTorrentService} from "../movie-torrent.service";
import {OmdbService} from "../omdb.service";
import {AuthHttp} from "angular2-jwt";
import {URLSearchParams} from "@angular/http";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit, AfterViewInit {

    slug: string;
    movie: Movie;
    torrents: MovieTorrent[];
    info: any = {};
    torrent: string;
    stream: string;

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private movieService: MovieService,
        private omdbService: OmdbService,
        private movieTorrentService: MovieTorrentService,
        private authHttp: AuthHttp
    ) { }

    ngOnInit() {
        this.slug = this.route.snapshot.params['slug'];

        this.movieService.getOne(this.slug)
            .then( (movie: Movie) => {
                this.movie = movie;
                this.omdbService.getMoreInfo(movie.imdb_code)
                    .then( info => this.info = info )
            })
    }

    ngAfterViewInit() {
        this.movieTorrentService.getMovieTorrents(this.slug)
            .then( (torrents: MovieTorrent[]) => this.torrents = torrents );
    }

    youtubeTrailer() {
        return this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/' + this.movie.yt_trailer_code +'?rel=0');
    }

    launchStream() {
        this.stream = 'http://localhost:3000/movie/watch/' + this.torrent;
        /*this.authHttp.get(')
            .subscribe(
                result => {
                    console.log(result)
                },
                error => {
                    console.log(error);
                }
            )*/

    }

}
