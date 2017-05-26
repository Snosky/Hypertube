import {Component, OnInit} from '@angular/core';
import {Show} from "../_models/show";
import {ActivatedRoute, Router} from "@angular/router";
import {ShowService} from "../show.service";
import {OmdbService} from "../omdb.service";
import {Episode} from "../_models/episode";
import {FlashService} from "../flash.service";

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
    slug: string;
    show: Show;
    info: any;
    episodes: Episode[] = [];
    torrent: any = {};
    openVideo = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
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
                    .then( (info:any) => this.info = info );

                this.showService.getEpisodesObs(this.slug)
                    .subscribe(
                        episodes => this.episodes = episodes,
                        error => {
                            this.flash.error(error)
                        }
                    )
            })
            .catch((error) => {
                if (error.status === 404) {
                    this.flash.error('Show not found', true);
                } else {
                    this.flash.error('An error occurred. Please retry', true);
                }
                this.router.navigate(['/shows']);
            })
    }

    launchStream() {
        this.openVideo = true;
    }

    closeVideo() {
        this.openVideo = false;
    }
}
