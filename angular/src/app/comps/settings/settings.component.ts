import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  user: any;
  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this.user = this._auth.user;
    this.settingsForm = new FormGroup({
      name: new FormControl(this.user.name),
      email: new FormControl(this.user.email),
      website: new FormControl(this.user.website),
      bio: new FormControl(this.user.bio),
      pic: new FormControl(null)
    });
  }

}
