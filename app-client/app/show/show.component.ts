import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Show} from "../_models/show";
import {ActivatedRoute} from "@angular/router";
import {ShowService} from "../show.service";
import {OmdbService} from "../omdb.service";
import {Episode} from "../_models/episode";
import {FlashService} from "../flash.service";

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit, AfterViewInit {
    slug: string;
    show: Show;
    info: any;
    episodes: Episode[] = [];
    torrent: any = {};
    stream: string;

    season = -1;

    constructor(
        private route: ActivatedRoute,
        private showService: ShowService,
        private omdbService: OmdbService,
        private flash: FlashService
    ) { }

    ngOnInit() {
        this.slug = this.route.snapshot.params['slug'];

        this.showService.getOne(this.slug)
            .then( (show: Show) => {
                this.show = show;

                this.omdbService.getMoreInfo(this.show.imdb_code)
                    .then( (info:any) => this.info = info )
            })
    }

    ngAfterViewInit() {
        this.showService.getEpisodesObs(this.slug)
            .subscribe(
                episodes => this.episodes = episodes,
                error => this.flash.error(err)
            )
    }

    launchStream() {
        this.stream = 'http://localhost:3000/show/watch/' + this.torrent._id;
    }

    closeVideo() {
        this.stream = null;
    }
}
