import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged: boolean = false;
  access_token: string = null;
  expire: number = null;

  user: any = null; // User object
  userObserver: EventEmitter<any> = new EventEmitter<any>(); // Emit an event when user value changes

  constructor(private _http: HttpClient, private _router: Router) {
      this.access_token = localStorage.getItem('access_token');
      this.expire = parseInt(localStorage.getItem('expire'));
      
      if(this.access_token){
        if(this.expire < Date.now()){
          this.isLogged = true;
          this.user = JSON.parse(localStorage.getItem('user'));
          this.userObserver.emit(this.user);
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

    // Getting user information
    this.getUser();
    
    // Redirect the user to home page
    this._router.navigate(['/']);

  }

  /**
   * Get user information from the server and emit an event with it's value
   */
  getUser(){
    if(!this.isLogged){
      return;
    }
    let headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + this.access_token);

    this._http.post("http://pics.test/api/auth/me", {}, {headers: headers})
        .subscribe((user)=>{
          this.user = this.convertUser(user);
          this.userObserver.emit(this.user);  
          // Store user information on the localstorage
          localStorage.setItem("user", JSON.stringify(this.user));

          console.log(this.user);
        },
        (err)=>{
          console.error("Get user information error");
          console.error(err);
        });
  }

  /**
   * Convert user image to default iamge picture if the iamge is not set
   */
  convertUser(user){
    user.profile_pic = user.profile_pic ? user.profile_pic : '/assets/images/user.png';
    user.profile_pic_small = user.profile_pic_small ? user.profile_pic_small : '/assets/images/user.png';

    return user;
  }

  /**
   * Logging the user out
   */
  logout(){
    this.user = null;
    this.isLogged = false;
    this.expire = null;
    this.access_token = null;

    this.userObserver.emit(this.user);
    localStorage.clear();
    
    // Redirect the user to the home page
    this._router.navigate(['/']);
  }

  uploadImage(values: any){
    let headers = new HttpHeaders()
                      .set("Accept", "application/json")
                      .set("Authorization", "Bearer " + this.access_token); 

    return this._http.post("http://pics.test/api/images", values, {
      reportProgress: true,
      observe: 'events',
      headers: headers
    });
  }

  /**
   * Redirect the user to the profile
   */
  profile(){
    this._router.navigate(['/user', this.user.id]);
  }

}
