import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  wrongInfo: boolean = false; // will be true when email and password are worng

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
    });
  }


  login(){
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;

    this._auth.login(email, password).subscribe(
      (data)=>{
        this._auth.storeToken(data.access_token, data.expires_in);
      },
      (err)=>{
        if(err.status == 401){
          this.wrongInfo = true;
        }
        console.log(err);
      });
  }

}
