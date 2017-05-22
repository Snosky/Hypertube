import { Component, OnInit } from '@angular/core';
import {Show} from "../_models/show";
import {ActivatedRoute} from "@angular/router";
import {ShowService} from "../show.service";

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
    slug: string;
    show: Show;

    constructor(
        private route: ActivatedRoute,
        private showService: ShowService
    ) { }

    ngOnInit() {
        this.slug = this.route.snapshot.params['slug'];

        this.showService.getOne(this.slug)
            .then( (show: Show) => this.show = show )
    }

}
