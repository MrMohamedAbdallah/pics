import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  logged: boolean = false;   // Logged state indicator
  user: any = null;
  @ViewChild('navbar', {static: false}) navbar: ElementRef;  // Navbar element

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this._auth.userObserver.subscribe(user => {
      this.user = user;
      this.logged = true;
    })
    this.user = this._auth.user;
    this.logged = this._auth.isLogged;
  }

  /**
   * Show & hide navbar menu in small devices
   */
  toggleMenu(){
    let navbar = this.navbar.nativeElement;
    console.log("HERE");

    if(navbar.classList.contains("show")){
      navbar.classList.remove("show");
    } else {
      navbar.classList.add("show");
    }
  }


}
