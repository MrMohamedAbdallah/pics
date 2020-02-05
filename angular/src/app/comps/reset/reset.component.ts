import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  resetForm: FormGroup;

  wrongPassword: boolean = false;

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this.resetForm = new FormGroup({
      old_password: new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
      password_confirmation: new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
    });
  }

  matchPasswords(){
    return this.resetForm.value.password == this.resetForm.value.password_confirmation;
  }

  reset(){
    this._auth.resetPassword(this.resetForm.value).subscribe(
      ()=>{
        this._auth.profile();
      },
      (err)=>{
        if(err.status == 400){
          this.wrongPassword = true;
        }
      }
    );
  }

}
