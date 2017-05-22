import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Show} from "../_models/show";
import {ActivatedRoute} from "@angular/router";
import {ShowService} from "../show.service";
import {OmdbService} from "../omdb.service";

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
    slug: string;
    show: Show;
    info: any;

    constructor(
        private route: ActivatedRoute,
        private showService: ShowService,
        private omdbService: OmdbService
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
}
