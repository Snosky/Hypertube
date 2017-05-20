import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MovieService} from "../movie.service";
import {Movie} from "../_models/movie";
import {MovieTorrent} from "../_models/movieTorrent";
import {MovieTorrentService} from "../movie-torrent.service";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit, AfterViewInit {

    slug: string;
    movie: Movie;
    torrents: MovieTorrent[];

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private movieService: MovieService,
        private movieTorrentService: MovieTorrentService
    ) { }

    ngOnInit() {
        this.slug = this.route.snapshot.params['slug'];

        this.movieService.getOne(this.slug)
            .then( (movie: Movie) => this.movie = movie )
    }

    ngAfterViewInit() {
        this.movieTorrentService.getMovieTorrents(this.slug)
            .then( (torrents: MovieTorrent[]) => this.torrents = torrents );
    }

    youtubeTrailer() {
        return this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/' + this.movie.yt_trailer_code +'?rel=0');
    }

}
