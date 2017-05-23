import { Component } from '@angular/core';
import {VgAPI} from 'videogular2/core';

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css'],
    inputs: ['source']
})
export class StreamComponent{
    private api: any;

    constructor() { }


    onPlayerReady(api: VgAPI){
        this.api = api;

        this.api.getDefaultMedia().progress.subscribe(
            (progress: any) => {
                console.log(progress);
            }
        )
    }
}
