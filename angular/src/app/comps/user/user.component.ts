import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userId: string = null;
  user: any = null;

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this._route.snapshot.paramMap.get('id');

  }

  getUser(user){
    this.user = user;
    this.user.profile_pic_small = this.user.profile_pic_small ? this.user.profile_pic_small : "/assets/images/user.png";
  }

}
