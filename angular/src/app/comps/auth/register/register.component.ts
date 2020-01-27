import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  emailIsUsed: boolean = false; // If the email is used or not
  lastEmail: string = null;

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      name: new FormControl(null, {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
      password_confirmation: new FormControl(null, {validators: [Validators.required]}),
    });
  }

  checkPassword(){
    return this.registerForm.value.password == this.registerForm.value.password_confirmation; 
  }

  register(){
    let email = this.registerForm.value.email;
    let name = this.registerForm.value.name;
    let password = this.registerForm.value.password;
    let password_confirmation = this.registerForm.value.password_confirmation;

    // Abort if users uses the same invalid email
    if(this.lastEmail == email){
      return;
    }

    this.lastEmail = email;

    this._auth.register(email, name, password, password_confirmation).subscribe(
      (data: any)=>{
        this._auth.storeToken(data.access_token, data.expires_in);
      },
      (error: any)=>{
        if(error.status == 401){
          if(error.error.errors.email){
            this.emailIsUsed = true;
          }
        }
      }
    );

  }

}
