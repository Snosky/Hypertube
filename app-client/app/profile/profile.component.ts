import {Component, OnInit} from "@angular/core";
import {UserService} from "../user.service";
import {User} from "../_models/user";
import {FlashService} from "../flash.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    id: string;
    user: User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private flash: FlashService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.userService.profile(this.id)
            .subscribe(
                (user: User) => this.user = user,
                error => {
                    this.flash.error('An error occurred', true);
                    this.router.navigate([''])
                }
            );
    }
}