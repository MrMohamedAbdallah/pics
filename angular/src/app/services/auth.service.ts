import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged: boolean = false;
  access_token: string = null;
  expire: number = null;

  constructor(private _http: HttpClient, private _router: Router) {
      this.access_token = localStorage.getItem('access_token');
      this.expire = localStorage.getItem('expire');

      if(this.access_token){
        if(this.expire < Date.now()){
          this.isLogged = true;
        }
      }
   }


  login(email: string, password: string){
    
    let headers = new HttpHeaders().set("Accept", "application/json");
    return this._http.post("http://pics.test/api/auth/login", {
      email: email,
      password: password
    }, {headers: headers});
    
  }
  
  register(email, name, password, password_confirmation){
    let headers = new HttpHeaders().set("Accept", "application/json");

    return this._http.post("http://pics.test/api/auth/register", {
      email, name, password, password_confirmation
    }, {
      headers: headers
    });
  }
  
  /**
   * Store token and expire data in the localstorage
   * @param token string
   * @param expire string
   */
  storeToken(token, expire){
    expire = Date.now() + parseInt(expire);
    
    // Store in localstorage
    localStorage.setItem("access_token", token);
    localStorage.setItem("expire",expire);
    
    // Store in the varibale
    this.access_token = token;
    this.expire = parseInt(expire);

    this.isLogged = true;

    // Redirect the user to home page
    this._router.navigate(['/']);
  }

}
