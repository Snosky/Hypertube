import {Component, Input, OnInit} from '@angular/core';
import {VgAPI} from 'videogular2/core';
import {MovieService} from "../movie.service";
import {ShowService} from "../show.service";
import {Subject} from "rxjs";
import {FlashService} from "../flash.service";
import {SubtitlesService} from "../subtitles.service";
import {AuthService} from "../auth.service";
import {User} from "../_models/user";

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css'],
    inputs: ['torrentid', 'type', 'id']
})
export class StreamComponent implements OnInit {
    currentUser: User;
    preload:string = 'auto';
    loadPlayer = false;
    api: VgAPI;
    viewSend = false;
    subtitles:any;
    source: string;

    @Input()
    type: string;

    @Input()
    id: string;

    @Input()
    torrentid: string;

    constructor(
        private authService: AuthService,
        private movieService: MovieService,
        private showService: ShowService,
        private subtitlesService: SubtitlesService,
        private flash: FlashService
    ) { }

    ngOnInit() {
        this.currentUser = this.authService.currentUser();
        this.source = 'http://localhost:3000/' + this.type + '/watch/' + this.torrentid;

        this.subtitlesService.getSubtitles(this.torrentid, this.type)
            .subscribe(
                subtitles => {
                    this.subtitles = subtitles;
                    this.loadPlayer = true;
                },
                error => this.flash.error(error)
            )
    }

    onPlayerReady(api:VgAPI) {
        this.api = api;

        this.api.getDefaultMedia().subscriptions.progress.subscribe(
            (progress) => {
                if (!progress.srcElement)
                    return;

                let percent = (progress.srcElement.currentTime / progress.srcElement.duration) * 100;

                if (!isNaN(percent) && percent >= 85 && this.viewSend === false){
                    this.viewSend = true;
                    if (this.type === 'movie')
                        this.movieService.updateViewTime(this.id).then(() => { }).catch((error) => console.warn(error));
                    else if (this.type === 'show')
                        this.showService.updateViewTime(this.id).then(() => { }).catch((error) => console.warn(error));
                }
            }
        );
    }
}
