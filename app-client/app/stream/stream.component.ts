import {Component, Input} from '@angular/core';
import {VgAPI} from 'videogular2/core';
import {MovieService} from "../movie.service";
import {ShowService} from "../show.service";
import {Subject} from "rxjs";
import {FlashService} from "../flash.service";

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css'],
    inputs: ['source', 'type', 'id']
})
export class StreamComponent {
    preload:string = 'auto';
    api: VgAPI;
    viewSend = false;

    @Input()
    type: string;

    @Input()
    id: string;

    constructor(
        private movieService: MovieService,
        private showService: ShowService,
        private flash: FlashService
    ) { }

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
