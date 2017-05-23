import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css'],
    inputs: ['source']
})
export class StreamComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
}
