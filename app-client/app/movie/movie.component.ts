import { Component, OnInit } from '@angular/core';
import {YtsService} from "../yts.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

    movie: any;

    constructor(
        private route: ActivatedRoute,
        private ytsService: YtsService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        let id = this.route.snapshot.params['id'];

        this.ytsService.getOne(id)
            .then( (movie:any) => this.movie = movie )
    }

    youtubeTrailer() {
        return this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/' + this.movie.yt_trailer_code +'?rel=0');
    }

}
