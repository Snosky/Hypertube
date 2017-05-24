import {Component, Input, OnInit} from '@angular/core';
import {VgAPI} from 'videogular2/core';
import {MovieService} from "../movie.service";
import {ShowService} from "../show.service";
import {Subject} from "rxjs";
import {FlashService} from "../flash.service";
import {SubtitlesService} from "../subtitles.service";

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css'],
    inputs: ['source', 'type', 'id']
})
export class StreamComponent implements OnInit {
    preload:string = 'auto';
    api: VgAPI;
    viewSend = false;
    subtitles:any;

    @Input()
    type: string;

    @Input()
    id: string;

    constructor(
        private movieService: MovieService,
        private showService: ShowService,
        private subtitlesService: SubtitlesService,
        private flash: FlashService
    ) { }

    ngOnInit() {
        this.subtitlesService.getSubtitles(this.id)
            .subscribe(
                subtitles => this.subtitles = subtitles,
                error => this.flash.error(error)
            )
    }

    onPlayerReady(api:VgAPI) {
        this.api = api;

        this.api.getDefaultMedia().subscriptions.progress.subscribe(
            (progress) => {
                let percent = (progress.srcElement.currentTime / progress.srcElement.duration) * 100;

                if (!isNaN(percent) && percent >= 85 && this.viewSend === false){
                    this.viewSend = true;
                    console.log('Movie view');
                    if (this.type === 'movie')
                        this.movieService.updateViewTime(this.id).then(() => { console.log('Movie set to view') }).catch((error) => console.warn(error));
                    else if (this.type === 'show')
                        this.showService.updateViewTime(this.id);
                }
            }
        );
    }
}
