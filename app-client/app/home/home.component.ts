import { Component, OnInit } from '@angular/core';
import {User} from "../_models/user";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    currentUser: User;

    constructor(
        private authService: AuthService
    ) { }

  ngOnInit() {
        this.currentUser = this.authService.currentUser();
  }

}
