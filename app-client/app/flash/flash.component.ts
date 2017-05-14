import { Component, OnInit } from '@angular/core';
import {FlashService} from "../flash.service";

@Component({
    moduleId: module.id,
    selector: 'app-flash',
    templateUrl: './flash.component.html',
    styleUrls: ['./flash.component.css']
})
export class FlashComponent implements OnInit {
    message: any;
    constructor(private flashService: FlashService) { }

    ngOnInit() {
        this.flashService.getMessage().subscribe(message => { this.message = message });
    }
}
